export const FAMILIES = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'] as const;
export type EmotionFamily = typeof FAMILIES[number];
export const ALGORITHMS = ['motif', 'markov', 'life', 'evolution', 'grammar', 'euclidean', 'torus'] as const;
export type Algorithm = typeof ALGORITHMS[number];
export const MODES = ['auto', 'major', 'minor', 'dorian', 'mixolydian'] as const;
export type Mode = typeof MODES[number];
export type ResolvedMode = Exclude<Mode, 'auto'>;
export const PARTS = ['melody', 'bass', 'harmony', 'percussion'] as const;
export type Part = typeof PARTS[number];

export interface ComposerOptions {
  seed: string;
  emotion: EmotionFamily;
  intensity: number;
  energy: number;
  tempo: number;
  root: number;
  mode: Mode;
  algorithm: Algorithm;
  bars: number;
  swing: number;
  parts: Part[];
}

export interface NoteEvent {
  id: string;
  part: Part;
  channel: number;
  pitch: number;
  start: number;
  duration: number;
  velocity: number;
  degree?: number;
  reason: string;
  motifId: string;
}

export interface BarPlan {
  index: number;
  start: number;
  chord: string;
  degree: number;
  pitches: number[];
  function: 'presentation' | 'continuation' | 'half cadence' | 'cadence';
  tension: number;
}

export interface Phrase {
  index: number;
  start: number;
  length: number;
  section: string;
  options: ComposerOptions;
  mode: ResolvedMode;
  bars: BarPlan[];
  events: NoteEvent[];
}

export interface Score {
  schemaVersion: 1;
  generatorVersion: '0.1.0';
  options: ComposerOptions;
  length: number;
  phrases: Phrase[];
  events: NoteEvent[];
}

/** sendMidi dispatches immediately, as in audiobus-protocol Peer. */
export interface MidiSink {
  sendMidi(bytes: ArrayLike<number>): void;
}

export interface MidiOutputAdapter {
  send(bytes: readonly number[]): void;
  label?: string;
}

export interface DispatchRecord {
  beat: number;
  time: number;
  bytes: number[];
  eventId: string;
}
