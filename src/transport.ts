import type { DispatchRecord, MidiOutputAdapter, NoteEvent, Score } from './types.js';
import { validateEvents } from './composer.js';

interface Scheduled { beat: number; on: boolean; event: NoteEvent }
export type TransportScore = Pick<Score, 'events' | 'length' | 'options'> & { setup?: readonly (readonly number[])[] };
export interface TransportOptions {
  now?: () => number;
  onEvent?: (record: DispatchRecord) => void;
  onStop?: (reason: string) => void;
  /** Called when the score's end is due. Call chain() here to continue seamlessly; otherwise the transport stops. */
  onEnd?: () => void;
  onError?: (error: unknown) => void;
  /** Called on every tick before anything is dispatched, with the current beat. */
  onTick?: (beat: number) => void;
  /** Main-thread suspension threshold, not an acoustic timing guarantee. */
  maxGapMs?: number;
  /** 'host': the owner advances the beat with advance(); no timer, wall clock or suspension check. */
  clock?: 'internal' | 'host';
  /** Internal clock only: dispatch this far ahead to outputs that accept timestamps, such as Web MIDI. */
  lookaheadMs?: number;
}

/** Notes may ring this many beats past a score's end, carried into the next chained score. */
const MAX_OVERHANG = 8;
const addressOf = (e: NoteEvent) => `${e.channel}:${e.pitch}`;

/** Beat-to-monotonic-time transport. Future events stay local; no remote timestamp is invented. */
export class Transport {
  private queue: Scheduled[] = [];
  private cursor = 0;
  private active = new Map<string, NoteEvent>();
  private origin = 0;
  private lastWake = 0;
  private timer?: ReturnType<typeof setInterval>;
  private tempo = 120;
  private endBeat = 0;
  private runningValue = false;
  private revision = 0;
  private hostBeat = 0;
  private overshootValue = 0;
  private chained = false;
  private readonly now: () => number;
  readonly records: DispatchRecord[] = [];
  constructor(private output: MidiOutputAdapter, private hooks: TransportOptions = {}) {
    this.now = hooks.now ?? (() => performance.now());
  }
  get running(): boolean { return this.runningValue; }
  get hosted(): boolean { return this.hooks.clock === 'host'; }
  get beat(): number { return !this.running ? 0 : Math.max(0, this.rawBeat()); }
  /** The latest beat already handed to the output; replacements must start after it. */
  get horizon(): number { return this.beat + this.lookahead * this.tempo / 60000; }
  /** Beats the last score ran past its end before the next one was chained. */
  get overshoot(): number { return this.overshootValue; }
  get activeCount(): number { return this.active.size; }

  private rawBeat(): number { return this.hosted ? this.hostBeat : (this.now() - this.origin) * this.tempo / 60000; }
  private get lookahead(): number { return !this.hosted && this.output.timestamps ? Math.max(0, this.hooks.lookaheadMs ?? 0) : 0; }

  start(score: TransportScore, autoTick = true, startBeat = 0): void {
    this.stop('restart');
    this.load(score);
    const from = Math.max(0, startBeat), now = this.now();
    this.hostBeat = from; this.origin = now - from * 60000 / this.tempo; this.lastWake = now;
    this.records.length = 0; this.overshootValue = 0; this.runningValue = true;
    this.sendSetup(score.setup, from);
    this.tick();
    if (autoTick && !this.hosted && this.running) this.timer = setInterval(() => this.tick(), 10);
  }

  /**
   * Continue with the next score exactly where the current one ends, without releasing held notes.
   * Notes still sounding keep their release, shifted onto the new score's timeline. Use from onEnd.
   */
  chain(score: TransportScore): void {
    if (!this.running) { this.start(score); return; }
    const previousEnd = this.endBeat, previousTempo = this.tempo;
    const carried = this.queue.slice(this.cursor)
      .filter(item => !item.on && this.active.get(addressOf(item.event))?.id === item.event.id)
      .map(item => ({ ...item, beat: item.beat - previousEnd }));
    this.load(score, carried);
    // The boundary time is exact, so phrases never drift whatever the tick timing.
    if (this.hosted) this.hostBeat -= previousEnd; else this.origin += previousEnd * 60000 / previousTempo;
    this.records.length = 0;
    this.revision++; this.chained = true;
    this.sendSetup(score.setup, 0);
  }

  /** Replace every attack from fromBeat onwards. Notes already started keep their own release. */
  replaceFrom(fromBeat: number, events: readonly NoteEvent[]): void {
    if (!this.running) return;
    validateEvents(events);
    if (fromBeat <= this.horizon || events.some(e => e.start < fromBeat - 1e-9 || e.start + e.duration > this.endBeat + MAX_OVERHANG)) throw new RangeError('Replacement must start after the dispatched horizon');
    const kept = this.queue.slice(this.cursor).filter(item => (item.on ? item.beat : item.event.start) < fromBeat - 1e-9);
    this.queue = this.sorted([...kept, ...this.schedule(events)]);
    this.cursor = 0;
  }

  /** Host clock only: move the beat on by a musical duration, in quarter-note beats, and dispatch what is due. */
  advance(beats: number): void {
    if (!this.running || !this.hosted || !Number.isFinite(beats) || beats <= 0) return;
    this.hostBeat += beats; this.tick();
  }

  /** Public for deterministic tests and hosts that already own an update loop. */
  tick(): void {
    if (!this.running) return;
    const now = this.now();
    const revision = this.revision;
    if (!this.hosted && now - this.lastWake > (this.hooks.maxGapMs ?? 300)) { this.stop('suspended'); return; }
    this.lastWake = now;
    try {
      this.hooks.onTick?.(this.beat);
      if (!this.running || revision !== this.revision) return;
      const beat = this.rawBeat();
      const horizon = beat + this.lookahead * this.tempo / 60000;
      while (this.running && revision === this.revision && this.cursor < this.queue.length && this.queue[this.cursor].beat <= horizon + 1e-8) {
        const item = this.queue[this.cursor++], e = item.event, address = addressOf(e), at = this.timeOf(item.beat, now);
        if (item.on) {
          // Stale attacks are skipped; they are never replayed as a catch-up burst.
          if (e.start + e.duration <= beat) continue;
          const prior = this.active.get(address);
          if (prior) {
            this.active.delete(address);
            this.send([128 | (prior.channel - 1), prior.pitch, 0], prior.id, item.beat, at);
            if (!this.running || revision !== this.revision) return;
          }
          // Own the note before dispatch/observer callbacks; they may call stop synchronously.
          this.active.set(address, e);
          this.send([144 | (e.channel - 1), e.pitch, Math.max(1, Math.round(e.velocity * 127))], e.id, item.beat, at);
        } else if (this.active.get(address)?.id === e.id) {
          this.active.delete(address); this.send([128 | (e.channel - 1), e.pitch, 0], e.id, item.beat, at);
        }
      }
      if (!this.running || revision !== this.revision) return;
      if (horizon >= this.endBeat - 1e-9) {
        this.overshootValue = Math.max(0, beat - this.endBeat);
        this.chained = false;
        this.hooks.onEnd?.();
        if (this.chained) { this.chained = false; this.tick(); return; }
        if (this.running) this.stop('ended');
      }
    } catch (error) {
      this.stop('output-error');
      this.hooks.onError?.(error);
    }
  }

  setOutput(output: MidiOutputAdapter): void { this.stop('output-changed'); this.output = output; }
  stop(reason = 'stopped'): void {
    const wasRunning = this.running;
    const stopBeat = this.beat, lookahead = this.lookahead;
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined; this.runningValue = false;
    this.revision++;
    // Messages scheduled ahead could start a note after its release; cancel them and repeat the release late.
    const interrupted = wasRunning && lookahead > 0 && reason !== 'ended';
    if (interrupted) try { this.output.clear?.(); } catch { /* Output disconnected. */ }
    // Best effort for each owned address even if one disconnected output throws.
    const releasing = [...this.active.values()]; this.active.clear();
    const late = this.now() + lookahead + 5;
    for (const e of releasing) {
      try {
        this.send([128 | (e.channel - 1), e.pitch, 0], e.id, stopBeat);
        if (interrupted) this.send([128 | (e.channel - 1), e.pitch, 0], e.id, stopBeat, late);
      } catch { /* Output disconnected. */ }
    }
    this.queue = []; this.cursor = 0;
    if (wasRunning) this.hooks.onStop?.(reason);
  }

  private load(score: TransportScore, carried: Scheduled[] = []): void {
    validateEvents(score.events);
    if (!Number.isFinite(score.length) || score.length <= 0 || !Number.isFinite(score.options.tempo) || score.options.tempo < 30 || score.options.tempo > 240 || score.events.some(e => e.start >= score.length || e.start + e.duration > score.length + MAX_OVERHANG)) throw new RangeError('Invalid transport score');
    this.queue = this.sorted([...this.schedule(score.events), ...carried]);
    this.tempo = score.options.tempo; this.endBeat = score.length; this.cursor = 0;
  }
  private schedule(events: readonly NoteEvent[]): Scheduled[] {
    return events.flatMap(event => [{ beat: event.start, on: true, event }, { beat: event.start + event.duration, on: false, event }]);
  }
  private sorted(queue: Scheduled[]): Scheduled[] {
    return queue.sort((a, b) => a.beat - b.beat || Number(a.on) - Number(b.on) || a.event.id.localeCompare(b.event.id));
  }
  private timeOf(beat: number, now: number): number | undefined {
    if (!this.lookahead) return undefined;
    const at = this.origin + beat * 60000 / this.tempo;
    return at > now ? at : undefined;
  }
  private sendSetup(setup: TransportScore['setup'], beat: number): void {
    for (const bytes of setup ?? []) this.send([...bytes], 'setup', beat, this.timeOf(beat, this.now()));
  }
  private send(bytes: number[], eventId: string, beat: number, at?: number): void {
    if (at === undefined) this.output.send(bytes); else this.output.send(bytes, at);
    const record: DispatchRecord = { bytes, beat, eventId, time: this.now() };
    if (at !== undefined) record.at = at;
    this.records.push(record); this.hooks.onEvent?.(record);
  }
}
