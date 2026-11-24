import type { ComposerOptions } from './types.js';
import { clamp, euclidean, lifeStep, mod, random, trainMarkov, weighted } from './theory.js';

export interface Material { degrees: number[]; gates: number[]; explanation: string }

/** Small GA: protected anchors, tournament selection, interior crossover and mutation. */
export function evolveMotif(seed: readonly number[], rng: () => number, generations = 12): number[] {
  if (seed.length < 3 || seed.some(n => !Number.isInteger(n) || n < 0 || n > 6) || !Number.isInteger(generations) || generations < 0 || generations > 256) throw new RangeError('Invalid evolution bounds');
  const fitness = (a: number[]) => a.reduce((cost, d, i) => cost + Math.abs(d - seed[i]) * .7 + (i ? Math.max(0, Math.abs(d - a[i - 1]) - 2) : 0), 0) - new Set(a).size * .7;
  const mutate = (a: number[]) => a.map((d, i) => i && i < a.length - 1 && rng() < .3 ? clamp(d + (rng() < .5 ? -1 : 1), 0, 6) : d);
  let population = [Array.from(seed), ...Array.from({ length: 15 }, () => mutate(Array.from(seed)))];
  for (let g = 0; g < generations; g++) {
    population.sort((a, b) => fitness(a) - fitness(b));
    const next = [population[0].slice(), population[1].slice()];
    const tournament = () => { const a = population[Math.floor(rng() * 16)], b = population[Math.floor(rng() * 16)]; return fitness(a) < fitness(b) ? a : b; };
    while (next.length < 16) {
      const a = tournament(), b = tournament(), cut = 1 + Math.floor(rng() * (seed.length - 2));
      next.push(mutate([...a.slice(0, cut), ...b.slice(cut)]));
    }
    population = next;
  }
  return population.sort((a, b) => fitness(a) - fitness(b))[0];
}

/** Generates eight eighth-note candidates; theory chooses anchors and realizations later. */
export function material(options: ComposerOptions, phrase: number, bar: number, motif: readonly number[]): Material {
  const rng = random(`${options.seed}:material:${phrase}:${bar}:${options.algorithm}`);
  const density = 2 + Math.round(options.energy * 5);
  const gates = euclidean(density, 8, bar % 2);
  let degrees = Array.from({ length: 8 }, (_, i) => motif[i % motif.length]);
  let explanation: string;
  switch (options.algorithm) {
    case 'markov': {
      const model = trainMarkov([...motif, 2, 1, 4, 0, ...motif]);
      let state = motif[0];
      degrees = degrees.map(() => { const result = state; state = weighted(model[state], rng); return result; });
      explanation = 'Smoothed degree-transition model; anchors and cadence imposed by the phrase planner';
      break;
    }
    case 'life': {
      // Same seed for a phrase, advancing one generation per bar.
      const boardRng = random(`${options.seed}:life:${phrase}`);
      let board = Array.from({ length: 7 }, () => Array.from({ length: 8 }, () => boardRng() < .3));
      for (let n = 0; n < bar; n++) board = lifeStep(board, true);
      degrees = degrees.map((d, x) => { const rows = board.flatMap((row, y) => row[x] ? [y] : []); return rows.length ? rows[Math.floor(rng() * rows.length)] : d; });
      for (let x = 1; x < 8; x++) gates[x] = gates[x] && Number(board.some(row => row[x]));
      explanation = 'Wrapped Life board, one generation per bar; column readout proposes degree and activity';
      break;
    }
    case 'evolution':
      degrees = evolveMotif(degrees, rng);
      explanation = 'Bounded evolutionary variation balances theme distance, leap cost and degree diversity';
      break;
    case 'grammar': {
      let word = 'A';
      for (let n = 0; n < 5; n++) word = [...word].map(c => c === 'A' ? 'AB' : 'A').join('');
      degrees = degrees.map((d, i) => mod(d + (word[(i + bar) % word.length] === 'A' ? 0 : 1), 7));
      explanation = 'Fibonacci rewriting A→AB, B→A selects motif and neighbour variants';
      break;
    }
    case 'torus': {
      let x = bar, y = phrase % 3;
      degrees = degrees.map(() => { x += rng() < .5 ? -1 : 1; if (rng() < .35) y++; const pc = mod(x + 5 * y, 12); return Math.round(pc * 6 / 11); });
      explanation = 'Semitone/fourth torus walk compressed to degree proposals, then harmonically realized';
      break;
    }
    case 'euclidean':
      degrees = degrees.map((d, i) => motif[mod(i + bar, motif.length)] ?? d);
      explanation = 'Euclidean attack distribution with rotating motif readout';
      break;
    default:
      if (bar >= 4) degrees = degrees.map((d, i) => i % 2 ? clamp(d + (phrase % 2 ? -1 : 1), 0, 6) : d);
      explanation = 'Motif recall with controlled neighbour elaboration in the answering phrase';
  }
  gates[0] = 1;
  return { degrees, gates, explanation };
}
