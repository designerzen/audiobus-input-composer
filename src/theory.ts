import type { EmotionFamily, ResolvedMode } from './types.js';

export const SCALES: Record<ResolvedMode, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

export type GrooveStyle = 'bright' | 'steady' | 'tense' | 'spark' | 'elegy' | 'angular' | 'driving' | 'propulsive';

export interface EmotionProfile {
  labels: string[];
  colour: string;
  mode: ResolvedMode;
  contour: number;
  gate: number;
  novelty: number;
  registerOffset: number;
  groove: GrooveStyle;
}

export const EMOTIONS: Record<EmotionFamily, EmotionProfile> = {
  joy: { labels: ['Serenity', 'Joy', 'Ecstasy'], colour: '#f4d35e', mode: 'major', contour: 1, gate: .75, novelty: .3, registerOffset: 2, groove: 'bright' },
  trust: { labels: ['Acceptance', 'Trust', 'Admiration'], colour: '#83b99a', mode: 'major', contour: 0, gate: .92, novelty: .15, registerOffset: 0, groove: 'steady' },
  fear: { labels: ['Apprehension', 'Fear', 'Terror'], colour: '#829cf2', mode: 'phrygian', contour: 0, gate: .45, novelty: .55, registerOffset: -2, groove: 'tense' },
  surprise: { labels: ['Distraction', 'Surprise', 'Amazement'], colour: '#6dd6dc', mode: 'lydian', contour: 1, gate: .62, novelty: .9, registerOffset: 3, groove: 'spark' },
  sadness: { labels: ['Pensiveness', 'Sadness', 'Grief'], colour: '#a996d3', mode: 'minor', contour: -1, gate: .94, novelty: .15, registerOffset: -3, groove: 'elegy' },
  disgust: { labels: ['Boredom', 'Disgust', 'Loathing'], colour: '#c490ba', mode: 'locrian', contour: -1, gate: .4, novelty: .65, registerOffset: -3, groove: 'angular' },
  anger: { labels: ['Annoyance', 'Anger', 'Rage'], colour: '#eb8787', mode: 'harmonic-minor', contour: 0, gate: .52, novelty: .45, registerOffset: -2, groove: 'driving' },
  anticipation: { labels: ['Interest', 'Anticipation', 'Vigilance'], colour: '#edb17b', mode: 'dorian', contour: 1, gate: .68, novelty: .55, registerOffset: 0, groove: 'propulsive' },
};

export const mod = (n: number, d: number): number => ((n % d) + d) % d;
export const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

/** FNV-1a seed hash followed by Mulberry32; stable across query order. */
export function random(seed: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619) >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function weighted(weights: readonly number[], rng: () => number): number {
  if (!weights.length || weights.some(w => !Number.isFinite(w) || w < 0)) throw new RangeError('Weights must be finite and nonnegative');
  const total = weights.reduce((a, b) => a + b, 0);
  if (!total) throw new RangeError('At least one weight must be positive');
  let pick = rng() * total;
  for (let i = 0; i < weights.length; i++) { pick -= weights[i]; if (pick < 0) return i; }
  return weights.length - 1;
}

export function degreePitch(degree: number, root: number, mode: ResolvedMode, octave = 4): number {
  const scale = SCALES[mode];
  return (octave + 1) * 12 + root + Math.floor(degree / 7) * 12 + scale[mod(degree, 7)];
}

/** Equal distribution on a discrete circle; rotation is measured in slots. */
export function euclidean(hits: number, steps: number, rotation = 0): number[] {
  if (!Number.isInteger(steps) || steps < 1 || steps > 4096 || !Number.isInteger(hits) || hits < 0 || hits > steps) throw new RangeError('Invalid Euclidean pattern size');
  const base = Array.from({ length: steps }, (_, i) => Number((i * hits) % steps < hits));
  return base.map((_, i) => base[mod(i - rotation, steps)]);
}

export type Board = boolean[][];
/** Conway B3/S23, synchronous updates; dead boundaries by default. */
export function lifeStep(board: Board, wrap = false): Board {
  const h = board.length, w = board[0]?.length ?? 0;
  if (!w || board.some(row => row.length !== w)) throw new RangeError('Life board must be rectangular and nonempty');
  return board.map((row, y) => row.map((alive, x) => {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      n += Number(wrap ? board[mod(y + dy, h)][mod(x + dx, w)] : board[y + dy]?.[x + dx] ?? false);
    }
    return n === 3 || (alive && n === 2);
  }));
}

export function pitchMask(pitches: readonly number[]): number {
  return pitches.reduce((m, p) => m | (1 << mod(Math.round(p), 12)), 0);
}
export function quantize(pitch: number, mask: number, direction: 'nearest' | 'up' | 'down' = 'nearest'): number | undefined {
  const candidates = Array.from({ length: 128 }, (_, i) => i).filter(p => mask & (1 << (p % 12)));
  return candidates.filter(p => direction === 'nearest' || (direction === 'up' ? p >= pitch : p <= pitch))
    .sort((a, b) => Math.abs(a - pitch) - Math.abs(b - pitch) || a - b)[0];
}

export function intervalVector(mask: number): number[] {
  const pcs = Array.from({ length: 12 }, (_, i) => i).filter(p => mask & (1 << p));
  const counts = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < pcs.length; i++) for (let j = i + 1; j < pcs.length; j++) {
    const d = pcs[j] - pcs[i]; counts[Math.min(d, 12 - d) - 1]++;
  }
  return counts;
}

/** Three- or four-voice ordered voicing search with parallel-fifth/octave avoidance. */
export function voiceLead(chord: readonly number[], previous: readonly number[] = [60, 64, 67]): number[] {
  const n = chord.length;
  if ((n !== 3 && n !== 4) || chord.some(p => !Number.isInteger(p)) || previous.length < 3 || previous.length > 4 || previous.some(p => !Number.isFinite(p))) {
    throw new RangeError('Voice leading requires three or four distinct pitch classes and finite previous voices');
  }
  const pcs = [...new Set(chord.map(p => mod(p, 12)))];
  if (pcs.length !== n) throw new RangeError('Voice leading requires distinct pitch classes');
  // Smoothly align previous voicing length when moving between triads and seventh chords.
  const prev = previous.length === n ? previous : previous.length < n ? [...previous, previous[previous.length - 1] + 3] : previous.slice(0, n);
  const choices = pcs.map(pc => Array.from({ length: 25 }, (_, i) => i + 48).filter(p => p % 12 === pc));
  const maxSpan = n === 4 ? 19 : 16;
  let best: number[] = [], bestCost = Infinity;

  const evaluate = (v: number[]) => {
    v.sort((x, y) => x - y);
    if (v[n - 1] - v[0] > maxSpan) return;
    let cost = 0;
    for (let i = 0; i < n; i++) cost += Math.abs(v[i] - prev[i]);
    // Mild penalty for parallel fifths/octaves between outer or adjacent voices.
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const prevInt = mod(prev[j] - prev[i], 12), currInt = mod(v[j] - v[i], 12);
      if ((currInt === 7 || currInt === 0) && currInt === prevInt && v[i] !== prev[i] && v[j] !== prev[j]) {
        cost += 2.5;
      }
    }
    if (cost < bestCost) { bestCost = cost; best = v; }
  };

  if (n === 3) {
    for (const a of choices[0]) for (const b of choices[1]) for (const c of choices[2]) evaluate([a, b, c]);
  } else {
    for (const a of choices[0]) for (const b of choices[1]) for (const c of choices[2]) for (const d of choices[3]) evaluate([a, b, c, d]);
  }
  if (!best.length) throw new RangeError('Provide a valid three- or four-pitch chord');
  return best;
}

export function trainMarkov(sequence: readonly number[], states = 7, alpha = .5): number[][] {
  if (!Number.isInteger(states) || states < 1 || states > 128 || !Number.isFinite(alpha) || alpha < 0 || sequence.some(s => !Number.isInteger(s) || s < 0 || s >= states)) throw new RangeError('Invalid Markov training input');
  const rows = Array.from({ length: states }, () => Array(states).fill(alpha) as number[]);
  for (let i = 1; i < sequence.length; i++) rows[sequence[i - 1]][sequence[i]]++;
  return rows.map(row => { const n = row.reduce((a, b) => a + b, 0); return n ? row.map(x => x / n) : row.map(() => 1 / states); });
}

export type MotifTransform = 'identity' | 'sequence-up' | 'sequence-down' | 'invert' | 'retrograde';

/** Classical diatonic motif transformations for multi-section development. */
export function transformMotif(motif: readonly number[], kind: MotifTransform): number[] {
  if (!motif.length) return [];
  switch (kind) {
    case 'sequence-up': return motif.map(d => mod(d + 1, 7));
    case 'sequence-down': return motif.map(d => mod(d - 1, 7));
    case 'invert': {
      const axis = motif[0];
      return motif.map(d => mod(2 * axis - d, 7));
    }
    case 'retrograde': return [...motif].reverse();
    default: return [...motif];
  }
}

const ROMAN_UPPER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const ROMAN_LOWER = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

/** Builds a chord symbol and Roman numeral analysis from chord pitches in root position. */
export function describeChord(chord: readonly number[], rootName: string, degree: number, mode: ResolvedMode): { symbol: string; roman: string } {
  const third = mod(chord[1] - chord[0], 12);
  const fifth = mod(chord[2] - chord[0], 12);
  const seventh = chord.length > 3 ? mod(chord[3] - chord[0], 12) : undefined;
  const isMinor = third === 3;
  const isDim = isMinor && fifth === 6;
  const isAug = third === 4 && fifth === 8;

  let suffix = '';
  if (isDim) suffix = seventh === 10 ? 'ø7' : seventh === 9 ? '°7' : '°';
  else if (isAug) suffix = seventh === 11 ? '+maj7' : '+';
  else if (isMinor) suffix = seventh === 11 ? 'm(maj7)' : seventh === 10 ? 'm7' : 'm';
  else suffix = seventh === 11 ? 'maj7' : seventh === 10 ? '7' : '';

  const deg = mod(degree, 7);
  const scaleInterval = SCALES[mode][deg];
  const majorInterval = SCALES.major[deg];
  const accidental = scaleInterval < majorInterval ? '♭' : scaleInterval > majorInterval ? '♯' : '';
  const numeral = (isMinor || isDim ? ROMAN_LOWER : ROMAN_UPPER)[deg];
  const romanSuffix = isDim ? (seventh === 10 ? 'ø7' : seventh === 9 ? '°7' : '°')
    : isAug ? '+'
    : seventh === 11 ? 'maj7'
    : seventh === 10 ? '7' : '';

  return { symbol: `${rootName}${suffix}`, roman: `${accidental}${numeral}${romanSuffix}` };
}
