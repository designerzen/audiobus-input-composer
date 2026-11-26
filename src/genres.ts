import type { Genre, GenreMix, GenreMixMode, GroovePreset, Part, ResolvedMode } from './types.js';
import { clamp } from './theory.js';

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
  dnb: {
    label: 'Drum & bass', tempo: [168, 178], grid: 16, swing8: 0, swing16: 0, modes: ['minor', 'dorian', 'phrygian'],
    harmony: 'loop', loops: [[0, 5], [0, 3, 5, 4], [5, 3, 0, 6], [0, 6]], reharm: .15, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R---------------', mid: 'R---------R---5-', high: 'R-----R---R-8-5A' },
    comp: { low: 'C---------------', mid: 'C-------..S-----', high: 'C-----S-..S---S-' },
    voicing: 'full',
    drums: {
      low: { 36: 'X.........x.....', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.........x.....', 38: '....X..g.g..X..g', 42: 'x.x.x.x.x.x.x.x.' },
      high: { 36: 'X.........x...x.', 38: '....X..g.g..X..g', 42: 'xxgxxxgxxxgxxxgx', 46: '..............x.' },
    },
    feel: { jitter: 0, accent: .35, drums: { 42: .006 } },
    melody: { density: .55, gate: .75, register: 2 },
    form: [
      { name: 'Intro', role: 'establish', parts: ['harmony', 'melody'], energy: -.2 },
      { name: 'Roll', role: 'develop', parts: NO_MELODY, energy: .05 },
      { name: 'Drop', role: 'return', energy: .2 },
      { name: 'Breakdown', role: 'contrast', parts: ['harmony', 'melody'], energy: -.25 },
    ],
    programs: { melody: 88, bass: 38, harmony: 89 },
  },
  funk: {
    label: 'Funk', tempo: [104, 118], grid: 16, swing8: 0, swing16: .045, modes: ['dorian', 'mixolydian', 'minor'],
    harmony: 'loop', loops: [[0, 3], [0, 0, 3, 4], [1, 4, 0, 0], [0, 6, 3, 0]], reharm: .35, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R-----..R---5-..', mid: 'R--R..5-8--R..A.', high: 'R.8R..5-R.3R5.A.' },
    comp: { low: 'S.....S.........', mid: 'S..S..S...S..S..', high: 'S.SS..S.S.SS..S.' },
    voicing: 'shell',
    drums: {
      low: { 36: 'X.....x...x.....', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.....x...x...x.', 38: '....X..g.g..X..g', 42: 'x.g.x.g.x.g.x.g.', 46: '..............x.' },
      high: { 36: 'X..x..x...x...x.', 38: '....X..g.g..X.gg', 42: 'xgxgxgxgxgxgxgx.', 46: '..............x.' },
    },
    feel: { jitter: .008, accent: .85, parts: { bass: -.006, harmony: .01 }, drums: { 38: .015, 42: .008 } },
    melody: { density: .72, gate: .65, register: 0 },
    form: [
      { name: 'Groove', role: 'establish' },
      { name: 'Chorus', role: 'develop', energy: .1 },
      { name: 'Bridge', role: 'contrast', energy: -.05 },
      { name: 'Jam', role: 'return', energy: .15 },
    ],
    programs: { melody: 62, bass: 36, harmony: 7 },
  },
  afrobeat: {
    label: 'Afrobeat', tempo: [108, 124], grid: 16, swing8: 0, swing16: .03, modes: ['dorian', 'mixolydian', 'minor'],
    harmony: 'loop', loops: [[0, 3], [0, 6], [0, 3, 4, 3], [1, 4]], reharm: .15, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R-----5-..R-----', mid: 'R--5..R-..5-3-..', high: 'R--5..R-8-5-3-A.' },
    comp: { low: 'S.....S...S.....', mid: 'S..S..S...S..S..', high: '..S.S..S..S.S..S' },
    voicing: 'full',
    drums: {
      low: { 36: 'X.....x...x.....', 37: 'x..x..x...x.x...', 70: 'x.x.x.x.x.x.x.x.' },
      mid: { 36: 'X.....x...x...x.', 37: 'x..x..x...x.x...', 38: '....o..g....o..g', 70: 'xgxgxgxgxgxgxgxg' },
      high: { 36: 'X..x..x...x...x.', 37: 'X..x..x...x.x...', 38: '....x..g.g..x..g', 42: 'x.x.x.x.x.x.x.x.', 70: 'xgxgxgxgxgxgxgxg' },
    },
    feel: { jitter: .009, accent: .75, parts: { harmony: .01, bass: .006 }, drums: { 37: -.005, 70: .01 } },
    melody: { density: .68, gate: .72, register: 0 },
    form: [
      { name: 'Vamp', role: 'establish', parts: ['percussion', 'bass', 'harmony'] },
      { name: 'Horns', role: 'develop', energy: .1 },
      { name: 'Percussion break', role: 'contrast', parts: ['percussion', 'bass'], energy: -.05 },
      { name: 'Full band', role: 'return', energy: .15 },
    ],
    programs: { melody: 65, bass: 33, harmony: 27 },
  },
  waltz: {
    label: 'Waltz / 3-feel', tempo: [96, 132], grid: 12, swing8: 0, swing16: 0, modes: ['major', 'minor', 'lydian', 'dorian'],
    harmony: 'emotion', reharm: .3, ext: [0, 1], cadence: 'functional',
    bass: { low: 'R-----5-----', mid: 'R---5---3---', high: 'R--5--8--3--' },
    comp: { low: 'C-----------', mid: '..S..S..S..S', high: 'A.AA.AA.AA.A' },
    voicing: 'full',
    drums: {
      low: { 51: 'x..o..x..o..' },
      mid: { 36: 'X.....o.....', 51: 'x..o..x..o..', 37: '...g.....g..' },
      high: { 36: 'X.....x.....', 51: 'X.oo.oX.oo.o', 38: '...g..o..g..' },
    },
    feel: { jitter: .012, accent: .85, parts: { melody: .015, harmony: .008 } },
    melody: { density: .72, gate: .92, register: 2 },
    form: STANDARD_FORM,
    programs: { melody: 40, bass: 43, harmony: 0 },
  },
  synthwave: {
    label: 'Synthwave', tempo: [95, 118], grid: 16, swing8: 0, swing16: 0, modes: ['minor', 'dorian', 'major', 'lydian'],
    harmony: 'loop', loops: [[5, 3, 0, 4], [0, 5, 3, 4], [0, 6, 5, 4], [0, 3, 5, 4]], reharm: .1, ext: [0, 1], cadence: 'loop',
    bass: { low: 'R---R---R---R---', mid: 'R-R-R-R-R-R-R-R-', high: 'R8R8R8R8R8R8R8R8' },
    comp: { low: 'C---------------', mid: 'A-A-A-A-A-A-A-A-', high: 'AAAAAAAAAAAAAAAA' },
    voicing: 'full',
    drums: {
      low: { 36: 'X.......x.......', 38: '....X.......X...' },
      mid: { 36: 'X...x...x...x...', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.' },
      high: { 36: 'X...x...x..xx...', 38: '....X.......X...', 42: 'x.x.x.x.x.x.x.x.', 46: '..x...x...x...x.' },
    },
    feel: { jitter: 0, accent: .35 },
    melody: { density: .7, gate: .85, register: 2 },
    form: [
      { name: 'Intro', role: 'establish', parts: ['bass', 'harmony'], energy: -.15 },
      { name: 'Drive', role: 'develop', energy: .1 },
      { name: 'Neon bridge', role: 'contrast', energy: -.1 },
      { name: 'Anthem', role: 'return', energy: .2 },
    ],
    programs: { melody: 81, bass: 38, harmony: 90 },
    overhang: 2,
  },
  latin: {
    label: 'Salsa / Latin', tempo: [160, 190], grid: 16, swing8: 0, swing16: 0, modes: ['minor', 'dorian', 'major', 'mixolydian'],
    harmony: 'loop', loops: [[0, 3, 4, 3], [0, 5, 1, 4], [0, 6, 5, 4], [1, 4, 0, 0]], reharm: .35, ext: [1, 2], cadence: 'functional',
    bass: { low: '......5-......R-', mid: 'R-----5-......R-', high: '......5-..3...RA' },
    comp: { low: 'S.....S...S.....', mid: 'S..S..S...S..S..', high: 'S.AS.AS.S.AS.AS.' },
    voicing: 'full',
    drums: {
      low: { 37: 'X..x..x...x.x...', 70: 'x.x.x.x.x.x.x.x.' },
      mid: { 37: 'X..x..x...x.x...', 36: '......x.......x.', 70: 'xgxgxgxgxgxgxgxg' },
      high: { 37: 'X..x..x...x.x...', 36: '......x...x...x.', 38: '....o..g....o..g', 70: 'xgxgxgxgxgxgxgxg', 42: '..x...x...x...x.' },
    },
    feel: { jitter: .006, accent: .7, parts: { melody: .01, bass: -.005 }, drums: { 37: -.005 } },
    melody: { density: .72, gate: .75, register: 2 },
    form: [
      { name: 'Intro', role: 'establish', energy: -.1 },
      { name: 'Verso', role: 'develop' },
      { name: 'Montuno', role: 'contrast', energy: .15 },
      { name: 'Mambo', role: 'return', energy: .2 },
    ],
    programs: { melody: 56, bass: 32, harmony: 0 },
  },
  garage: {
    label: 'UK garage / 2-step', tempo: [128, 136], grid: 16, swing8: 0, swing16: .09, modes: ['minor', 'dorian', 'major'],
    harmony: 'loop', loops: [[0, 5, 3, 4], [1, 4, 0, 5], [0, 3], [5, 1, 4, 0]], reharm: .25, ext: [1, 2], cadence: 'loop',
    bass: { low: 'R---------R-----', mid: 'R-----R---..5-..', high: 'R--R..R---8-5-A.' },
    comp: { low: '..S.......S.....', mid: '..S..S....S..S..', high: '..S..S..S..S.S..' },
    voicing: 'shell',
    drums: {
      low: { 36: 'X.........x.....', 38: '....X.......X...', 42: '..x...x...x...x.' },
      mid: { 36: 'X.........x...x.', 39: '....X.......X...', 42: '..x.g.x...x.g.x.', 37: '.......g......g.' },
      high: { 36: 'X..g......x...x.', 39: '....X..g....X..g', 42: 'g.x.g.x.g.x.g.x.', 46: '..............x.', 37: '...g.....g......' },
    },
    feel: { jitter: .006, accent: .55, drums: { 42: .012, 39: .01 } },
    melody: { density: .62, gate: .65, register: 0 },
    form: [
      { name: 'Intro', role: 'establish', parts: ['percussion', 'harmony'], energy: -.15 },
      { name: '2-step', role: 'develop', energy: .05 },
      { name: 'Break', role: 'contrast', parts: ['harmony', 'melody'], energy: -.2 },
      { name: 'Drop', role: 'return', energy: .15 },
    ],
    programs: { melody: 4, bass: 38, harmony: 5 },
  },
};

/** A tempo inside the idiom's usual range, for hosts that let the genre suggest one. */
export const genreTempo = (genre: Genre): number => Math.round((GENRE_PROFILES[genre].tempo[0] + GENRE_PROFILES[genre].tempo[1]) / 2);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function blendFeel(a: Feel, b: Feel, t: number): Feel {
  const parts: Partial<Record<Part, number>> = {};
  const partKeys = new Set([...Object.keys(a.parts ?? {}), ...Object.keys(b.parts ?? {})]) as Set<Part>;
  for (const k of partKeys) parts[k] = clamp(lerp(a.parts?.[k] ?? 0, b.parts?.[k] ?? 0, t), -.05, .05);
  const drums: Record<number, number> = {};
  const drumKeys = new Set([...Object.keys(a.drums ?? {}), ...Object.keys(b.drums ?? {})].map(Number));
  for (const k of drumKeys) drums[k] = clamp(lerp(a.drums?.[k] ?? 0, b.drums?.[k] ?? 0, t), -.04, .04);
  return {
    jitter: clamp(lerp(a.jitter, b.jitter, t), 0, .03),
    accent: clamp(lerp(a.accent, b.accent, t), 0, 1),
    ...(partKeys.size ? { parts } : {}),
    ...(drumKeys.size ? { drums } : {}),
  };
}

/**
 * Produces a hybrid GenreProfile by fusing two genres according to `mix.mode` and `mix.amount`.
 * Used per phrase so alternating and cross-pollinated genres stay harmonically coherent.
 */
export function mixGenres(primary: GenreProfile, mix: GenreMix, phraseIndex: number): GenreProfile {
  const secondary = GENRE_PROFILES[mix.genre];
  const amount = clamp(mix.amount ?? .5, 0, 1);
  const mode: GenreMixMode = mix.mode ?? 'blend';
  if (amount <= 0) return primary;
  if (amount >= 1 && mode === 'blend') return secondary;

  const mergeModes = (a: readonly ResolvedMode[], b: readonly ResolvedMode[]): readonly ResolvedMode[] => {
    if (!a.length) return b;
    if (!b.length) return a;
    const shared = a.filter(m => b.includes(m));
    return shared.length ? shared : [...new Set([...a, ...b])];
  };

  const blendMelody = (t: number) => ({
    density: lerp(primary.melody.density, secondary.melody.density, t),
    gate: lerp(primary.melody.gate, secondary.melody.gate, t),
    register: Math.round(lerp(primary.melody.register, secondary.melody.register, t)),
    rest: t > .5 ? secondary.melody.rest : primary.melody.rest,
  });

  switch (mode) {
    case 'rhythm-swap':
      return {
        ...primary,
        label: `${primary.label} × ${secondary.label}`,
        grid: secondary.grid,
        swing8: lerp(primary.swing8, secondary.swing8, amount),
        swing16: lerp(primary.swing16, secondary.swing16, amount),
        bass: amount >= .35 ? secondary.bass : primary.bass,
        drums: secondary.drums ?? primary.drums,
        feel: blendFeel(primary.feel, secondary.feel, amount),
        programs: { ...primary.programs, bass: secondary.programs.bass },
      };
    case 'harmony-swap':
      return {
        ...primary,
        label: `${primary.label} × ${secondary.label}`,
        modes: mergeModes(secondary.modes, primary.modes),
        harmony: secondary.harmony,
        loops: secondary.loops ?? primary.loops,
        reharm: lerp(primary.reharm, secondary.reharm, amount),
        ext: [Math.round(lerp(primary.ext[0], secondary.ext[0], amount)), Math.round(lerp(primary.ext[1], secondary.ext[1], amount))],
        cadence: secondary.cadence,
        voicing: amount >= .5 ? secondary.voicing : primary.voicing,
        hold: secondary.hold,
        comp: amount >= .5 ? secondary.comp : primary.comp,
        overhang: secondary.overhang ?? primary.overhang,
        programs: { ...primary.programs, harmony: secondary.programs.harmony },
      };
    case 'alternate': {
      const useSecondary = phraseIndex % 2 === 1;
      const chosen = useSecondary ? secondary : primary;
      return {
        ...chosen,
        label: `${primary.label} ↔ ${secondary.label}`,
        modes: mergeModes(primary.modes, secondary.modes),
        feel: blendFeel(primary.feel, secondary.feel, useSecondary ? .85 : .15),
      };
    }
    case 'split':
      return {
        ...primary,
        label: `${primary.label} / ${secondary.label}`,
        grid: secondary.grid,
        swing8: lerp(primary.swing8, secondary.swing8, .5),
        swing16: lerp(primary.swing16, secondary.swing16, .5),
        bass: secondary.bass,
        drums: secondary.drums ?? primary.drums,
        feel: blendFeel(primary.feel, secondary.feel, .5),
        melody: blendMelody(amount * .5),
        programs: { melody: primary.programs.melody, harmony: primary.programs.harmony, bass: secondary.programs.bass },
      };
    default: {
      // 'blend': continuous hybridisation across feel, harmony, rhythm and melody.
      const takeRhythm = amount >= .4;
      const takeHarmony = amount >= .6;
      return {
        ...primary,
        label: `${primary.label} + ${secondary.label}`,
        tempo: [Math.round(lerp(primary.tempo[0], secondary.tempo[0], amount)), Math.round(lerp(primary.tempo[1], secondary.tempo[1], amount))],
        grid: takeRhythm ? secondary.grid : primary.grid,
        swing8: lerp(primary.swing8, secondary.swing8, amount),
        swing16: lerp(primary.swing16, secondary.swing16, amount),
        modes: mergeModes(primary.modes, secondary.modes),
        harmony: takeHarmony ? secondary.harmony : primary.harmony,
        loops: takeHarmony ? (secondary.loops ?? primary.loops) : (primary.loops ?? secondary.loops),
        reharm: lerp(primary.reharm, secondary.reharm, amount),
        ext: [Math.round(lerp(primary.ext[0], secondary.ext[0], amount)), Math.round(lerp(primary.ext[1], secondary.ext[1], amount))],
        cadence: takeHarmony ? secondary.cadence : primary.cadence,
        bass: takeRhythm ? secondary.bass : primary.bass,
        comp: amount >= .5 ? secondary.comp : primary.comp,
        voicing: amount >= .5 ? secondary.voicing : primary.voicing,
        hold: amount >= .5 ? secondary.hold : primary.hold,
        drums: takeRhythm ? (secondary.drums ?? primary.drums) : primary.drums,
        feel: blendFeel(primary.feel, secondary.feel, amount),
        melody: blendMelody(amount),
        form: amount >= .65 ? secondary.form : primary.form,
        programs: {
          melody: amount >= .65 ? secondary.programs.melody : primary.programs.melody,
          bass: takeRhythm ? secondary.programs.bass : primary.programs.bass,
          harmony: takeHarmony ? secondary.programs.harmony : primary.programs.harmony,
        },
        overhang: lerp(primary.overhang ?? 0, secondary.overhang ?? 0, amount) || undefined,
      };
    }
  }
}

/** Applies a rhythmic groove preset onto a GenreProfile's swing and microtiming feel. */
export function applyGrooveFeel(genre: GenreProfile, groove?: GroovePreset): GenreProfile {
  if (!groove || groove === 'auto') return genre;
  switch (groove) {
    case 'straight':
      return { ...genre, swing8: 0, swing16: 0, feel: { jitter: 0, accent: genre.feel.accent * .6 } };
    case 'swung':
      return { ...genre, swing8: Math.max(genre.swing8, .15), feel: { ...genre.feel, jitter: Math.max(genre.feel.jitter, .008), parts: { ...genre.feel.parts, melody: .02 } } };
    case 'pocket':
      return {
        ...genre,
        swing16: Math.max(genre.swing16, .065),
        feel: {
          jitter: .014,
          accent: .85,
          parts: { ...genre.feel.parts, bass: .018, harmony: .022, melody: .016 },
          drums: { ...genre.feel.drums, 38: .038, 39: .035, 42: .014 },
        },
      };
    case 'shuffled':
      return { ...genre, swing16: Math.max(genre.swing16, .085), feel: { ...genre.feel, jitter: .006, accent: .65 } };
    case 'human':
      return {
        ...genre,
        feel: {
          ...genre.feel,
          jitter: .022,
          accent: .9,
          parts: { ...genre.feel.parts, melody: .02, harmony: .012 },
        },
      };
    default:
      // halftime, doubletime, syncopated, polyrhythm reshape patterns in parts.ts.
      return genre;
  }
}
