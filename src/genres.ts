import type { Genre, Part, ResolvedMode } from './types.js';

/**
 * A genre is the idiom: groove, harmonic vocabulary, how each part behaves and the form.
 * Emotion and Energy move within what the genre allows (see docs/theory/theory-first-pipeline.md).
 *
 * Patterns are one bar on the genre grid (12 or 16 slots).
 * Bass:  R root (or inversion bass)  5 fifth  8 octave  3 third  A chromatic approach to the next root
 *        W walking line (root, third, fifth, approach)  - sustain  . rest
 * Comp:  C sustained chord  S short stab  P power chord  A one arpeggio note  L Alberti figure  - sustain  . rest
 * Drums: X accent  x normal  o soft  g ghost  r three-hit roll  . rest   (keys are General MIDI drum notes)
 */
export type SectionRole = 'establish' | 'develop' | 'contrast' | 'return';
export type HarmonyKind = 'emotion' | 'loop' | 'jazz' | 'schemata' | 'lr-walk' | 'drone';

export interface Section {
  name: string;
  role: SectionRole;
  /** Roles playing in this section, intersected with the user's ensemble. */
  parts?: readonly Part[];
  /** Added to Energy for this section. */
  energy?: number;
  /** Semitones added to the tonic, such as a last-chorus lift. */
  lift?: number;
}

export interface Patterns { low: string; mid: string; high: string }

/** How the idiom places notes against the grid (docs/theory: microtiming). Offsets are in beats. */
export interface Feel {
  /** Push per part; positive is laid back, negative is on top of the beat. */
  parts?: Readonly<Partial<Record<Part, number>>>;
  /** Push per drum, keyed by General MIDI note, added to the percussion push. */
  drums?: Readonly<Record<number, number>>;
  /** Largest seeded timing deviation; 0 is machine-tight. */
  jitter: number;
  /** Depth of metrical accents on pitched parts, 0 flat to 1 strongly shaped. */
  accent: number;
}
export type DrumKit = Readonly<Record<number, string>>;

export interface GenreProfile {
  label: string;
  tempo: readonly [number, number];
  grid: 8 | 12 | 16;
  /** Eighth-note swing added to the user's swing, in beats. */
  swing8: number;
  /** Sixteenth-note swing for 16-slot patterns, in beats. */
  swing16: number;
  /** Modes the idiom accepts; empty means any. */
  modes: readonly ResolvedMode[];
  harmony: HarmonyKind;
  loops?: readonly (readonly number[])[];
  /** Reharmonisation depth 0–1, scaled by intensity. */
  reharm: number;
  /** Chord extension range: 0 triads, 1 sevenths, 2 ninths. */
  ext: readonly [number, number];
  /** Loop idioms cadence by returning to the tonic; functional idioms use the cadence ladder. */
  cadence: 'functional' | 'loop';
  bass: Patterns | 'pop';
  comp: Patterns | 'pop';
  voicing: 'full' | 'shell' | 'power';
  /** Sustain a repeated chord across bars instead of re-attacking it. */
  hold?: boolean;
  drums: { low: DrumKit; mid: DrumKit; high: DrumKit } | 'pop' | null;
  feel: Feel;
  melody: { density: number; gate: number; register: number; rest?: readonly number[] };
  form: readonly Section[];
  /** General MIDI programs, zero-based. */
  programs: { melody: number; bass: number; harmony: number };
  /** Beats a final pad may ring into the next phrase. */
  overhang?: number;
}

const STANDARD_FORM: readonly Section[] = [
  { name: 'Establish', role: 'establish' },
  { name: 'Develop', role: 'develop' },
  { name: 'Contrast', role: 'contrast' },
  { name: 'Return', role: 'return' },
];
const AABA: readonly Section[] = [
  { name: 'A', role: 'establish' },
  { name: 'A′', role: 'return' },
  { name: 'B', role: 'contrast' },
  { name: 'A″', role: 'return' },
];
const NO_MELODY: readonly Part[] = ['percussion', 'bass', 'harmony'];

export const GENRE_PROFILES: Readonly<Record<Genre, GenreProfile>> = {
  pop: {
    label: 'Pop', tempo: [90, 120], grid: 8, swing8: 0, swing16: 0, modes: [],
    harmony: 'emotion', reharm: .25, ext: [0, 1], cadence: 'functional',
    bass: 'pop', comp: 'pop', voicing: 'full', drums: 'pop',
    feel: { jitter: .006, accent: .6 },
    melody: { density: 1, gate: 1, register: 0 }, form: STANDARD_FORM,
    programs: { melody: 0, bass: 33, harmony: 4 },
  },
  house: {
    label: 'House', tempo: [118, 128], grid: 16, swing8: 0, swing16: .03, modes: ['minor', 'dorian', 'major', 'mixolydian'],
    harmony: 'loop', loops: [[0, 5], [0, 3], [1, 4], [5, 3, 0, 4]], reharm: 0, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R-------R-------', mid: '..R...R...R...R.', high: '..R..8R...R..8R.' },
    comp: { low: 'C---------------', mid: '..S.....S.......', high: '..S..S..S..S..S.' },
    voicing: 'full',
    drums: {
      low: { 36: 'X...x...x...x...', 42: '..x...x...x...x.' },
      mid: { 36: 'X...x...x...x...', 39: '....x.......x...', 46: '..x...x...x...x.', 42: 'o...o...o...o...' },
      high: { 36: 'X...x...x...x...', 39: '....x.......x...', 46: '..x...x...x...x.', 42: 'x.g.x.g.x.g.x.g.', 70: 'gxgxgxgxgxgxgxgx' },
    },
    feel: { jitter: 0, accent: .3, drums: { 46: .01 } },
    melody: { density: .7, gate: .8, register: 0 },
    form: [
      { name: 'Intro', role: 'establish', parts: ['percussion', 'bass'], energy: -.1 },
      { name: 'Build', role: 'develop', parts: NO_MELODY },
      { name: 'Drop', role: 'return', energy: .15 },
      { name: 'Break', role: 'contrast', parts: ['harmony', 'melody'], energy: -.25 },
    ],
    programs: { melody: 81, bass: 38, harmony: 89 },
  },
  techno: {
    label: 'Techno', tempo: [124, 136], grid: 16, swing8: 0, swing16: 0, modes: ['phrygian', 'minor', 'dorian'],
    harmony: 'drone', reharm: 0, ext: [0, 1], cadence: 'loop',
    bass: { low: 'R-------R-------', mid: '..R...R...R...R.', high: '.RRR.RRR.RRR.RRR' },
    comp: { low: '................', mid: '......S.........', high: '...S..S....S..S.' },
    voicing: 'full',
    drums: {
      low: { 36: 'X...x...x...x...' },
      mid: { 36: 'X...x...x...x...', 42: '..x...x...x...x.', 37: '...g......g.....' },
      high: { 36: 'X...x...x...x...', 46: '..x...x...x...x.', 42: 'xxgxxxgxxxgxxxgx', 39: '....x.......x...', 37: '...g..g...g..g..' },
    },
    feel: { jitter: 0, accent: .2 },
    melody: { density: .5, gate: .45, register: -2, rest: [0, 1, 2, 3] },
    form: [
      { name: 'Intro', role: 'establish', parts: ['percussion'] },
      { name: 'Groove', role: 'develop', parts: ['percussion', 'bass'] },
      { name: 'Peak', role: 'return', energy: .15 },
      { name: 'Break', role: 'contrast', parts: ['harmony', 'bass', 'melody'], energy: -.3 },
    ],
    programs: { melody: 81, bass: 38, harmony: 90 },
  },
  'boom-bap': {
    label: 'Boom-bap / lo-fi', tempo: [84, 96], grid: 16, swing8: 0, swing16: .08, modes: ['dorian', 'minor', 'major', 'mixolydian'],
    harmony: 'loop', loops: [[1, 4], [0, 5], [3, 2], [5, 1, 4, 0]], reharm: .3, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R-------........', mid: 'R-----R---..5-..', high: 'R--R--R-R-..5-A.' },
    comp: { low: 'C---------------', mid: 'C-------...S----', high: 'C-----S-..S-S---' },
    voicing: 'full',
    drums: {
      low: { 36: 'X.........x.....', 38: '....x.......x...', 42: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.....x...x.....', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.', 37: '.......g......g.' },
      high: { 36: 'X.....x.x.x...x.', 38: '....X..g....X...', 42: 'xgxgxgxgxgxgxgxg' },
    },
    feel: { jitter: .012, accent: .8, parts: { bass: .015, harmony: .02 }, drums: { 38: .035, 39: .035, 42: .012 } },
    melody: { density: .55, gate: .7, register: 0 },
    form: [
      { name: 'Verse', role: 'establish', energy: -.05 },
      { name: 'Hook', role: 'develop', energy: .1 },
      { name: 'Verse 2', role: 'contrast' },
      { name: 'Hook', role: 'return', energy: .1 },
    ],
    programs: { melody: 11, bass: 33, harmony: 4 },
  },
  trap: {
    label: 'Trap', tempo: [130, 150], grid: 16, swing8: 0, swing16: 0, modes: ['minor', 'harmonic-minor', 'phrygian', 'dorian'],
    harmony: 'loop', loops: [[0, 5], [0, 3], [5, 6], [0, 6, 5, 4]], reharm: 0, ext: [0, 0], cadence: 'loop',
    bass: { low: 'R---------------', mid: 'R-----R-------..', high: 'R-----R---R---5-' },
    comp: { low: 'C---------------', mid: 'C---------------', high: 'C-------C-------' },
    voicing: 'full',
    drums: {
      low: { 36: 'X...............', 42: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.....x...x.....', 38: '........X.......', 42: 'x.x.x.x.x.xrx.x.' },
      high: { 36: 'X.....x..x.x..x.', 38: '........X.......', 42: 'xxxxxrxxxxxxrxrx', 46: '..............x.' },
    },
    feel: { jitter: 0, accent: .4 },
    melody: { density: .6, gate: .5, register: 5 },
    form: [
      { name: 'Intro', role: 'establish', parts: ['harmony', 'melody'], energy: -.2 },
      { name: 'Hook', role: 'develop', energy: .1 },
      { name: 'Verse', role: 'contrast' },
      { name: 'Hook', role: 'return', energy: .1 },
    ],
    programs: { melody: 10, bass: 38, harmony: 48 },
  },
  jazz: {
    label: 'Jazz swing', tempo: [120, 200], grid: 12, swing8: .17, swing16: 0, modes: ['major', 'dorian', 'minor', 'mixolydian'],
    harmony: 'jazz', reharm: .85, ext: [1, 2], cadence: 'functional',
    bass: { low: 'R.....5.....', mid: 'W..W..W..W..', high: 'W..W..W..W..' },
    comp: { low: 'C-----------', mid: 'S....S......', high: 'S....S.....S' },
    voicing: 'shell',
    drums: {
      low: { 51: 'x..x.xx..x.x', 42: '...x.....x..' },
      mid: { 51: 'x..x.xx..x.x', 42: '...x.....x..', 38: '........g...' },
      high: { 51: 'X..x.xX..x.x', 42: '...x.....x..', 36: 'g.....g.....', 38: '.....g..x..g' },
    },
    feel: { jitter: .01, accent: .7, parts: { melody: .025, harmony: .02, bass: -.008 }, drums: { 51: -.01, 42: .005 } },
    melody: { density: .7, gate: .85, register: 0 },
    form: AABA,
    programs: { melody: 66, bass: 32, harmony: 0 },
  },
  bossa: {
    label: 'Bossa nova', tempo: [120, 145], grid: 16, swing8: 0, swing16: 0, modes: ['major', 'dorian', 'minor', 'lydian'],
    harmony: 'jazz', reharm: .5, ext: [1, 2], cadence: 'functional',
    bass: { low: 'R-------5-------', mid: 'R-----5-R-----5-', high: 'R-----5-R-----5A' },
    comp: { low: 'C-------C-------', mid: 'S..S..S...S..S..', high: 'S..S..S.S.S..S.S' },
    voicing: 'full',
    drums: {
      low: { 37: 'x..x..x...x..x..' },
      mid: { 37: 'x..x..x...x..x..', 70: 'xgxgxgxgxgxgxgxg', 36: 'x.....x.x.....x.' },
      high: { 37: 'x..x..x...x..x..', 70: 'xgxgxgxgxgxgxgxg', 36: 'x.....x.x.....x.', 42: '..x...x...x...x.' },
    },
    feel: { jitter: .006, accent: .6, parts: { melody: .015 } },
    melody: { density: .6, gate: .85, register: 0 },
    form: AABA,
    programs: { melody: 73, bass: 32, harmony: 24 },
  },
  reggae: {
    label: 'Reggae / dub', tempo: [66, 80], grid: 16, swing8: 0, swing16: .04, modes: ['major', 'minor', 'dorian', 'mixolydian'],
    harmony: 'loop', loops: [[0, 3], [0, 4], [0, 3, 4, 3], [5, 3, 0, 4]], reharm: 0, ext: [0, 1], cadence: 'loop',
    bass: { low: 'R-------........', mid: 'R-.5..8.R-..A...', high: 'R.R.5.8.R..53.A.' },
    comp: { low: '....S.......S...', mid: '....S.......S...', high: '..S.S...S.S.S...' },
    voicing: 'full',
    drums: {
      low: { 37: '........x.......', 36: '........x.......' },
      mid: { 37: '........x.......', 36: '........x.......', 42: '..x...x...x...x.' },
      high: { 36: '........X.......', 38: '........X.......', 42: 'x.x.x.x.x.x.xxx.', 46: '..............x.' },
    },
    feel: { jitter: .01, accent: .7, parts: { harmony: .015, bass: .01 }, drums: { 36: .02, 37: .02, 38: .02 } },
    melody: { density: .55, gate: .7, register: 0 },
    form: [
      { name: 'Verse', role: 'establish' },
      { name: 'Chorus', role: 'develop', energy: .05 },
      { name: 'Dub', role: 'contrast', parts: ['percussion', 'bass'], energy: -.1 },
      { name: 'Chorus', role: 'return', energy: .05 },
    ],
    programs: { melody: 56, bass: 33, harmony: 16 },
  },
  rock: {
    label: 'Rock', tempo: [100, 140], grid: 16, swing8: 0, swing16: 0, modes: ['major', 'mixolydian', 'minor', 'dorian'],
    harmony: 'loop', loops: [[0, 4, 5, 3], [0, 3, 4, 3], [5, 3, 0, 4], [0, 6, 3, 0]], reharm: 0, ext: [0, 0], cadence: 'functional',
    bass: { low: 'R-------R-------', mid: 'R-R-R-R-R-R-R-R-', high: 'R-R-R-R-R-R-R-RA' },
    comp: { low: 'P---------------', mid: 'P-------P---P---', high: 'P-P-P-P-P-P-P-P-' },
    voicing: 'power',
    drums: {
      low: { 36: 'X.......x.......', 38: '....x.......x...', 42: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.....x.x.......', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.' },
      high: { 36: 'X.....x.x.x.....', 38: '....X.......X...', 46: 'x.x.x.x.x.x.x.x.' },
    },
    feel: { jitter: .008, accent: .7, drums: { 36: -.008, 38: -.008, 42: -.005, 46: -.005 } },
    melody: { density: .65, gate: .85, register: 0 },
    form: [
      { name: 'Verse', role: 'establish', energy: -.05 },
      { name: 'Chorus', role: 'develop', energy: .1 },
      { name: 'Bridge', role: 'contrast' },
      { name: 'Last chorus', role: 'return', energy: .15, lift: 2 },
    ],
    programs: { melody: 29, bass: 34, harmony: 30 },
  },
  galant: {
    label: 'Galant / classical', tempo: [72, 112], grid: 16, swing8: 0, swing16: 0, modes: ['major', 'minor'],
    harmony: 'schemata', reharm: 0, ext: [0, 0], cadence: 'functional',
    bass: { low: 'R-------R-------', mid: 'R---R---R---R---', high: 'R-R-R-R-R-R-R-R-' },
    comp: { low: 'C---------------', mid: 'L-L-L-L-L-L-L-L-', high: 'LLLLLLLLLLLLLLLL' },
    voicing: 'full', drums: null,
    feel: { jitter: .008, accent: .9, parts: { melody: .01 } },
    melody: { density: .7, gate: .9, register: 2 },
    form: STANDARD_FORM,
    programs: { melody: 73, bass: 42, harmony: 6 },
  },
  minimal: {
    label: 'Minimalist', tempo: [100, 140], grid: 16, swing8: 0, swing16: 0, modes: ['major', 'lydian', 'dorian', 'mixolydian'],
    harmony: 'lr-walk', reharm: 0, ext: [0, 1], cadence: 'loop', hold: true,
    bass: { low: 'R---------------', mid: 'R-------R-------', high: 'R---R---R---R---' },
    comp: { low: 'A-A-A-A-A-A-A-A-', mid: 'AAAAAAAAAAAAAAAA', high: 'AAAAAAAAAAAAAAAA' },
    voicing: 'full',
    drums: {
      low: {},
      mid: { 37: 'x.x.x.x.x.x.x.x.' },
      high: { 37: 'x.xxx.x.x.xxx.x.', 36: 'x.......x.......' },
    },
    feel: { jitter: 0, accent: .2 },
    melody: { density: .5, gate: .6, register: 0, rest: [0, 1] },
    form: [
      { name: 'Process A', role: 'establish' },
      { name: 'Process B', role: 'develop' },
      { name: 'Process C', role: 'contrast' },
      { name: 'Process A′', role: 'return' },
    ],
    programs: { melody: 11, bass: 33, harmony: 12 },
  },
  ambient: {
    label: 'Ambient', tempo: [60, 90], grid: 16, swing8: 0, swing16: 0, modes: ['lydian', 'major', 'dorian', 'mixolydian', 'minor'],
    harmony: 'lr-walk', reharm: 0, ext: [1, 2], cadence: 'loop', hold: true,
    bass: { low: 'R---------------', mid: 'R---------------', high: 'R-------R-------' },
    comp: { low: 'C---------------', mid: 'C---------------', high: 'C-------C-------' },
    voicing: 'full', drums: null,
    feel: { jitter: .02, accent: .3, parts: { melody: .03 } },
    melody: { density: .35, gate: 1.6, register: 3 },
    form: [
      { name: 'Drift', role: 'establish' },
      { name: 'Bloom', role: 'develop', energy: .1 },
      { name: 'Haze', role: 'contrast', energy: -.1 },
      { name: 'Drift', role: 'return' },
    ],
    programs: { melody: 88, bass: 95, harmony: 89 },
    overhang: 4,
  },
  chiptune: {
    label: 'Chiptune', tempo: [130, 160], grid: 16, swing8: 0, swing16: 0, modes: ['major', 'minor', 'dorian', 'mixolydian'],
    harmony: 'emotion', reharm: 0, ext: [0, 0], cadence: 'functional',
    bass: { low: 'R---R---R---R---', mid: 'R-8-R-8-R-8-R-8-', high: 'R8R8R8R8R8R8R8R8' },
    comp: { low: 'A-A-A-A-A-A-A-A-', mid: 'AAAAAAAAAAAAAAAA', high: 'AAAAAAAAAAAAAAAA' },
    voicing: 'full',
    drums: {
      low: { 36: 'x.......x.......', 38: '....x.......x...' },
      mid: { 36: 'x...x...x...x...', 38: '....x.......x...', 42: '..x...x...x...x.' },
      high: { 36: 'x..xx...x..xx...', 38: '....x.......x.xx', 42: 'xxxxxxxxxxxxxxxx' },
    },
    feel: { jitter: 0, accent: .3 },
    melody: { density: .8, gate: .6, register: 5 },
    form: STANDARD_FORM,
    programs: { melody: 80, bass: 38, harmony: 81 },
  },
};

/** A tempo inside the idiom's usual range, for hosts that let the genre suggest one. */
export const genreTempo = (genre: Genre): number => Math.round((GENRE_PROFILES[genre].tempo[0] + GENRE_PROFILES[genre].tempo[1]) / 2);
