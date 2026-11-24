import type { DispatchRecord, MidiOutputAdapter, NoteEvent, Score } from './types.js';
import { validateEvents } from './composer.js';

interface Scheduled { beat: number; on: boolean; event: NoteEvent }
export interface TransportOptions {
  now?: () => number;
  onEvent?: (record: DispatchRecord) => void;
  onStop?: (reason: string) => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
  /** Main-thread suspension threshold, not an acoustic timing guarantee. */
  maxGapMs?: number;
}

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
  private readonly now: () => number;
  readonly records: DispatchRecord[] = [];
  constructor(private output: MidiOutputAdapter, private hooks: TransportOptions = {}) {
    this.now = hooks.now ?? (() => performance.now());
  }
  get running(): boolean { return this.runningValue; }
  get beat(): number { return this.running ? Math.max(0, (this.now() - this.origin) * this.tempo / 60000) : 0; }
  get activeCount(): number { return this.active.size; }

  start(score: Pick<Score, 'events' | 'length' | 'options'>, autoTick = true): void {
    this.stop('restart');
    validateEvents(score.events);
    if (!Number.isFinite(score.length) || score.length <= 0 || !Number.isFinite(score.options.tempo) || score.options.tempo < 30 || score.options.tempo > 240 || score.events.some(e => e.start + e.duration > score.length + 1e-8)) throw new RangeError('Invalid transport score');
    this.queue = score.events.flatMap(event => [{ beat: event.start, on: true, event }, { beat: event.start + event.duration, on: false, event }]);
    this.queue.sort((a, b) => a.beat - b.beat || Number(a.on) - Number(b.on) || a.event.id.localeCompare(b.event.id));
    this.tempo = score.options.tempo; this.endBeat = score.length; this.cursor = 0;
    this.origin = this.lastWake = this.now(); this.records.length = 0; this.runningValue = true;
    this.tick();
    if (autoTick && this.running) this.timer = setInterval(() => this.tick(), 10);
  }

  /** Public for deterministic tests and hosts that already own an update loop. */
  tick(): void {
    if (!this.running) return;
    const now = this.now();
    const revision = this.revision;
    if (now - this.lastWake > (this.hooks.maxGapMs ?? 300)) { this.stop('suspended'); return; }
    this.lastWake = now;
    const beat = this.beat;
    try {
      while (this.running && revision === this.revision && this.cursor < this.queue.length && this.queue[this.cursor].beat <= beat + 1e-8) {
        const item = this.queue[this.cursor++], e = item.event, address = `${e.channel}:${e.pitch}`;
        if (item.on) {
          // Stale attacks are skipped; they are never replayed as a catch-up burst.
          if (e.start + e.duration <= beat) continue;
          const prior = this.active.get(address);
          if (prior) {
            this.active.delete(address);
            this.send([128 | (prior.channel - 1), prior.pitch, 0], prior.id, beat);
            if (!this.running || revision !== this.revision) return;
          }
          // Own the note before dispatch/observer callbacks; they may call stop synchronously.
          this.active.set(address, e);
          this.send([144 | (e.channel - 1), e.pitch, Math.max(1, Math.round(e.velocity * 127))], e.id, beat);
        } else if (this.active.get(address)?.id === e.id) {
          this.active.delete(address); this.send([128 | (e.channel - 1), e.pitch, 0], e.id, beat);
        }
      }
      if (!this.running || revision !== this.revision) return;
      if (beat >= this.endBeat) { this.stop('ended'); this.hooks.onEnd?.(); }
    } catch (error) {
      this.stop('output-error');
      this.hooks.onError?.(error);
    }
  }

  setOutput(output: MidiOutputAdapter): void { this.stop('output-changed'); this.output = output; }
  stop(reason = 'stopped'): void {
    const wasRunning = this.running;
    const stopBeat = this.beat;
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined; this.runningValue = false;
    this.revision++;
    // Best effort for each owned address even if one disconnected output throws.
    const releasing = [...this.active.values()]; this.active.clear();
    for (const e of releasing) {
      try { this.send([128 | (e.channel - 1), e.pitch, 0], e.id, stopBeat); } catch { /* Output disconnected. */ }
    }
    this.queue = []; this.cursor = 0;
    if (wasRunning) this.hooks.onStop?.(reason);
  }
  private send(bytes: number[], eventId: string, beat: number): void {
    this.output.send(bytes);
    const record = { bytes, beat, eventId, time: this.now() };
    this.records.push(record); this.hooks.onEvent?.(record);
  }
}
