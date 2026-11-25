import { mod, nearestDegree, SCALES } from './theory.js';

/** Krumhansl–Kessler key profiles, tonic first. */
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

export interface KeyEstimate { root: number; mode: 'major' | 'minor'; /** Correlation with the key profile, −1–1. */ confidence: number }

function correlation(a: readonly number[], b: readonly number[]): number {
  const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

/** Krumhansl–Schmuckler key finding over a 12-bin pitch-class weight histogram, C first. */
export function estimateKey(weights: readonly number[]): KeyEstimate | undefined {
  if (weights.length !== 12 || !weights.some(w => w > 0)) return undefined;
  let best: KeyEstimate | undefined;
  for (let root = 0; root < 12; root++) {
    const rotated = weights.map((_, i) => weights[mod(i + root, 12)]);
    for (const [mode, profile] of [['major', MAJOR_PROFILE], ['minor', MINOR_PROFILE]] as const) {
      const confidence = correlation(rotated, profile);
      if (!best || confidence > best.confidence) best = { root, mode, confidence };
    }
  }
  return best;
}

export interface FollowerHooks {
  /** MIDI clock: 24 pulses per quarter note, reported as 1/24 beat. Pass to a host-clocked session's advance(). */
  onClock?: (beats: number) => void;
  onStart?: () => void;
  onContinue?: () => void;
  onStop?: () => void;
  /** The estimated key changed and is confident enough to follow. */
  onKey?: (key: KeyEstimate) => void;
}
export interface FollowerOptions {
  now?: () => number;
  /** Older notes fade from the key estimate with this half-life. */
  halfLifeMs?: number;
  /** Lowest profile correlation that reports a key. */
  minConfidence?: number;
  /** Notes needed before the first estimate. */
  minNotes?: number;
}

/**
 * Listens to a player: follows MIDI clock and transport messages, estimates the key from what is played,
 * and keeps recent melody notes so a played phrase can become the theme (ComposerOptions.motif).
 */
export class MidiFollower {
  private weights = new Array<number>(12).fill(0);
  private held = new Map<number, number>();
  private played: { pitch: number; time: number }[] = [];
  private notes = 0;
  private last = 0;
  private keyValue?: KeyEstimate;
  private readonly now: () => number;
  constructor(private hooks: FollowerHooks = {}, private options: FollowerOptions = {}) {
    this.now = options.now ?? (() => performance.now());
  }
  get key(): KeyEstimate | undefined { return this.keyValue && { ...this.keyValue }; }

  receive(bytes: ArrayLike<number>): void {
    const status = bytes[0];
    switch (status) {
      case 0xf8: this.hooks.onClock?.(1 / 24); return;
      case 0xfa: this.hooks.onStart?.(); return;
      case 0xfb: this.hooks.onContinue?.(); return;
      case 0xfc: this.hooks.onStop?.(); return;
    }
    const kind = status & 0xf0, pitch = bytes[1], velocity = bytes[2] ?? 0;
    if ((kind !== 0x90 && kind !== 0x80) || !Number.isInteger(pitch) || pitch < 0 || pitch > 127) return;
    const now = this.now();
    if (kind === 0x90 && velocity > 0) {
      this.decay(now);
      this.weights[pitch % 12] += velocity / 127;
      this.held.set(pitch, now);
      this.played.push({ pitch, time: now });
      if (this.played.length > 64) this.played.shift();
      this.notes++;
      this.update();
    } else {
      const since = this.held.get(pitch);
      this.held.delete(pitch);
      if (since === undefined) return;
      this.decay(now);
      // Long notes say more about the key than passing ones.
      this.weights[pitch % 12] += Math.min(2, (now - since) / 1000);
      this.update();
    }
  }

  /**
   * The last played line as scale degrees of a key: one note per onset (the highest of a chord),
   * at most `length` notes. Undefined until two notes have been played.
   */
  motif(root: number, mode: keyof typeof SCALES, length = 4): number[] | undefined {
    const line: number[] = [];
    for (let i = this.played.length - 1; i >= 0 && line.length < length; i--) {
      const note = this.played[i], chord = this.played.filter(n => Math.abs(n.time - note.time) < 40);
      if (chord.some(n => n.pitch > note.pitch)) continue;
      line.unshift(nearestDegree(mod(note.pitch - root, 12), mode));
      while (i > 0 && Math.abs(this.played[i - 1].time - note.time) < 40) i--;
    }
    return line.length >= 2 ? line : undefined;
  }

  reset(): void {
    this.weights.fill(0); this.held.clear(); this.played = []; this.notes = 0; this.keyValue = undefined;
  }

  private decay(now: number): void {
    const halfLife = this.options.halfLifeMs ?? 8000;
    if (this.last) {
      const factor = Math.pow(.5, Math.max(0, now - this.last) / halfLife);
      for (let i = 0; i < 12; i++) this.weights[i] *= factor;
    }
    this.last = now;
  }
  private update(): void {
    if (this.notes < (this.options.minNotes ?? 6)) return;
    const estimate = estimateKey(this.weights);
    if (!estimate || estimate.confidence < (this.options.minConfidence ?? .6)) return;
    if (this.keyValue?.root === estimate.root && this.keyValue.mode === estimate.mode) { this.keyValue = estimate; return; }
    this.keyValue = estimate;
    this.hooks.onKey?.({ ...estimate });
  }
}
