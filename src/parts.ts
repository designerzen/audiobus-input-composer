import type { GroovePreset, NoteEvent } from './types.js';
import { clamp, euclidean, mod, random, type GrooveStyle } from './theory.js';
import type { DrumKit, GenreProfile } from './genres.js';
import type { RealisedChord } from './harmony.js';

/**
 * How each part plays a bar: the original pop accompaniment, and the genre pattern players
 * that read bass, comp and drum strings (see genres.ts for the pattern alphabet).
 */

export type Add = (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => NoteEvent | undefined;

const DRUM_WEIGHTS: Record<string, number> = { X: 1, x: .82, o: .62, g: .4, r: .75 };
const DRUM_REASONS: Record<number, string> = {
  36: 'Kick anchors the metrical hierarchy', 37: 'Rim click articulates the clave', 38: 'Snare backbeat contrast', 39: 'Clap marks the backbeat',
  42: 'Closed hi-hat subdivision', 46: 'Open hi-hat lifts the off-beat', 49: 'Crash marks the section downbeat', 51: 'Ride cymbal carries the swing',
  70: 'Shaker texture fills the grid',
};

export function nearestWithPc(pc: number, reference: number, low: number, high: number): number {
  let best = low + mod(pc - low, 12);
  for (let p = best; p <= high; p += 12) if (Math.abs(p - reference) < Math.abs(best - reference)) best = p;
  return best;
}

export const fold = (pitch: number, low: number, high: number) => {
  while (pitch > high) pitch -= 12;
  while (pitch < low) pitch += 12;
  return pitch;
};

/** Chord tone `interval` semitones above the chord root, in the bass register, falling back to `fallback`. */
function bassTone(chord: RealisedChord, intervals: readonly number[], fallback: number): number {
  const rootBass = chord.bass - mod(chord.bass - chord.rootPc, 12);
  const found = intervals.find(i => chord.pcs.has(mod(chord.rootPc + i, 12)));
  return rootBass + (found ?? fallback);
}

export function addAccompaniment(add: Add, voicing: readonly number[], beat: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
  const baseVel = .33 + energy * .16;
  if (cadence || energy < .32) {
    const dur = cadence ? 3.8 : 3.55;
    for (const p of voicing) add('harmony', p, beat, dur, baseVel, cadence ? 'Resolved voice-led tonic harmony' : 'Sustained voice-led harmony');
    return;
  }
  if (energy < .68) {
    // Rhythmic two-pulse or gentle broken-chord accompaniment.
    const split = groove === 'spark' || groove === 'propulsive' ? 1.5 + swing : 2;
    for (const p of voicing) add('harmony', p, beat, split - .15, baseVel, 'Voice-led harmonic pulse');
    for (const p of voicing) add('harmony', p, beat + split, 4 - split - .2, baseVel * .88, 'Answering harmonic comping');
    return;
  }
  // High energy: animated arpeggiated / pulsing figuration without overlapping pitch addresses.
  const order = groove === 'elegy' || groove === 'angular' ? [...voicing].reverse() : voicing;
  for (let slot = 0; slot < 8; slot++) {
    const pitch = order[slot % order.length];
    const onset = beat + slot / 2 + (slot % 2 ? swing : 0);
    const maxSlotDur = slot % 2 ? Math.max(.03, .48 - swing) : .44;
    const vel = baseVel * (slot % 4 === 0 ? 1.05 : .82);
    add('harmony', pitch, onset, Math.min(.42, maxSlotDur), vel, 'Energy-driven arpeggiated harmonic figuration');
  }
}

export function addBassLine(add: Add, chord: RealisedChord, next: RealisedChord, beat: number, bar: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
  const bass = chord.bass;
  const vel = .6 + energy * .2;
  if (cadence) {
    add('bass', bass, beat, 3.8, vel, 'Tonic arrival completes the phrase');
    return;
  }
  if (energy <= .35) {
    add('bass', bass, beat, 3.6, vel, 'Harmonic root anchors the bar');
    return;
  }
  add('bass', bass, beat, 1.75, vel, 'Harmonic root anchors the bar');
  const midPitch = groove === 'tense' || groove === 'driving' ? bass : bar % 2 === 0 ? bassTone(chord, [7, 6, 8], 7) : bass + 12;
  const clampedMid = clamp(midPitch, 32, 56);
  if (energy > .62) {
    add('bass', clampedMid, beat + 2, 1.2, vel * .9, 'Fifth or octave supports harmonic rhythm');
    // Approach note into the next bar's root for forward momentum.
    const approach = next.bass > clampedMid ? next.bass - 1 : next.bass + 1;
    const approachDur = Math.min(.42, Math.max(.03, .48 - swing));
    add('bass', clamp(approach, 32, 56), beat + 3.5 + swing, approachDur, vel * .82, 'Chromatic leading-tone approach into next chord root');
  } else {
    add('bass', clampedMid, beat + 2, 1.65, vel * .9, 'Alternating fifth or octave supports harmonic rhythm');
  }
}

export function addPercussion(add: Add, beat: number, bar: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
  if (energy < .18) return;
  if (cadence) {
    // Gentle cymbal/ride breath on cadential downbeat at higher energy; otherwise let cadence breathe.
    if (energy > .55) add('percussion', 51, beat, .25, .42 + energy * .18, 'Cadential ride shimmer');
    return;
  }
  // Phrase-start accent ride/bell.
  if (bar === 0 && energy > .45) add('percussion', 51, beat, .2, .45 + energy * .2, 'Phrase-opening ride accent');

  const kickHits = energy > .72 ? (groove === 'driving' || groove === 'propulsive' ? 4 : 3) : energy > .42 ? 2 : 1;
  const kickPattern = euclidean(kickHits, 8, 0);
  const snarePitch = groove === 'elegy' || groove === 'steady' ? 37 : 38;
  for (let slot = 0; slot < 8; slot++) {
    const onset = beat + slot / 2 + (slot % 2 ? swing : 0);
    const maxDur = slot % 2 ? Math.max(.02, .48 - swing) : .44;
    if (kickPattern[slot]) {
      add('percussion', 36, onset, Math.min(.14, maxDur), (slot === 0 ? .62 : .48) + energy * .22, 'Euclidean kick anchors the metrical hierarchy');
    }
    if (slot === 4) {
      add('percussion', snarePitch, onset, Math.min(.14, maxDur), .48 + energy * .22, 'Backbeat contrast');
    } else if (bar === 3 && slot === 7 && energy > .42) {
      // Half-cadence turnaround pickup.
      add('percussion', 38, onset, Math.min(.12, maxDur), .38 + energy * .18, 'Half-cadence turnaround fill');
    }
    if (energy > .48 && (slot % 2 === 1 || energy > .78)) {
      const openHat = slot === 7 && energy > .68 && bar % 2 === 1;
      const hatDur = Math.min(openHat ? .22 : .08, maxDur);
      add('percussion', openHat ? 46 : 42, onset, hatDur, (slot % 2 === 0 ? .22 : .3) + energy * .18, openHat ? 'Open hi-hat phrase lift' : 'Hi-hat subdivision within energy budget');
    }
  }
}

/** Genre patterns come in low, mid and high energy versions. */
export const byEnergy = <T>(levels: { low: T; mid: T; high: T }, energy: number): T => energy < .34 ? levels.low : energy < .67 ? levels.mid : levels.high;

export interface Grid { slots: number; swing16: number }
const slotOnset = (slot: number, grid: Grid) => slot * 4 / grid.slots + (grid.slots === 16 && slot % 2 ? grid.swing16 : 0);

/** Transform a one-bar pattern string for groove presets (halftime, doubletime, syncopated) and dynamic variation. */
export function shapePattern(pattern: string, groove: GroovePreset | undefined, dynamics: number, bar: number, seedKey: string, kind: 'bass' | 'comp' | 'drum'): string {
  const len = pattern.length;
  let chars = [...pattern];

  if (groove === 'halftime') {
    // Stretch the first half of the bar across the full bar for a spacious half-time pulse.
    const half = Math.floor(len / 2);
    const out = Array<string>(len).fill('.');
    for (let i = 0; i < half; i++) {
      out[i * 2] = chars[i];
      if (i * 2 + 1 < len && (chars[i] === '-' || (kind !== 'drum' && chars[i] !== '.'))) out[i * 2 + 1] = '-';
    }
    chars = out;
  } else if (groove === 'doubletime') {
    // Tile the first half twice so the groove drives at double speed.
    const half = Math.floor(len / 2);
    chars = chars.map((_, i) => chars[(i % half) * 2] ?? chars[i % half]);
  } else if (groove === 'syncopated') {
    // Shift interior off-beat hits earlier by one slot while anchoring the downbeat.
    const out = [...chars];
    for (let i = 2; i < len - 1; i++) {
      if (chars[i] !== '.' && chars[i] !== '-' && i % 4 === 0 && out[i - 1] === '.') {
        out[i - 1] = chars[i];
        out[i] = kind === 'drum' ? '.' : '-';
      }
    }
    chars = out;
  }

  if (dynamics > 0 && bar > 0) {
    const rng = random(`${seedKey}:${kind}:${bar}`);
    // Subtle bar-to-bar evolution: pickup notes, ghost hits, or breathing rests.
    for (let i = 1; i < len; i++) {
      if (kind === 'drum') {
        if (chars[i] === '.' && i % 2 === 1 && rng() < dynamics * .18) chars[i] = 'g';
        else if (chars[i] === 'g' && rng() < dynamics * .25) chars[i] = '.';
        else if (chars[i] === 'x' && i % 4 !== 0 && rng() < dynamics * .15) chars[i] = 'o';
      } else if (kind === 'bass') {
        if (i === len - 1 && chars[i] === '.' && bar % 2 === 1 && rng() < dynamics * .65) chars[i] = 'A';
        else if (chars[i] === 'R' && i > 0 && i % 4 === 2 && rng() < dynamics * .3) chars[i] = rng() < .5 ? '5' : '8';
      } else if (kind === 'comp') {
        if (chars[i] === '.' && i % 4 === 3 && rng() < dynamics * .22) chars[i] = 'S';
      }
    }
  }

  return chars.join('');
}

/** Shapes an entire drum kit for groove presets (including polyrhythm cross-pulses) and dynamic bar variation. */
export function shapeDrumKit(kit: DrumKit, groove: GroovePreset | undefined, dynamics: number, bar: number, seedKey: string, slots: number): DrumKit {
  if ((!groove || groove === 'auto' || groove === 'straight' || groove === 'swung' || groove === 'pocket' || groove === 'shuffled' || groove === 'human') && dynamics <= 0) {
    return kit;
  }
  const shaped: Record<number, string> = {};
  for (const [key, pattern] of Object.entries(kit)) {
    shaped[Number(key)] = shapePattern(pattern, groove, dynamics, bar, `${seedKey}:d${key}`, 'drum');
  }
  if (groove === 'polyrhythm') {
    // Layer a 3-against-4 (or 5-against-16) Euclidean cross-rhythm on rim click / shaker.
    const hits = slots === 12 ? 5 : 6;
    const poly = euclidean(hits, slots, bar % slots);
    const polyStr = poly.map((h, i) => (h ? (i % 3 === 0 ? 'x' : 'o') : '.')).join('');
    shaped[37] = polyStr;
  }
  return shaped;
}

/** Attack segments of a one-bar pattern: each runs until the next attack or the end of the bar. */
function segments(pattern: string, grid: Grid): { slot: number; symbol: string; onset: number; length: number }[] {
  const localGrid: Grid = { slots: pattern.length, swing16: grid.swing16 };
  const out = [];
  for (let slot = 0; slot < pattern.length; slot++) {
    const symbol = pattern[slot];
    if (symbol === '.' || symbol === '-') continue;
    let end = slot + 1;
    while (end < pattern.length && pattern[end] === '-') end++;
    const onset = slotOnset(slot, localGrid);
    let until = end >= pattern.length ? 4 : slotOnset(end, localGrid);
    // A rest after a sustained run ends the note there.
    if (end < pattern.length && pattern[end] === '.') until = slotOnset(end, localGrid);
    out.push({ slot, symbol, onset, length: until - onset });
  }
  return out;
}

export function patternBass(add: Add, pattern: string, chord: RealisedChord, next: RealisedChord, beat: number, grid: Grid, energy: number, cadence: boolean): void {
  const vel = .58 + energy * .22;
  if (cadence) { add('bass', fold(chord.bass, 28, 55), beat, 3.8, vel, 'Bass arrives with the cadence'); return; }
  const segs = segments(pattern, grid);
  const walkers = segs.filter(s => s.symbol === 'W').length;
  let walk = 0, previous = chord.bass;
  for (const s of segs) {
    let pitch = chord.bass, reason = 'Bass states the harmony on the genre pattern';
    switch (s.symbol) {
      case '5': pitch = bassTone(chord, [7, 6, 8], 7); reason = 'Fifth answers the root'; break;
      case '8': pitch = chord.bass + 12; reason = 'Octave leap animates the bass'; break;
      case '3': pitch = bassTone(chord, [4, 3], 4); reason = 'Chord third colours the bass line'; break;
      case 'A': pitch = previous < next.bass ? next.bass - 1 : next.bass + 1; reason = 'Chromatic approach into the next root'; break;
      case 'W': {
        const k = walk++;
        if (k === 0) { pitch = chord.bass; reason = 'Walking bass: root on the downbeat'; }
        else if (k === walkers - 1) { pitch = previous < next.bass ? next.bass - 1 : next.bass + 1; reason = 'Walking bass: chromatic approach'; }
        else { pitch = bassTone(chord, k === 1 ? [4, 3] : [7, 6, 8], k === 1 ? 4 : 7); reason = 'Walking bass: chord tone'; }
        while (pitch - previous > 7) pitch -= 12;
        while (previous - pitch > 7) pitch += 12;
        break;
      }
    }
    pitch = fold(pitch, 28, 55);
    add('bass', pitch, beat + s.onset, Math.max(.03, s.length * .9 - .02), vel * (s.slot === 0 ? 1.05 : .9), reason);
    previous = pitch;
  }
}

export function compVoicing(style: GenreProfile['voicing'], voicing: readonly number[], chord: RealisedChord): number[] {
  if (style === 'power') { const low = 40 + mod(chord.rootPc - 40, 12); return [low, low + 7, low + 12]; }
  if (style === 'shell') {
    const third = [4, 3].find(i => chord.pcs.has(mod(chord.rootPc + i, 12))) ?? 4;
    const top = [10, 11, 9, 7].find(i => chord.pcs.has(mod(chord.rootPc + i, 12))) ?? 7;
    const a = nearestWithPc(mod(chord.rootPc + third, 12), 60, 52, 70);
    const b = nearestWithPc(mod(chord.rootPc + top, 12), a + 5, a + 1, a + 12);
    return [a, b];
  }
  return [...voicing];
}

export function patternComp(add: Add, pattern: string, notes: readonly number[], beat: number, grid: Grid, energy: number, cadence: boolean, overhang: number): NoteEvent[] {
  const vel = .33 + energy * .16, sustained: NoteEvent[] = [];
  if (cadence) {
    for (const p of notes) { const e = add('harmony', p, beat, 3.8 + overhang, vel, 'Cadential chord rings out'); if (e) sustained.push(e); }
    return sustained;
  }
  const arpeggio = [...notes, ...notes.map(p => p + 12)];
  const alberti = [notes[0], notes[notes.length - 1], notes[1] ?? notes[0], notes[notes.length - 1]];
  let step = 0;
  for (const s of segments(pattern, grid)) {
    const accent = s.slot === 0 ? 1 : .9, toBarEnd = s.onset + s.length >= 4 - 1e-9;
    switch (s.symbol) {
      case 'C': case 'P':
        for (const p of notes) {
          const e = add('harmony', p, beat + s.onset, s.length * .95 - .01 + (toBarEnd ? overhang : 0), vel * accent, s.symbol === 'P' ? 'Power chord drives the rhythm' : 'Sustained chord colour');
          // Only chords that reach the bar line can be held into the next bar.
          if (e && toBarEnd) sustained.push(e);
        }
        break;
      case 'S':
        for (const p of notes) add('harmony', p, beat + s.onset, Math.min(s.length * .6, .35), vel * accent * 1.1, 'Short chord stab on the groove');
        break;
      case 'A':
        add('harmony', arpeggio[step++ % arpeggio.length], beat + s.onset, s.length * .9, vel * accent, 'Arpeggio unfolds the chord in time');
        break;
      case 'L':
        add('harmony', alberti[step++ % alberti.length], beat + s.onset, s.length * .9, vel * accent * .9, 'Alberti figure animates the harmony');
        break;
    }
  }
  return sustained;
}

export function patternDrums(add: Add, kit: DrumKit, beat: number, grid: Grid, energy: number, fill: boolean, crash: boolean): void {
  const base = .32 + energy * .35;
  for (const [key, pattern] of Object.entries(kit)) {
    const note = Number(key);
    const localGrid: Grid = { slots: pattern.length, swing16: grid.swing16 };
    const slot = 4 / localGrid.slots;
    for (let i = 0; i < pattern.length; i++) {
      const weight = DRUM_WEIGHTS[pattern[i]];
      if (!weight) continue;
      const onset = beat + slotOnset(i, localGrid);
      if (pattern[i] === 'r') {
        for (let hit = 0; hit < 3; hit++) add('percussion', note, onset + hit * slot / 3, slot / 3 * .7, base * weight * (.8 + hit * .1), 'Hi-hat roll subdivides the pulse');
      } else {
        add('percussion', note, onset, Math.min(.12, slot * .7), clamp(base * weight + (i === 0 ? .05 : 0), .05, 1), DRUM_REASONS[note] ?? 'Percussion from the genre template');
      }
    }
  }
  const slot = 4 / grid.slots;
  if (fill) {
    const snare = kit[38] ?? '', from = grid.slots - grid.slots / 4;
    for (let i = from; i < grid.slots; i++) {
      if (snare[i] && snare[i] !== '.') continue;
      add('percussion', 38, beat + slotOnset(i, grid), Math.min(.1, slot * .7), base * (.5 + .5 * (i - from) / (grid.slots / 4)), 'Turnaround fill signals the phrase boundary');
    }
  }
  if (crash) add('percussion', 49, beat, .3, base, DRUM_REASONS[49]);
}
