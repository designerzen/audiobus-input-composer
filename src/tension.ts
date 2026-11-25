import type { EmotionFamily } from './types.js';
import { clamp, mod } from './theory.js';
import type { ChordStep } from './harmony.js';

/**
 * Per-bar target tension shapes for an 8-bar phrase (docs/theory/expectation-and-tension.md).
 * These are design proposals, not measured curves: emotion picks the shape, energy shifts it, intensity scales it.
 */
export const TENSION_SHAPES: Record<EmotionFamily, readonly number[]> = {
  joy: [.3, .4, .5, .45, .5, .6, .55, .25],
  trust: [.25, .3, .3, .35, .3, .35, .35, .2],
  fear: [.4, .5, .55, .6, .65, .7, .75, .6],
  surprise: [.25, .3, .7, .3, .25, .75, .4, .3],
  sadness: [.35, .4, .45, .5, .45, .5, .55, .35],
  disgust: [.45, .55, .5, .6, .55, .6, .65, .5],
  anger: [.6, .65, .7, .7, .75, .8, .8, .55],
  anticipation: [.3, .38, .46, .54, .6, .68, .78, .5],
};

export function targetTension(emotion: EmotionFamily, intensity: number, energy: number, bar: number): number {
  const shape = TENSION_SHAPES[emotion][mod(bar, 8)];
  return clamp(.5 + (shape - .5) * (.6 + .8 * intensity) + (energy - .5) * .25, 0, 1);
}

const FUNCTION_TENSION = [.12, .5, .38, .38, .78, .38, .65];

/** Harmonic tension from function, chromatic colour, extensions and inversion. */
export function harmonicTension(step: ChordStep, ext: number, cadential: boolean): number {
  const degree = mod(step.degree, 7);
  if (cadential && degree === 0 && !step.quality) return .08;
  let t = FUNCTION_TENSION[degree];
  if (step.quality === 'dom7' && degree !== 4) t += .18;
  else if (step.quality) t += .1;
  if (step.shift) t += .08;
  t += .06 * ext;
  if (step.bass !== undefined && step.bass !== step.degree) t += .05;
  return clamp(t, 0, 1);
}

/** Melodic tension from onset rate, non-chord tones, height above the register centre and leap size. */
export function melodicTension(pitches: readonly number[], chordPcs: ReadonlySet<number>, center: number): number {
  if (!pitches.length) return 0;
  const onsets = pitches.length / 8;
  const foreign = pitches.filter(p => !chordPcs.has(mod(p, 12))).length / pitches.length;
  const mean = pitches.reduce((a, b) => a + b, 0) / pitches.length;
  const height = clamp((mean - center) / 12 + .5, 0, 1);
  let leaps = 0;
  for (let i = 1; i < pitches.length; i++) leaps += Math.abs(pitches[i] - pitches[i - 1]);
  const leap = pitches.length > 1 ? clamp(leaps / (pitches.length - 1) / 7, 0, 1) : 0;
  return clamp(.35 * onsets + .3 * foreign + .2 * height + .15 * leap, 0, 1);
}

export const combineTension = (harmonic: number, melodic: number, hasMelody: boolean): number =>
  hasMelody ? clamp(.55 * harmonic + .45 * melodic, 0, 1) : harmonic;
