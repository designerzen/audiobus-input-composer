import type { Cadence, EmotionFamily, ResolvedMode } from './types.js';
import { clamp, degreePitch, mod, NOTE_NAMES, random, SCALES, weighted } from './theory.js';
import type { GenreProfile, SectionRole } from './genres.js';

export type ChordQuality = 'dom7' | 'minor' | 'major';
/** One bar of harmony. Without a quality the chord is diatonic to the mode; shift moves its root chromatically. */
export interface ChordStep {
  degree: number;
  shift?: number;
  quality?: ChordQuality;
  /** Bass scale degree when the chord is inverted. */
  bass?: number;
  /** Melody skeleton degree for the bar's downbeat. */
  melody?: number;
  /** Analysis label for rewrites, such as V7/ii. */
  tag?: string;
}

export const CLOSED_CADENCES: readonly Cadence[] = ['authentic', 'plagal', 'arrival'];

const ROMAN_UPPER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const ROMAN_LOWER = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

/** Emotion-aware 8-bar progressions; bar 4 (index 3) is a half cadence on V. */
export const PROGRESSIONS: Record<EmotionFamily, readonly (readonly number[])[]> = {
  joy: [[0, 5, 3, 4, 0, 1, 4, 0], [0, 3, 1, 4, 5, 3, 4, 0], [5, 3, 0, 4, 1, 3, 4, 0]],
  trust: [[0, 3, 0, 4, 5, 3, 4, 0], [0, 5, 3, 4, 0, 1, 4, 0], [3, 0, 1, 4, 5, 3, 4, 0]],
  fear: [[0, 1, 0, 4, 5, 1, 4, 0], [0, 5, 1, 4, 0, 6, 1, 0], [5, 1, 3, 4, 0, 1, 4, 0]],
  surprise: [[0, 2, 1, 4, 3, 1, 4, 0], [0, 2, 1, 4, 5, 1, 4, 0], [3, 2, 5, 4, 1, 4, 6, 0]],
  sadness: [[0, 5, 3, 4, 0, 3, 4, 0], [0, 6, 5, 4, 3, 1, 4, 0], [5, 3, 0, 4, 3, 5, 4, 0]],
  disgust: [[0, 1, 5, 4, 5, 3, 1, 0], [0, 3, 6, 4, 1, 5, 1, 0], [5, 1, 6, 4, 3, 1, 4, 0]],
  anger: [[0, 5, 3, 4, 0, 1, 4, 0], [0, 3, 5, 4, 6, 5, 4, 0], [5, 4, 3, 4, 0, 5, 4, 0]],
  anticipation: [[0, 3, 1, 4, 0, 5, 6, 0], [0, 6, 3, 4, 1, 5, 4, 0], [3, 4, 5, 4, 1, 3, 4, 0]],
};

/** ii–V–I based progressions for jazz and bossa nova, before reharmonisation. */
const JAZZ_PROGRESSIONS: readonly (readonly number[])[] = [
  [1, 4, 0, 0, 1, 4, 0, 0],
  [0, 5, 1, 4, 0, 5, 1, 4],
  [2, 5, 1, 4, 0, 3, 1, 4],
  [0, 0, 3, 3, 1, 4, 0, 0],
];

/** Gjerdingen's galant schemata at one stage per bar (docs/theory/galant-schemata-and-partimento.md). */
const SCHEMATA: Record<string, readonly ChordStep[]> = {
  romanesca: [{ degree: 0, melody: 2 }, { degree: 4, bass: 6, melody: 1 }, { degree: 5, melody: 0 }, { degree: 0, bass: 2, melody: 0 }],
  doReMi: [{ degree: 0, melody: 0 }, { degree: 4, bass: 6, melody: 1 }, { degree: 0, bass: 2, melody: 2 }, { degree: 3, melody: 0 }],
  prinner: [{ degree: 3, melody: 5 }, { degree: 0, bass: 2, melody: 4 }, { degree: 4, bass: 1, melody: 3, quality: 'dom7' }, { degree: 0, melody: 2 }],
  monte: [{ degree: 0, quality: 'dom7', melody: 2, tag: 'V7/IV' }, { degree: 3, melody: 3 }, { degree: 1, quality: 'dom7', melody: 3, tag: 'V7/V' }, { degree: 4, melody: 4 }],
  fonte: [{ degree: 5, quality: 'dom7', melody: 4, tag: 'V7/ii' }, { degree: 1, melody: 3 }, { degree: 4, quality: 'dom7', melody: 3 }, { degree: 0, melody: 2 }],
  ponte: [{ degree: 4, melody: 1 }, { degree: 4, quality: 'dom7', melody: 3 }],
  cadence: [{ degree: 4, melody: 1 }, { degree: 0, melody: 0 }],
};

/** Weighted reharmonisations per emotion (docs/theory/reharmonisation-and-substitution.md). */
type Rewrite = 'secondary' | 'tritone' | 'backdoor' | 'interchange';
const REWRITES: Rewrite[] = ['secondary', 'tritone', 'backdoor', 'interchange'];
const REWRITE_WEIGHTS: Record<EmotionFamily, readonly number[]> = {
  joy: [3, 0, 1, 1], trust: [1, 0, 0, 1], fear: [1, 3, 0, 1], surprise: [0, 1, 3, 2],
  sadness: [1, 0, 0, 3], disgust: [0, 2, 0, 2], anger: [2, 2, 0, 0], anticipation: [3, 1, 0, 0],
};

const WEAK_CADENCES: Record<EmotionFamily, readonly [Cadence, Cadence]> = {
  joy: ['half', 'authentic'], trust: ['authentic', 'half'], fear: ['deceptive', 'half'], surprise: ['deceptive', 'half'],
  sadness: ['half', 'deceptive'], disgust: ['deceptive', 'half'], anger: ['half', 'authentic'], anticipation: ['half', 'deceptive'],
};

/** Semitone offset in −6..5. */
const signed = (n: number) => mod(n + 6, 12) - 6;
const scalePc = (mode: ResolvedMode, degree: number) => SCALES[mode][mod(degree, 7)];
/** Diatonic triads with a diminished or augmented fifth are unstable as walk targets. */
const unstable = (mode: ResolvedMode, degree: number) => {
  const fifth = mod(scalePc(mode, degree + 4) - scalePc(mode, degree), 12);
  return fifth !== 7;
};
const triadNumeral = (mode: ResolvedMode, degree: number) => {
  const third = mod(scalePc(mode, degree + 2) - scalePc(mode, degree), 12);
  return (third === 3 ? ROMAN_LOWER : ROMAN_UPPER)[mod(degree, 7)];
};

export interface HarmonyRequest {
  genre: GenreProfile;
  emotion: EmotionFamily;
  mode: ResolvedMode;
  intensity: number;
  seed: string;
  index: number;
  /** First phrase of the current form cycle; returning sections reuse its harmony. */
  cycleStart: number;
  role: SectionRole;
  final: boolean;
  contour: number;
}

export function planHarmony(request: HarmonyRequest): { steps: ChordStep[]; cadence: Cadence } {
  const { genre, mode, role } = request;
  const key = role === 'return' ? request.cycleStart : request.index;
  const rng = random(`${request.seed}:harmony:${key}:${genre.harmony}`);
  let steps: ChordStep[];
  switch (genre.harmony) {
    case 'loop': {
      const loops = genre.loops ?? [[0]];
      const loop = loops[Math.floor(rng() * loops.length)];
      steps = Array.from({ length: 8 }, (_, bar) => ({ degree: loop[bar % loop.length] }));
      break;
    }
    case 'jazz': {
      const bank = { establish: 0, develop: 1, contrast: 2, return: 0 }[role];
      steps = JAZZ_PROGRESSIONS[rng() < .3 ? 3 : bank].map(degree => ({ degree }));
      break;
    }
    case 'schemata':
      steps = galantChain(role, rng);
      break;
    case 'lr-walk':
      steps = parsimoniousWalk(mode, request.contour, rng);
      break;
    case 'drone':
      steps = Array.from({ length: 8 }, (_, bar) => {
        if (bar !== 3 && bar !== 6) return { degree: 0 };
        const colour = [5, 6].find(d => !unstable(mode, d) && rng() < .6);
        return { degree: colour ?? 0 };
      });
      break;
    default: {
      const bank = PROGRESSIONS[request.emotion];
      const index = role === 'develop' ? (rng() < .55 ? 1 : 0) : role === 'contrast' ? 2 : 0;
      steps = bank[index].map(degree => ({ degree }));
    }
  }
  if (genre.reharm > 0) {
    const depth = genre.reharm * (.4 + .6 * request.intensity);
    steps = reharmonise(steps, depth, request.emotion, mode, rng, genre.reharm >= .6);
  }
  const cadence = chooseCadence(request, rng);
  applyCadence(steps, cadence, mode, genre);
  return { steps, cadence };
}

function galantChain(role: SectionRole, rng: () => number): ChordStep[] {
  const opening = rng() < .5 ? SCHEMATA.romanesca : SCHEMATA.doReMi;
  const chain = role === 'develop' ? [SCHEMATA.monte, SCHEMATA.fonte]
    : role === 'contrast' ? [SCHEMATA.fonte, SCHEMATA.ponte, SCHEMATA.cadence]
    : [opening, SCHEMATA.prinner];
  return chain.flat().map(step => ({ ...step }));
}

/** Diatonic neo-Riemannian walk: L and R each move one voice, so chords glide by thirds (docs/theory M07). */
function parsimoniousWalk(mode: ResolvedMode, contour: number, rng: () => number): ChordStep[] {
  const steps: ChordStep[] = [];
  let degree = 0;
  for (let bar = 0; bar < 8; bar += 2) {
    steps.push({ degree }, { degree });
    for (let attempt = 0; attempt < 4; attempt++) {
      const move = rng() < (contour < 0 ? .65 : .35) ? -2 : 2;
      const next = mod(degree + move, 7);
      if (!unstable(mode, next)) { degree = next; break; }
    }
  }
  return steps;
}

/** Local rewrites that keep the progression's goals (docs/theory/reharmonisation-and-substitution.md). */
export function reharmonise(input: readonly ChordStep[], depth: number, emotion: EmotionFamily, mode: ResolvedMode, rng: () => number, cadential = false): ChordStep[] {
  const steps = input.map(step => ({ ...step }));
  // Keep the opening tonic, the half-cadence bar and the cadence; jazz may also recolour the cadential dominant.
  const protectedBars = new Set(cadential ? [0, 3, 7] : [0, 3, 6, 7]);
  const touched = new Set<number>();
  const count = Math.round(clamp(depth, 0, 1) * 3);
  for (let n = 0; n < count; n++) {
    const order = [weighted(REWRITE_WEIGHTS[emotion].map(w => w + 1e-3), rng), 0, 1, 2, 3];
    for (const pick of order) {
      const kind = REWRITES[pick];
      const candidates = steps.map((_, bar) => bar).filter(bar => !protectedBars.has(bar) && !touched.has(bar) && canRewrite(kind, steps, bar, mode));
      if (!candidates.length) continue;
      const bar = candidates[Math.floor(rng() * candidates.length)];
      steps[bar] = rewrite(kind, steps, bar, mode);
      touched.add(bar);
      break;
    }
  }
  return steps;
}

function canRewrite(kind: Rewrite, steps: readonly ChordStep[], bar: number, mode: ResolvedMode): boolean {
  const step = steps[bar], next = steps[bar + 1];
  if (step.quality || step.shift) return false;
  switch (kind) {
    case 'secondary': {
      if (!next || next.quality || mod(next.degree, 7) === 0 || unstable(mode, next.degree)) return false;
      return Math.abs(secondaryShift(mode, next.degree)) <= 1;
    }
    case 'tritone': return mod(step.degree, 7) === 4 && !!next && mod(next.degree, 7) === 0;
    case 'backdoor': return [1, 3].includes(mod(step.degree, 7)) && !!next && mod(next.degree, 7) === 0;
    case 'interchange': return scalePc(mode, 2) === 4 && (mod(step.degree, 7) === 3 || (mod(step.degree, 7) === 5 && scalePc(mode, 5) === 9));
  }
}

const secondaryShift = (mode: ResolvedMode, target: number) => signed(scalePc(mode, target) + 7 - scalePc(mode, target + 4));

function rewrite(kind: Rewrite, steps: readonly ChordStep[], bar: number, mode: ResolvedMode): ChordStep {
  const step = steps[bar], melody = step.melody;
  switch (kind) {
    case 'secondary': {
      const target = steps[bar + 1].degree;
      return { degree: mod(target + 4, 7), shift: secondaryShift(mode, target) || undefined, quality: 'dom7', melody, tag: `V7/${triadNumeral(mode, target)}` };
    }
    case 'tritone':
      return { degree: 1, shift: signed(scalePc(mode, 4) + 6 - scalePc(mode, 1)) || undefined, quality: 'dom7', melody, tag: 'subV7' };
    case 'backdoor':
      return { degree: 6, shift: signed(10 - scalePc(mode, 6)) || undefined, quality: 'dom7', melody, tag: '♭VII7' };
    case 'interchange':
      return mod(step.degree, 7) === 3
        ? { degree: 3, quality: 'minor', melody, tag: 'iv' }
        : { degree: 5, shift: signed(8 - scalePc(mode, 5)), quality: 'major', melody, tag: '♭VI' };
  }
}

/** Period logic (docs/theory/phrase-functions-and-cadences.md): antecedents may stay open, consequents close. */
function chooseCadence(request: HarmonyRequest, rng: () => number): Cadence {
  const closing = request.final || request.index % 2 === 1;
  if (request.genre.cadence === 'loop') return closing ? 'arrival' : 'open';
  if (closing) {
    return (request.emotion === 'trust' || request.emotion === 'sadness') && rng() < .35 ? 'plagal' : 'authentic';
  }
  const [first, second] = WEAK_CADENCES[request.emotion];
  return rng() < .6 ? first : second;
}

function applyCadence(steps: ChordStep[], cadence: Cadence, mode: ResolvedMode, genre: GenreProfile): void {
  const sixth = steps[6], minorKey = scalePc(mode, 2) === 3;
  // Modes without a leading tone borrow the major dominant so the cadence still pulls home.
  const leading = scalePc(mode, 6) === 11 || mode === 'minor';
  const dominant = (step: ChordStep): ChordStep => {
    if (step.tag === 'subV7' && genre.harmony === 'jazz') return step;
    const base = mod(step.degree, 7) === 4 && !step.shift ? { ...step, bass: undefined } : { degree: 4, melody: step.melody };
    return leading ? base : { ...base, quality: 'dom7', tag: 'V7' };
  };
  switch (cadence) {
    case 'authentic': steps[6] = dominant(sixth); steps[7] = { degree: 0, melody: 0 }; break;
    case 'plagal': steps[6] = { degree: 3, melody: sixth.melody }; steps[7] = { degree: 0, melody: 0 }; break;
    case 'arrival': steps[7] = { degree: 0, melody: 0 }; break;
    case 'deceptive': steps[6] = dominant(sixth); steps[7] = { degree: 5, melody: 0 }; break;
    case 'half':
      // A Phrygian half cadence (iv6–V) in minor keys; otherwise approach V from a predominant.
      steps[6] = minorKey ? { degree: 3, bass: 5 } : [1, 3, 5].includes(mod(sixth.degree, 7)) && !sixth.quality ? sixth : { degree: 1 };
      steps[7] = leading ? { degree: 4, melody: 1 } : { degree: 4, quality: 'dom7', melody: 1, tag: 'V7' };
      break;
    case 'open': break;
  }
}

const QUALITY_INTERVALS: Record<ChordQuality, readonly (readonly number[])[]> = {
  dom7: [[0, 4, 7, 10], [0, 4, 7, 10], [0, 4, 10, 14]],
  minor: [[0, 3, 7], [0, 3, 7, 10], [0, 3, 10, 14]],
  major: [[0, 4, 7], [0, 4, 7, 11], [0, 4, 11, 14]],
};

export interface RealisedChord {
  /** Root-position pitches around middle C, three or four distinct pitch classes. */
  pitches: number[];
  pcs: Set<number>;
  rootPc: number;
  /** Bass pitch in the second octave, honouring inversions. */
  bass: number;
  symbol: string;
  roman: string;
}

/** ext: 0 triad, 1 seventh, 2 ninth (fifth omitted to stay within four voices). */
export function realiseChord(step: ChordStep, root: number, mode: ResolvedMode, ext: number): RealisedChord {
  const e = clamp(Math.round(ext), 0, 2), d = step.degree, shift = step.shift ?? 0;
  let pitches: number[];
  if (step.quality) {
    const base = degreePitch(d, root, mode) + shift;
    pitches = QUALITY_INTERVALS[step.quality][e].map(i => base + i);
  } else {
    const degrees = e === 0 ? [d, d + 2, d + 4] : e === 1 ? [d, d + 2, d + 4, d + 6] : [d, d + 2, d + 6, d + 8];
    pitches = degrees.map(x => degreePitch(x, root, mode));
    // Raised leading tone makes the minor-key dominant major.
    if (mode === 'minor' && mod(d, 7) === 4) pitches[1]++;
  }
  const rootPc = mod(pitches[0], 12);
  let bass = degreePitch(step.bass ?? d, root, mode, 2) + (step.bass === undefined ? shift : 0);
  if (mode === 'minor' && step.bass !== undefined && mod(step.bass, 7) === 6 && mod(d, 7) === 4) bass++;
  const { symbol, roman } = nameChord(rootPc, pitches, d, root);
  return { pitches, pcs: new Set(pitches.map(p => mod(p, 12))), rootPc, bass, symbol, roman: step.tag ?? roman };
}

function nameChord(rootPc: number, pitches: readonly number[], degree: number, tonic: number): { symbol: string; roman: string } {
  const rel = new Set(pitches.map(p => mod(p - rootPc, 12)));
  const minor = rel.has(3) && !rel.has(4), nine = rel.has(2);
  const dim = minor && rel.has(6) && !rel.has(7), aug = rel.has(4) && rel.has(8) && !rel.has(7);
  let quality: string;
  if (dim) quality = rel.has(10) ? 'ø7' : rel.has(9) ? '°7' : '°';
  else if (aug) quality = '+';
  else if (minor) quality = rel.has(10) ? (nine ? 'm9' : 'm7') : rel.has(11) ? 'm(maj7)' : nine ? 'm(add9)' : 'm';
  else quality = rel.has(11) ? (nine ? 'maj9' : 'maj7') : rel.has(10) ? (nine ? '9' : rel.has(1) ? '7♭9' : '7') : nine ? 'add9' : '';
  const deg = mod(degree, 7);
  const offset = signed(mod(rootPc - tonic, 12) - SCALES.major[deg]);
  const accidental = offset < 0 ? '♭'.repeat(-offset) : '♯'.repeat(offset);
  const numeral = (minor || dim ? ROMAN_LOWER : ROMAN_UPPER)[deg];
  const romanQuality = minor && !dim && quality.startsWith('m') ? quality.slice(1) : quality;
  return { symbol: `${NOTE_NAMES[rootPc]}${quality}`, roman: `${accidental}${numeral}${romanQuality}` };
}
