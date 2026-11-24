import type { EmotionFamily, ResolvedMode } from './types.js';

export const SCALES: Record<ResolvedMode, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10], mixolydian: [0, 2, 4, 5, 7, 9, 10],
};
export const EMOTIONS: Record<EmotionFamily, { labels: string[]; colour: string; mode: ResolvedMode; contour: number; gate: number; novelty: number }> = {
  joy: { labels: ['Serenity', 'Joy', 'Ecstasy'], colour: '#f4d35e', mode: 'major', contour: 1, gate: .75, novelty: .3 },
  trust: { labels: ['Acceptance', 'Trust', 'Admiration'], colour: '#83b99a', mode: 'major', contour: 0, gate: .95, novelty: .15 },
  fear: { labels: ['Apprehension', 'Fear', 'Terror'], colour: '#829cf2', mode: 'minor', contour: 0, gate: .45, novelty: .5 },
  surprise: { labels: ['Distraction', 'Surprise', 'Amazement'], colour: '#6dd6dc', mode: 'mixolydian', contour: 1, gate: .65, novelty: .9 },
  sadness: { labels: ['Pensiveness', 'Sadness', 'Grief'], colour: '#a996d3', mode: 'minor', contour: -1, gate: .95, novelty: .15 },
  disgust: { labels: ['Boredom', 'Disgust', 'Loathing'], colour: '#c490ba', mode: 'dorian', contour: -1, gate: .4, novelty: .65 },
  anger: { labels: ['Annoyance', 'Anger', 'Rage'], colour: '#eb8787', mode: 'minor', contour: 0, gate: .55, novelty: .4 },
  anticipation: { labels: ['Interest', 'Anticipation', 'Vigilance'], colour: '#edb17b', mode: 'dorian', contour: 1, gate: .65, novelty: .55 },
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

/** Three ordered voices, exhaustive bounded inversion/register search. */
export function voiceLead(chord: readonly number[], previous: readonly number[] = [60, 64, 67]): number[] {
  if (chord.length !== 3 || chord.some(p => !Number.isInteger(p)) || previous.length !== 3 || previous.some(p => !Number.isFinite(p)) || new Set(chord.map(p => mod(p, 12))).size !== 3) throw new RangeError('Voice leading requires three distinct pitch classes and three finite previous voices');
  let best: number[] = [], cost = Infinity;
  const pcs = [...new Set(chord.map(p => mod(p, 12)))];
  const choices = pcs.map(pc => Array.from({ length: 25 }, (_, i) => i + 48).filter(p => p % 12 === pc));
  for (const a of choices[0] ?? []) for (const b of choices[1] ?? []) for (const c of choices[2] ?? []) {
    const v = [a, b, c].sort((x, y) => x - y);
    if (v[2] - v[0] > 16) continue;
    const distance = v.reduce((sum, p, i) => sum + Math.abs(p - (previous[i] ?? p)), 0);
    if (distance < cost) { cost = distance; best = v; }
  }
  if (!best.length) throw new RangeError('Provide a three-pitch chord');
  return best;
}

export function trainMarkov(sequence: readonly number[], states = 7, alpha = .5): number[][] {
  if (!Number.isInteger(states) || states < 1 || states > 128 || !Number.isFinite(alpha) || alpha < 0 || sequence.some(s => !Number.isInteger(s) || s < 0 || s >= states)) throw new RangeError('Invalid Markov training input');
  const rows = Array.from({ length: states }, () => Array(states).fill(alpha) as number[]);
  for (let i = 1; i < sequence.length; i++) rows[sequence[i - 1]][sequence[i]]++;
  return rows.map(row => { const n = row.reduce((a, b) => a + b, 0); return n ? row.map(x => x / n) : row.map(() => 1 / states); });
}
