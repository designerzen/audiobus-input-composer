export const FAMILIES = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'] as const;
export type EmotionFamily = typeof FAMILIES[number];
export const ALGORITHMS = ['motif', 'markov', 'life', 'evolution', 'grammar', 'euclidean', 'torus'] as const;
export type Algorithm = typeof ALGORITHMS[number];
export const MODES = ['auto', 'major', 'minor', 'dorian', 'mixolydian', 'lydian', 'phrygian', 'harmonic-minor', 'locrian'] as const;
export type Mode = typeof MODES[number];
export type ResolvedMode = Exclude<Mode, 'auto'>;
export const PARTS = ['melody', 'bass', 'harmony', 'percussion'] as const;
export type Part = typeof PARTS[number];
export const GENRES = ['pop', 'house', 'techno', 'boom-bap', 'trap', 'jazz', 'bossa', 'reggae', 'rock', 'galant', 'minimal', 'ambient', 'chiptune'] as const;
export type Genre = typeof GENRES[number];
/** Closed cadences end on the tonic; half and deceptive cadences, and open loops, ask for another phrase. */
export const CADENCES = ['authentic', 'plagal', 'arrival', 'half', 'deceptive', 'open'] as const;
export type Cadence = typeof CADENCES[number];

export interface ComposerOptions {
  seed: string;
  emotion: EmotionFamily;
  intensity: number;
  energy: number;
  tempo: number;
  root: number;
  mode: Mode;
  algorithm: Algorithm;
  genre: Genre;
  bars: number;
  swing: number;
  parts: Part[];
  /** Send General MIDI Program Change hints for the genre's instruments. */
  programs: boolean;
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
  roman?: string;
  degree: number;
  pitches: number[];
  function: 'presentation' | 'continuation' | 'half cadence' | 'deceptive cadence' | 'cadence';
  /** Estimated tension of the chosen bar, 0–1. */
  tension: number;
  /** Tension the emotion and energy asked for. */
  targetTension: number;
}

export interface Phrase {
  index: number;
  start: number;
  length: number;
  section: string;
  genre: Genre;
  /** Tonic pitch class of this phrase; differs from options.root after a section key lift. */
  root: number;
  options: ComposerOptions;
  mode: ResolvedMode;
  cadence: Cadence;
  closed: boolean;
  bars: BarPlan[];
  events: NoteEvent[];
  /** Channel messages to send before the first note, such as Program Change. */
  setup?: number[][];
}

export interface Score {
  schemaVersion: 1;
  generatorVersion: string;
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
  /** timestamp is a performance.now() time, passed only to adapters that declare timestamps. */
  send(bytes: readonly number[], timestamp?: number): void;
  label?: string;
  /** The output can schedule messages ahead, as Web MIDI can. */
  timestamps?: boolean;
  /** Cancel messages scheduled ahead but not yet sent. */
  clear?(): void;
}

export interface DispatchRecord {
  beat: number;
  time: number;
  bytes: number[];
  eventId: string;
  /** Scheduled delivery time when the output accepts timestamps. */
  at?: number;
}
