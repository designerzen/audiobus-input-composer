import type { Algorithm, AlgorithmMix, ComposerOptions, ResolvedMode } from './types.js';
import { clamp, EMOTIONS, euclidean, lifeStep, mod, nearestDegree, random, trainMarkov, weighted } from './theory.js';

export interface Material { degrees: number[]; gates: number[]; explanation: string }

export interface MaterialContext {
  chordDegree?: number;
  sectionIndex?: number;
  /** Scale used to project chromatic engines such as the torus walk onto degrees. */
  mode?: ResolvedMode;
  /** Alternative seeded proposal for the same bar; 0 is the canonical one. */
  variant?: number;
}

/** Small GA: protected anchors, tournament selection, interior crossover and mutation. */
export function evolveMotif(seed: readonly number[], rng: () => number, generations = 12, contour = 0): number[] {
  if (seed.length < 3 || seed.some(n => !Number.isInteger(n) || n < 0 || n > 6) || !Number.isInteger(generations) || generations < 0 || generations > 256) throw new RangeError('Invalid evolution bounds');
  const fitness = (a: number[]) => {
    let cost = 0;
    for (let i = 0; i < a.length; i++) {
      cost += Math.abs(a[i] - seed[i]) * .65;
      if (i > 0) {
        const step = a[i] - a[i - 1];
        cost += Math.max(0, Math.abs(step) - 2) * 1.1;
        // Reward motion aligned with the emotion's melodic contour.
        if (contour !== 0 && Math.sign(step) === Math.sign(contour)) cost -= .18;
      }
    }
    return cost - new Set(a).size * .7;
  };
  const mutate = (a: number[]) => a.map((d, i) => i && i < a.length - 1 && rng() < .32 ? clamp(d + (rng() < .5 ? -1 : 1), 0, 6) : d);
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
export function material(options: ComposerOptions, phrase: number, bar: number, motif: readonly number[], context: MaterialContext = {}): Material {
  const rng = random(`${options.seed}:material:${phrase}:${bar}:${options.algorithm}${context.variant ? `:v${context.variant}` : ''}`);
  const profile = EMOTIONS[options.emotion];
  const density = clamp(2 + Math.round(options.energy * 5), 1, 8);
  const rotation = (bar + (profile.groove === 'spark' || profile.groove === 'angular' ? 1 : 0)) % 4;
  const gates = euclidean(density, 8, rotation);
  const chordDegree = context.chordDegree ?? 0;
  let degrees = Array.from({ length: 8 }, (_, i) => mod(motif[i % motif.length], 7));
  let explanation: string;
  switch (options.algorithm) {
    case 'markov': {
      const corpus = [...motif, chordDegree, mod(chordDegree + 2, 7), mod(chordDegree + 4, 7), 4, 0, ...motif].map(d => mod(d, 7));
      const model = trainMarkov(corpus, 7, .35 + profile.novelty * .4);
      let state = mod(motif[bar % motif.length], 7);
      degrees = degrees.map((_, slot) => {
        const result = state;
        const row = model[state].map((w, target) => {
          const step = target - state;
          const contourBoost = profile.contour !== 0 && Math.sign(step) === Math.sign(profile.contour) ? 1.35 : 1;
          const chordBoost = (target === chordDegree || target === mod(chordDegree + 2, 7) || target === mod(chordDegree + 4, 7)) && slot % 2 === 0 ? 1.3 : 1;
          return w * contourBoost * chordBoost;
        });
        state = weighted(row, rng);
        return result;
      });
      explanation = 'Contour-biased Markov degree transitions guided by active chord gravity';
      break;
    }
    case 'life': {
      // Same seed for a phrase, advancing one generation per bar; auto-revive if extinct.
      const boardRng = random(`${options.seed}:life:${phrase}`);
      let board = Array.from({ length: 7 }, () => Array.from({ length: 8 }, () => boardRng() < (.28 + options.energy * .14)));
      for (let n = 0; n < bar; n++) {
        board = lifeStep(board, true);
        if (!board.some(row => row.some(Boolean))) {
          // Deterministic glider revival prevents silent stagnation.
          board[1][2] = board[2][3] = board[3][1] = board[3][2] = board[3][3] = true;
        }
      }
      degrees = degrees.map((d, x) => {
        const rows = board.flatMap((row, y) => row[x] ? [y] : []);
        return rows.length ? rows[Math.floor(rng() * rows.length)] : d;
      });
      for (let x = 1; x < 8; x++) gates[x] = gates[x] && Number(board.some(row => row[x]));
      explanation = 'Toroidal Game of Life board, one generation per bar; live columns propose pitch and activity';
      break;
    }
    case 'evolution':
      degrees = evolveMotif(degrees, rng, 12, profile.contour);
      explanation = 'Evolutionary motif search balancing theme distance, stepwise contour and pitch variety';
      break;
    case 'grammar': {
      // Multi-symbol L-system producing rich self-similar melodic elaboration.
      let word = phrase % 2 === 0 ? 'A' : 'AB';
      const rules: Record<string, string> = { A: 'AB', B: 'CA', C: 'DA', D: 'A' };
      for (let n = 0; n < 4; n++) word = [...word].map(c => rules[c] ?? 'A').join('');
      degrees = degrees.map((d, i) => {
        const sym = word[(i + bar * 3) % word.length];
        if (sym === 'B') return mod(d + 1, 7);
        if (sym === 'C') return mod(chordDegree + 2, 7);
        if (sym === 'D') return mod(d - 1, 7);
        return d;
      });
      explanation = 'Multi-rule L-system (A→AB, B→CA, C→DA) weaving motif, chord leaps and neighbours';
      break;
    }
    case 'torus': {
      // Tonnetz-inspired pitch-class walk along fifths (+7) and major thirds (+4).
      let fifths = bar + (phrase % 3), thirds = phrase % 2;
      degrees = degrees.map(() => {
        const move = rng();
        if (move < .45) fifths += profile.contour < 0 ? -1 : 1;
        else if (move < .75) thirds += rng() < .5 ? 1 : -1;
        else fifths += rng() < .5 ? -1 : 1;
        return nearestDegree(mod(fifths * 7 + thirds * 4, 12), context.mode ?? 'major');
      });
      explanation = 'Tonnetz fifth/third torus walk quantised to the nearest scale degree';
      break;
    }
    case 'euclidean': {
      const secondary = euclidean(clamp(Math.round(options.energy * 4) + 1, 1, 8), 8, (bar * 3) % 8);
      degrees = degrees.map((d, i) => {
        const base = motif[mod(i + bar, motif.length)] ?? d;
        return secondary[i] ? mod(base + 2, 7) : base;
      });
      explanation = 'Dual-layer Euclidean rhythm with rotating motif and polyrhythmic chord-third accents';
      break;
    }
    default: {
      if (bar === 2 || bar === 6) {
        degrees = degrees.map((d, i) => i % 2 ? mod(d + (profile.contour < 0 ? -1 : 1), 7) : d);
      } else if (bar >= 4) {
        degrees = degrees.map((d, i) => i % 2 ? clamp(d + (phrase % 2 ? -1 : 1), 0, 6) : mod(d + 1, 7));
      }
      explanation = 'Thematic motif development with diatonic sequence and neighbour elaboration';
    }
  }
  gates[0] = 1;
  return { degrees, gates, explanation };
}

/**
 * Combines two independent generative algorithms into a single unified musical proposal:
 * - `pipeline`: primary generates an intermediate melodic sequence, which feeds into secondary as its motif.
 * - `split`: primary supplies pitch degrees while secondary supplies rhythmic gates.
 * - `alternate`: call-and-response across bars (even bars primary, odd bars secondary) or halves of a bar.
 * - `blend`: slot-by-slot weighted weave of both algorithms' pitches and rhythms.
 * - `counterpoint`: interlocks primary and secondary so secondary fills primary's rests and strong/weak dialogue.
 */
export function combineMaterial(
  options: ComposerOptions,
  phrase: number,
  bar: number,
  motif: readonly number[],
  mix: AlgorithmMix,
  context: MaterialContext = {},
): Material {
  const weight = clamp(mix.weight ?? .5, 0, 1);
  const secondaryOptions: ComposerOptions = { ...options, algorithm: mix.secondary };
  const primary = material(options, phrase, bar, motif, context);

  if (mix.secondary === options.algorithm && mix.mode !== 'pipeline') return primary;

  switch (mix.mode) {
    case 'pipeline': {
      // Feed primary's generated degrees as the motif into the secondary algorithm.
      const seedSlice = primary.degrees.slice(0, clamp(Math.max(4, motif.length), 4, 8));
      const secondary = material(secondaryOptions, phrase, bar, seedSlice, context);
      const rng = random(`${options.seed}:pipe:${phrase}:${bar}:${context.variant ?? 0}`);
      const gates = primary.gates.map((g, i) => {
        if (i === 0) return 1;
        if (g && secondary.gates[i]) return 1;
        if (!g && !secondary.gates[i]) return 0;
        return rng() < (secondary.gates[i] ? weight : 1 - weight) ? 1 : 0;
      });
      return {
        degrees: secondary.degrees,
        gates,
        explanation: `Pipeline (${options.algorithm} → ${mix.secondary}): ${secondary.explanation}`,
      };
    }
    case 'split': {
      const secondary = material(secondaryOptions, phrase, bar, motif, context);
      const gates = [...secondary.gates];
      gates[0] = 1;
      return {
        degrees: primary.degrees,
        gates,
        explanation: `Pitch×Rhythm (${options.algorithm} pitch, ${mix.secondary} rhythm)`,
      };
    }
    case 'alternate': {
      const secondary = material(secondaryOptions, phrase, bar, motif, context);
      // Weight shifts whether alternation happens per bar or half-bar.
      if (weight >= .65) {
        const degrees = primary.degrees.map((d, i) => i < 4 ? d : secondary.degrees[i]);
        const gates = primary.gates.map((g, i) => i < 4 ? g : secondary.gates[i]);
        gates[0] = 1;
        return {
          degrees,
          gates,
          explanation: `Call & response (${options.algorithm} call → ${mix.secondary} answer)`,
        };
      }
      const useSecondary = bar % 2 === 1;
      const chosen = useSecondary ? secondary : primary;
      return {
        degrees: chosen.degrees,
        gates: chosen.gates,
        explanation: `Alternating (${useSecondary ? mix.secondary : options.algorithm} bar ${bar + 1}): ${chosen.explanation}`,
      };
    }
    case 'counterpoint': {
      const secondary = material(secondaryOptions, phrase, bar, motif, context);
      const degrees = primary.degrees.map((d, i) => {
        if (primary.gates[i]) return d;
        if (secondary.gates[i]) return secondary.degrees[i];
        return i % 2 === 1 ? secondary.degrees[i] : d;
      });
      const gates = primary.gates.map((g, i) => {
        if (i === 0) return 1;
        if (g) return 1;
        // Fill primary rests with secondary answers proportional to weight.
        return secondary.gates[i] && (i % 2 === 1 || weight > .55) ? 1 : 0;
      });
      return {
        degrees,
        gates,
        explanation: `Interlocking counterpoint (${options.algorithm} answered by ${mix.secondary})`,
      };
    }
    default: {
      // 'blend': weighted slot-by-slot consensus between primary and secondary.
      const secondary = material(secondaryOptions, phrase, bar, motif, context);
      const rng = random(`${options.seed}:blend:${phrase}:${bar}:${context.variant ?? 0}`);
      const degrees = primary.degrees.map((d, i) => {
        const pickSecondary = i % 2 === 0 ? rng() < weight * .75 : rng() < clamp(weight * 1.15, 0, 1);
        return pickSecondary ? secondary.degrees[i] : d;
      });
      const gates = primary.gates.map((g, i) => {
        if (i === 0) return 1;
        if (g === secondary.gates[i]) return g;
        return rng() < (secondary.gates[i] ? weight : 1 - weight) ? 1 : 0;
      });
      return {
        degrees,
        gates,
        explanation: `Blended (${options.algorithm} + ${mix.secondary})`,
      };
    }
  }
}

export type AlgorithmCandidate = { material: Material; source: Algorithm | 'hybrid' };

export type ElaborationOp = 'passing' | 'neighbour' | 'anticipation' | 'arpeggiate';

/**
 * Re-decorates the weak eighths of existing material while keeping its strong-beat skeleton, so a returning
 * section is recognisably the same tune with a different surface (theme and variations).
 */
export function elaborate(source: Material, op: ElaborationOp, chordDegree: number, rng: () => number): Material {
  const degrees = [...source.degrees], gates = [...source.gates];
  for (let slot = 1; slot < 8; slot += 2) {
    const before = degrees[slot - 1], after = slot < 7 ? degrees[slot + 1] : chordDegree;
    switch (op) {
      case 'passing':
        if (Math.abs(after - before) === 2) { gates[slot] = 1; degrees[slot] = (before + after) / 2; }
        else if (gates[slot]) degrees[slot] = mod(before + Math.sign(after - before || 1), 7);
        break;
      case 'neighbour':
        if (gates[slot]) degrees[slot] = mod(before + (rng() < .5 ? -1 : 1), 7);
        break;
      case 'anticipation':
        if (slot === 3 || slot === 7) { gates[slot] = 1; degrees[slot] = mod(after, 7); }
        break;
      case 'arpeggiate':
        if (gates[slot]) degrees[slot] = mod(chordDegree + (rng() < .5 ? 2 : 4), 7);
        break;
    }
  }
  return { degrees, gates, explanation: `${source.explanation}; ${op} elaboration over the returning skeleton` };
}
