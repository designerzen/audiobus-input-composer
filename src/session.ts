import { composePhrase, normalizeOptions, phraseKey, type PhraseKey } from './composer.js';
import { Transport, type TransportOptions } from './transport.js';
import type { ComposerOptions, DispatchRecord, MidiOutputAdapter, Phrase } from './types.js';
import { GENERATOR_VERSION } from './version.js';

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

/** Controls that change texture but not harmony or form; they take effect at the next bar. */
const BAR_LEVEL = ['energy', 'swing', 'parts'] as const;
const sameBarLevel = (a: ComposerOptions, b: ComposerOptions) => a.energy === b.energy && a.swing === b.swing && a.parts.join() === b.parts.join();
const samePhraseLevel = (a: ComposerOptions, b: ComposerOptions) => JSON.stringify({ ...a, energy: 0, swing: 0, parts: [] }) === JSON.stringify({ ...b, energy: 0, swing: 0, parts: [] });

/**
 * Continuous phrase generation. Energy, swing and ensemble apply at the next bar; everything else
 * applies atomically at the next eight-bar boundary. A pending change of key or mode recomposes the
 * last bar as the new key's dominant, so the change is prepared rather than abrupt.
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
  private readonly clock: () => number;
  private readonly transport: Transport;
  private record: PerformanceRecord = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, phrases: [], dispatches: [], truncated: false };
  constructor(options: Partial<ComposerOptions>, output: MidiOutputAdapter, private hooks: SessionHooks = {}, transportOptions: Pick<TransportOptions, 'now' | 'maxGapMs' | 'clock' | 'lookaheadMs'> = {}) {
    this.target = normalizeOptions(options); this.appliedValue = normalizeOptions(this.target);
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
  /** Which selected changes are still waiting: bar-level controls, or ones that wait for the next phrase. */
  get pending(): { bar: boolean; phrase: boolean } {
    return { bar: !sameBarLevel(this.target, this.appliedValue), phrase: !samePhraseLevel(this.target, this.appliedValue) };
  }
  get recording(): PerformanceRecord { return structuredClone(this.record); }
  update(options: Partial<ComposerOptions>): ComposerOptions {
    this.target = normalizeOptions({ ...this.target, ...options }); return this.options;
  }
  start(): void {
    this.stop(); this.index = 0; this.finishing = false; this.programKey = '';
    this.record = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, phrases: [], dispatches: [], truncated: false };
    this.begin(false);
  }
  /** Stop after the next closed cadence; an open phrase is followed by one that closes. */
  finish(): void { if (this.running) this.finishing = true; }
  stop(reason = 'stopped'): void { this.finishing = true; this.transport.stop(reason); }
  /** Internal clock only: play on from the start of a bar of the current phrase. */
  seek(bar: number): void { if (this.phrase) this.transport.seek(Math.floor(bar) * 4); }
  setOutput(output: MidiOutputAdapter): void { this.finishing = true; this.programKey = ''; this.transport.setOutput(output); }

  private next(): void {
    if (this.finishing && this.phrase?.closed) { this.transport.stop('ended'); this.hooks.onStop?.('finished'); return; }
    this.index++; this.begin(true);
  }
  private begin(chain: boolean): void {
    this.appliedValue = normalizeOptions(this.target);
    this.phraseFinal = this.finishing;
    this.phraseNext = this.nextKey();
    const phrase = composePhrase(this.appliedValue, this.index, 0, { final: this.phraseFinal, next: this.phraseNext });
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
   * Recompose the rest of the phrase from the next bar line when bar-level controls changed, or from
   * the last bar when the next phrase's key no longer matches the one this phrase leads into.
   */
  private reviseBar(beat: number): void {
    const phrase = this.phrase;
    if (!phrase) return;
    const from = (Math.floor(beat / 4 + 1e-9) + 1) * 4;
    const next = this.nextKey();
    const rekey = from === phrase.length - 4 && JSON.stringify(next) !== JSON.stringify(this.phraseNext);
    if (sameBarLevel(this.target, this.appliedValue) && !rekey) return;
    // Wait until the half beat before the bar line, so a dragged slider recomposes once per bar.
    if (from >= phrase.length || from - beat > .5 || from <= this.transport.horizon) return;
    const options = normalizeOptions({ ...this.appliedValue, ...Object.fromEntries(BAR_LEVEL.map(key => [key, this.target[key]])) });
    const tag = ++this.revision;
    if (from === phrase.length - 4) this.phraseNext = next;
    const revised = composePhrase(options, this.index, 0, { final: this.phraseFinal, next: this.phraseNext });
    const events = revised.events.filter(e => e.start >= from - 1e-9).map(e => ({ ...e, id: `${e.id}~r${tag}` }));
    this.transport.replaceFrom(from, events);
    this.appliedValue = options;
    const bar = from / 4;
    this.phrase = {
      ...revised, options,
      events: [...phrase.events.filter(e => e.start < from - 1e-9), ...events],
      bars: [...phrase.bars.slice(0, bar), ...revised.bars.slice(bar)],
    };
    this.hooks.onRevise?.(this.phrase, from);
  }
}
