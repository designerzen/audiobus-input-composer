import type { NoteEvent, Part, Phrase, Score } from './types.js';
import { mod } from './theory.js';

/**
 * Musical measures of a score, so changes to the generator can be judged by what they do to the music
 * and not only by whether the output changed (docs/14-evaluation-and-experiments.md).
 */
export interface ScoreMetrics {
  /** Share of melody notes on beats 1 and 3 that belong to their bar's chord, 0–1. */
  chordTones: number;
  /** Mean metrical weakness of melody and bass onsets, 0 all downbeats to 1 all off the eighth grid. */
  syncopation: number;
  /** Share of melody bars whose interval shape already occurred earlier in the score, 0–1. */
  repetition: number;
  /** Shannon entropy of melody pitch classes, normalised to 0–1 by log2(12). */
  pitchEntropy: number;
  /** Melody range in semitones. */
  range: number;
  /** Largest melodic interval within a phrase, in semitones. Each phrase starts afresh after its cadence. */
  maxLeap: number;
  /** Parallel fifths or octaves between consecutive chord voicings, per chord change. */
  parallels: number;
  /** Mean attacks per bar for each part that plays. */
  density: Partial<Record<Part, number>>;
  /** Mean absolute timing offset per part, in beats. */
  looseness: Partial<Record<Part, number>>;
}

/** 0 downbeat, 1 half bar, 2 beat, 3 eighth, 4 finer. */
const level = (beat: number) => {
  const p = mod(beat, 4), near = (x: number) => Math.abs(p - x) < .02 || Math.abs(p - x - 4) < .02;
  if (near(0)) return 0;
  if (near(2)) return 1;
  if (near(1) || near(3)) return 2;
  return [.5, 1.5, 2.5, 3.5].some(near) ? 3 : 4;
};
const mean = (values: readonly number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const round = (n: number) => Math.round(n * 1000) / 1000;

export function scoreMetrics(score: Pick<Score, 'phrases'>): ScoreMetrics {
  const phrases: readonly Phrase[] = score.phrases;
  const events = phrases.flatMap(p => p.events);
  const melody = events.filter(e => e.part === 'melody').sort((a, b) => a.start - b.start);
  const bars = phrases.flatMap(p => p.bars);
  const barAt = (e: NoteEvent) => bars.find(b => e.start >= b.start - 1e-9 && e.start < b.start + 4 - 1e-9);

  const strong = melody.filter(e => level(e.start) <= 1);
  const chordTones = strong.length ? strong.filter(e => barAt(e)?.pitches.some(p => mod(p - e.pitch, 12) === 0)).length / strong.length : 1;

  const rhythmic = events.filter(e => e.part === 'melody' || e.part === 'bass');
  const syncopation = mean(rhythmic.map(e => level(e.start) / 4));

  const shapes = new Set<string>();
  let repeated = 0, shaped = 0;
  for (const bar of bars) {
    const notes = melody.filter(e => e.start >= bar.start - 1e-9 && e.start < bar.start + 4 - 1e-9);
    if (notes.length < 2) continue;
    const shape = notes.slice(1).map((e, i) => `${e.pitch - notes[i].pitch}@${round(mod(e.start, 4))}`).join(',');
    shaped++;
    if (shapes.has(shape)) repeated++; else shapes.add(shape);
  }

  const counts = new Array(12).fill(0);
  for (const e of melody) counts[mod(e.pitch, 12)]++;
  const pitchEntropy = melody.length ? -counts.filter(Boolean).map(c => c / melody.length).reduce((h, p) => h + p * Math.log2(p), 0) / Math.log2(12) : 0;

  const pitches = melody.map(e => e.pitch);
  const leaps = phrases.flatMap(phrase => {
    const line = phrase.events.filter(e => e.part === 'melody').sort((a, b) => a.start - b.start).map(e => e.pitch);
    return line.slice(1).map((p, i) => Math.abs(p - line[i]));
  });

  let parallels = 0, changes = 0;
  for (let i = 1; i < bars.length; i++) {
    const a = bars[i - 1].pitches, b = bars[i].pitches;
    if (a.join() === b.join() || a.length !== b.length) continue;
    changes++;
    for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) {
      const before = mod(a[y] - a[x], 12), after = mod(b[y] - b[x], 12);
      if (before === after && (before === 7 || before === 0) && a[x] !== b[x]) parallels++;
    }
  }

  const density: ScoreMetrics['density'] = {}, looseness: ScoreMetrics['looseness'] = {};
  for (const part of ['melody', 'bass', 'harmony', 'percussion'] as const) {
    const own = events.filter(e => e.part === part);
    if (!own.length) continue;
    density[part] = round(own.length / Math.max(1, bars.length));
    looseness[part] = round(mean(own.map(e => Math.abs(e.timing ?? 0))));
  }

  return {
    chordTones: round(chordTones), syncopation: round(syncopation), repetition: round(shaped ? repeated / shaped : 0),
    pitchEntropy: round(pitchEntropy), range: pitches.length ? Math.max(...pitches) - Math.min(...pitches) : 0,
    maxLeap: leaps.length ? Math.max(...leaps) : 0, parallels: round(changes ? parallels / changes : 0), density, looseness,
  };
}
