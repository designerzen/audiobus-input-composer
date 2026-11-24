import { composePhrase, normalizeOptions } from './composer.js';
import { Transport, type TransportOptions } from './transport.js';
import type { ComposerOptions, DispatchRecord, MidiOutputAdapter, Phrase } from './types.js';

export interface SessionHooks {
  onPhrase?: (phrase: Phrase) => void;
  onStop?: (reason: string) => void;
  onEvent?: (record: DispatchRecord) => void;
  onError?: (error: unknown) => void;
}
export interface PerformanceRecord {
  schemaVersion: 1;
  generatorVersion: '0.1.0';
  phrases: { phrase: Phrase; time: number }[];
  dispatches: DispatchRecord[];
  truncated: boolean;
}

/** Continuous phrase generation. Changes are atomically applied at the next eight-bar boundary. */
export class ComposerSession {
  private target: ComposerOptions;
  private appliedValue: ComposerOptions;
  private finishing = false;
  private index = 0;
  private readonly clock: () => number;
  private readonly transport: Transport;
  private record: PerformanceRecord = { schemaVersion: 1, generatorVersion: '0.1.0', phrases: [], dispatches: [], truncated: false };
  constructor(options: Partial<ComposerOptions>, output: MidiOutputAdapter, private hooks: SessionHooks = {}, transportOptions: Pick<TransportOptions, 'now' | 'maxGapMs'> = {}) {
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
      onEnd: () => { if (this.finishing) this.hooks.onStop?.('finished'); else { this.index++; this.begin(); } },
    });
  }
  get running(): boolean { return this.transport.running; }
  get beat(): number { return this.transport.beat; }
  get applied(): ComposerOptions { return normalizeOptions(this.appliedValue); }
  get options(): ComposerOptions { return normalizeOptions(this.target); }
  get recording(): PerformanceRecord { return structuredClone(this.record); }
  update(options: Partial<ComposerOptions>): ComposerOptions {
    this.target = normalizeOptions({ ...this.target, ...options }); return this.options;
  }
  start(): void {
    this.stop(); this.index = 0; this.finishing = false;
    this.record = { schemaVersion: 1, generatorVersion: '0.1.0', phrases: [], dispatches: [], truncated: false };
    this.begin();
  }
  finish(): void { if (this.running) this.finishing = true; }
  stop(reason = 'stopped'): void { this.finishing = true; this.transport.stop(reason); }
  setOutput(output: MidiOutputAdapter): void { this.finishing = true; this.transport.setOutput(output); }
  private begin(): void {
    this.appliedValue = normalizeOptions(this.target);
    const phrase = composePhrase(this.appliedValue, this.index, 0);
    if (this.record.phrases.length < 1024) this.record.phrases.push({ phrase, time: this.clock() }); else this.record.truncated = true;
    this.transport.start({ events: phrase.events, length: phrase.length, options: this.appliedValue });
    if (this.transport.running) this.hooks.onPhrase?.(phrase);
  }
}
