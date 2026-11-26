import { composePhrase, normalizeOptions, phraseKey, type PhraseKey } from './composer.js';
import { EmotionFollower, plutchikPath, type EmotionPoint, type EmotionStep } from './emotion-follower.js';
import { GENRE_PROFILES } from './genres.js';
import { clamp, mod } from './theory.js';
import { Transport, type TransportOptions } from './transport.js';
import { PERFORMANCE_CUES, type ComposerOptions, type DispatchRecord, type MidiOutputAdapter, type PerformanceCue, type Phrase } from './types.js';
import { GENERATOR_VERSION } from './version.js';

export interface NextBarTarget {
  /** 0-based bar index within its phrase (0 when landing on the start of the next phrase). */
  bar: number;
  /** True when the next cueable bar is bar 1 of the next phrase rather than inside the current phrase. */
  nextPhrase: boolean;
  /** Beats remaining until that bar boundary (0 when stopped). */
  beatsUntil: number;
}

export interface SessionHooks {
  onPhrase?: (phrase: Phrase) => void;
  /** The rest of the current phrase was recomposed from fromBeat after a bar-level control change. */
  onRevise?: (phrase: Phrase, fromBeat: number) => void;
  onStop?: (reason: string) => void;
  onEvent?: (record: DispatchRecord) => void;
  onError?: (error: unknown) => void;
}
export interface PerformanceRecord {
  schemaVersion: 1;
  generatorVersion: string;
  phrases: { phrase: Phrase; time: number }[];
  dispatches: DispatchRecord[];
  truncated: boolean;
}

/** Controls that change texture, feel or tuning but not harmony or form; they take effect at the next bar. */
const BAR_LEVEL = ['energy', 'swing', 'parts', 'groove', 'dynamics', 'tuning'] as const;
const CUT_CUES = new Set<PerformanceCue>(['bridge', 'drop', 'key-change']);
const sameBarLevel = (a: ComposerOptions, b: ComposerOptions) =>
  a.energy === b.energy && a.swing === b.swing && a.parts.join() === b.parts.join() && a.groove === b.groove && a.dynamics === b.dynamics && a.tuning === b.tuning;
const samePhraseLevel = (a: ComposerOptions, b: ComposerOptions) =>
  JSON.stringify({ ...a, energy: 0, swing: 0, parts: [], groove: undefined, dynamics: undefined, tuning: undefined }) ===
  JSON.stringify({ ...b, energy: 0, swing: 0, parts: [], groove: undefined, dynamics: undefined, tuning: undefined });

/**
 * Continuous phrase generation. Energy, swing, ensemble and performance cues apply at the next bar;
 * everything else applies atomically at the next eight-bar boundary. A pending change of key or mode
 * recomposes the last bar as the new key's dominant, so the change is prepared rather than abrupt.
 */
export class ComposerSession {
  private target: ComposerOptions;
  private appliedValue: ComposerOptions;
  private finishing = false;
  private index = 0;
  private phrase?: Phrase;
  private phraseFinal = false;
  private phraseNext?: PhraseKey;
  private revision = 0;
  private programKey = '';
  private queuedCueValue?: PerformanceCue;
  private launchCue?: PerformanceCue;
  private cutAtBeat?: number;
  private activeCueValue?: PerformanceCue;
  private activeCueFromBar?: number;
  private activeCueStartEnergy?: number;
  private emotionFollower: EmotionFollower;
  private activeEmotionPath: EmotionStep[] = [];
  private readonly clock: () => number;
  private readonly transport: Transport;
  private record: PerformanceRecord = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, phrases: [], dispatches: [], truncated: false };
  constructor(options: Partial<ComposerOptions>, output: MidiOutputAdapter, private hooks: SessionHooks = {}, transportOptions: Pick<TransportOptions, 'now' | 'maxGapMs' | 'clock' | 'lookaheadMs'> = {}) {
    this.target = normalizeOptions(options); this.appliedValue = normalizeOptions(this.target);
    this.emotionFollower = new EmotionFollower({ emotion: this.appliedValue.emotion, intensity: this.appliedValue.intensity });
    this.clock = transportOptions.now ?? (() => performance.now());
    this.transport = new Transport(output, {
      ...transportOptions,
      onEvent: r => {
        if (this.record.dispatches.length < 100_000) this.record.dispatches.push(r); else this.record.truncated = true;
        this.hooks.onEvent?.(r);
      },
      onStop: reason => { if (reason !== 'ended') this.hooks.onStop?.(reason); },
      onError: error => this.hooks.onError?.(error),
      onTick: beat => this.reviseBar(beat),
      onEnd: () => this.next(),
    });
  }
  get running(): boolean { return this.transport.running; }
  get beat(): number { return this.transport.beat; }
  /** True when a host advances the session with advance() instead of the session timing itself. */
  get hosted(): boolean { return this.transport.hosted; }
  /** Host clock: move on by quarter-note beats of the host's transport. Phrases chain without drift. */
  advance(beats: number): void { this.transport.advance(beats); }
  get applied(): ComposerOptions { return normalizeOptions(this.appliedValue); }
  get options(): ComposerOptions { return normalizeOptions(this.target); }
  get queuedCue(): PerformanceCue | undefined { return this.queuedCueValue ?? this.launchCue; }
  get activeCue(): PerformanceCue | undefined { return this.activeCueValue; }
  /** Sounding emotion of the current bar (or settled emotion when stopped). */
  get currentEmotion(): EmotionPoint {
    if (this.running && this.phrase) {
      const barIdx = clamp(Math.floor(this.beat / 4), 0, Math.max(0, this.phrase.bars.length - 1));
      const bar = this.phrase.bars[barIdx];
      if (bar?.emotion !== undefined) return { emotion: bar.emotion, intensity: bar.intensity ?? this.appliedValue.intensity };
    }
    return { emotion: this.appliedValue.emotion, intensity: this.appliedValue.intensity };
  }
  /** Active Plutchik transition steps playing in the current phrase (one bar per step). */
  get emotionPath(): readonly EmotionStep[] { return this.activeEmotionPath.map(s => ({ ...s })); }
  /** Upcoming Plutchik path from the current sounding emotion to the selected target emotion. */
  get plannedEmotionPath(): readonly EmotionStep[] {
    return plutchikPath(this.currentEmotion, { emotion: this.target.emotion, intensity: this.target.intensity });
  }
  get nextBarTarget(): NextBarTarget {
    if (!this.running || !this.phrase) return { bar: 0, nextPhrase: false, beatsUntil: 0 };
    const len = this.cutAtBeat ?? this.phrase.length;
    const ref = Math.max(this.beat, this.transport.horizon);
    const nextBeat = (Math.floor(ref / 4 + 1e-9) + 1) * 4;
    if (nextBeat >= len - 1e-9) return { bar: 0, nextPhrase: true, beatsUntil: Math.max(0, len - this.beat) };
    return { bar: Math.round(nextBeat / 4), nextPhrase: false, beatsUntil: Math.max(0, nextBeat - this.beat) };
  }
  /** Which selected changes are still waiting: bar-level controls, phrase-level controls, or a queued performance cue. */
  get pending(): { bar: boolean; phrase: boolean; cue?: PerformanceCue } {
    const base = { bar: !sameBarLevel(this.target, this.appliedValue), phrase: !samePhraseLevel(this.target, this.appliedValue) };
    return this.queuedCue ? { ...base, cue: this.queuedCue } : base;
  }
  get recording(): PerformanceRecord { return structuredClone(this.record); }
  update(options: Partial<ComposerOptions>): ComposerOptions {
    this.target = normalizeOptions({ ...this.target, ...options }); return this.options;
  }
  /** Arm or clear a performance cue for the very next bar boundary. */
  cue(kind: PerformanceCue | null): PerformanceCue | undefined {
    if (kind !== null && !PERFORMANCE_CUES.includes(kind)) throw new RangeError('Unknown performance cue');
    if (this.launchCue && kind && CUT_CUES.has(kind)) { this.launchCue = kind; return this.launchCue; }
    this.queuedCueValue = kind ?? undefined;
    return this.queuedCueValue;
  }
  clearCue(): void { this.queuedCueValue = undefined; }
  start(): void {
    const initialCue = this.running ? undefined : this.queuedCueValue;
    this.stop(); this.index = 0; this.finishing = false; this.programKey = '';
    this.queuedCueValue = initialCue;
    this.emotionFollower.reset({ emotion: this.target.emotion, intensity: this.target.intensity });
    this.activeEmotionPath = [];
    this.record = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, phrases: [], dispatches: [], truncated: false };
    this.begin(false);
  }
  /** Stop after the next closed cadence; an open phrase is followed by one that closes. */
  finish(): void { if (this.running) this.finishing = true; }
  stop(reason = 'stopped'): void {
    this.finishing = true;
    this.clearCueState();
    this.transport.stop(reason);
  }
  private clearCueState(): void {
    this.queuedCueValue = undefined; this.launchCue = undefined; this.cutAtBeat = undefined;
    this.activeCueValue = undefined; this.activeCueFromBar = undefined; this.activeCueStartEnergy = undefined;
  }
  /** Internal clock only: play on from the start of a bar of the current phrase. */
  seek(bar: number): void {
    if (!this.phrase) return;
    const to = clamp(Math.floor(bar), 0, Math.max(0, this.phrase.bars.length - 1)) * 4;
    if (this.cutAtBeat !== undefined && this.launchCue !== undefined) {
      this.cutAtBeat = undefined; this.launchCue = undefined;
      this.transport.seek(to, { events: this.phrase.events, length: this.phrase.length });
      return;
    }
    this.transport.seek(to);
  }
  setOutput(output: MidiOutputAdapter): void { this.finishing = true; this.programKey = ''; this.transport.setOutput(output); }

  private next(): void {
    if (this.finishing && this.phrase?.closed) { this.clearCueState(); this.transport.stop('ended'); this.hooks.onStop?.('finished'); return; }
    this.index++; this.begin(true);
  }
  private begin(chain: boolean): void {
    this.cutAtBeat = undefined;
    const cue = this.launchCue ?? this.queuedCueValue;
    this.launchCue = undefined; this.queuedCueValue = undefined;
    let cueStartEnergy: number | undefined;
    if (cue === 'key-change') {
      this.target = normalizeOptions({ ...this.target, root: mod(this.target.root + 2, 12) });
    } else if (cue === 'drop') {
      this.target = normalizeOptions({ ...this.target, energy: clamp(Math.max(this.target.energy + .18, .78), 0, 1) });
    } else if (cue === 'crescendo') {
      cueStartEnergy = this.target.energy;
      this.target = normalizeOptions({ ...this.target, energy: clamp(Math.max(cueStartEnergy + .3, .8), 0, 1) });
    }
    this.appliedValue = normalizeOptions(this.target);
    if (chain) {
      const targetPoint: EmotionPoint = { emotion: this.appliedValue.emotion, intensity: this.appliedValue.intensity };
      const cur = this.emotionFollower.current;
      if (targetPoint.emotion !== cur.emotion || Math.abs(targetPoint.intensity - cur.intensity) > 1e-6) {
        this.emotionFollower.guideTo(targetPoint);
      }
      this.activeEmotionPath = this.emotionFollower.transitioning ? this.emotionFollower.takeForBars(8) : [];
    } else {
      this.activeEmotionPath = [];
    }
    if (cue === 'bridge' || cue === 'drop') {
      const wantRole = cue === 'bridge' ? 'contrast' : 'return';
      const form = GENRE_PROFILES[this.appliedValue.genre].form;
      const slot = form.findIndex(s => s.role === wantRole);
      if (slot >= 0) this.index += mod(slot - (this.index % form.length), form.length);
    }
    this.activeCueValue = cue;
    this.activeCueFromBar = cue ? 0 : undefined;
    this.activeCueStartEnergy = cueStartEnergy;
    this.phraseFinal = this.finishing || cue === 'resolve';
    this.phraseNext = this.nextKey();
    const context = {
      final: this.phraseFinal,
      next: this.phraseNext,
      ...(this.activeEmotionPath.length ? { emotionPath: this.activeEmotionPath } : {}),
      ...(cue ? { cue, cueFromBar: 0, ...(cueStartEnergy !== undefined ? { cueStartEnergy } : {}) } : {}),
    };
    const phrase = composePhrase(this.appliedValue, this.index, 0, context);
    this.phrase = phrase;
    if (this.record.phrases.length < 1024) this.record.phrases.push({ phrase, time: this.clock() }); else this.record.truncated = true;
    const score = { events: phrase.events, length: phrase.length, options: this.appliedValue, setup: this.setupFor(phrase) };
    if (chain) this.transport.chain(score); else this.transport.start(score, true);
    if (this.transport.running) this.hooks.onPhrase?.(phrase);
  }
  /** Program changes only when they differ from what the output last received. */
  private setupFor(phrase: Phrase): number[][] | undefined {
    if (!phrase.setup) { this.programKey = ''; return undefined; }
    const key = JSON.stringify(phrase.setup);
    if (key === this.programKey) return undefined;
    this.programKey = key;
    return phrase.setup;
  }
  /** Key of the phrase after this one, as the selected options would make it. */
  private nextKey(): PhraseKey | undefined {
    return this.finishing ? undefined : phraseKey(this.target, this.index + 1);
  }
  /**
   * Recompose the rest of the phrase from the next bar line when bar-level controls or cues trigger,
   * or from the last bar when the next phrase's key no longer matches the one this phrase leads into.
   */
  private reviseBar(beat: number): void {
    const phrase = this.phrase;
    if (!phrase || this.cutAtBeat !== undefined) return;
    const from = (Math.floor(beat / 4 + 1e-9) + 1) * 4;
    const next = this.nextKey();
    const rekey = from === phrase.length - 4 && JSON.stringify(next) !== JSON.stringify(this.phraseNext);
    const barChanged = !sameBarLevel(this.target, this.appliedValue);
    const cue = this.queuedCueValue;
    if (!barChanged && !rekey && !cue) return;
    // Wait until the half beat before the bar line, so a dragged slider recomposes once per bar.
    if (from >= phrase.length || from - beat > .5 || from <= this.transport.horizon) return;

    if (cue && CUT_CUES.has(cue)) {
      this.transport.replaceFrom(from, [], from);
      this.cutAtBeat = from;
      this.launchCue = cue;
      this.queuedCueValue = undefined;
      return;
    }

    let options = normalizeOptions({ ...this.appliedValue, ...Object.fromEntries(BAR_LEVEL.map(key => [key, this.target[key]])) });
    const bar = from / 4;
    const tag = ++this.revision;

    if (cue === 'resolve') {
      const revised = composePhrase(options, this.index, 0, { final: true, cue: 'resolve', cueFromBar: bar });
      const events = revised.events.filter(e => e.start >= from - 1e-9).map(e => ({ ...e, id: `${e.id}~r${tag}` }));
      const endBeat = from + 4;
      this.transport.replaceFrom(from, events, endBeat);
      this.cutAtBeat = endBeat;
      this.appliedValue = options;
      this.activeCueValue = 'resolve';
      this.activeCueFromBar = bar;
      this.activeCueStartEnergy = undefined;
      this.queuedCueValue = undefined;
      this.phrase = {
        ...revised, options, length: endBeat, closed: true, cadence: 'authentic', cue: 'resolve',
        events: [...phrase.events.filter(e => e.start < from - 1e-9).map(e => e.start + e.duration > endBeat ? { ...e, duration: Math.max(.01, endBeat - e.start) } : e), ...events],
        bars: [...phrase.bars.slice(0, bar), revised.bars[bar]],
      };
      this.hooks.onRevise?.(this.phrase, from);
      return;
    }

    if (cue === 'crescendo') {
      const startEnergy = options.energy;
      const peakEnergy = clamp(Math.max(startEnergy + .3, .8), 0, 1);
      if (this.target.energy === startEnergy) this.target = normalizeOptions({ ...this.target, energy: peakEnergy });
      options = normalizeOptions({ ...options, energy: peakEnergy });
      this.activeCueValue = 'crescendo';
      this.activeCueFromBar = bar;
      this.activeCueStartEnergy = startEnergy;
      this.queuedCueValue = undefined;
    } else if (cue === 'breakdown') {
      this.activeCueValue = 'breakdown';
      this.activeCueFromBar = bar;
      this.activeCueStartEnergy = undefined;
      this.queuedCueValue = undefined;
    } else if (this.target.energy !== this.appliedValue.energy && (this.activeCueValue === 'crescendo' || this.activeCueValue === 'breakdown')) {
      this.activeCueValue = undefined;
      this.activeCueFromBar = undefined;
      this.activeCueStartEnergy = undefined;
    }

    if (from === phrase.length - 4) this.phraseNext = next;
    const activeInPhrase = this.activeCueValue === 'crescendo' || this.activeCueValue === 'breakdown' ? this.activeCueValue : undefined;
    const revised = composePhrase(options, this.index, 0, {
      final: this.phraseFinal,
      next: this.phraseNext,
      ...(this.activeEmotionPath.length ? { emotionPath: this.activeEmotionPath } : {}),
      ...(activeInPhrase ? {
        cue: activeInPhrase,
        cueFromBar: this.activeCueFromBar ?? bar,
        ...(this.activeCueStartEnergy !== undefined ? { cueStartEnergy: this.activeCueStartEnergy } : {}),
      } : {}),
    });
    const events = revised.events.filter(e => e.start >= from - 1e-9).map(e => ({ ...e, id: `${e.id}~r${tag}` }));
    this.transport.replaceFrom(from, events);
    this.appliedValue = options;
    this.phrase = {
      ...revised, options,
      events: [...phrase.events.filter(e => e.start < from - 1e-9), ...events],
      bars: [...phrase.bars.slice(0, bar), ...revised.bars.slice(bar)],
    };
    this.hooks.onRevise?.(this.phrase, from);
  }
}
