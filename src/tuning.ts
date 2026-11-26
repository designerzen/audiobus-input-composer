import type { Tuning } from './types.js';
import { mod } from './theory.js';

export interface TuningProfile {
  label: string;
  description: string;
  /** Reference frequency for A4 (MIDI 69) in Hz. */
  referenceHz: number;
  /**
   * 12 cent offsets from 12-TET, indexed by pitch class relative to the tonic (0..11)
   * when `relative` is true, or absolute pitch class (C=0..B=11) when `relative` is false.
   */
  cents: readonly number[];
  /** Whether the cent table is transposed to the active tonic root. */
  relative: boolean;
}

/**
 * Historical temperaments, concert pitch standards, and microtonal tuning systems.
 * Cent offsets are relative to standard 12-TET (0, 100, 200, ... cents).
 */
export const TUNING_PROFILES: Readonly<Record<Tuning, TuningProfile>> = {
  equal: {
    label: '12-TET Equal (440 Hz)',
    description: 'Standard twelve-tone equal temperament at A4 = 440 Hz',
    referenceHz: 440,
    cents: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    relative: false,
  },
  just: {
    label: 'Just Intonation (5-limit)',
    description: 'Pure harmonic ratios (3:2 fifths, 5:4 major thirds) relative to tonic',
    referenceHz: 440,
    // 1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8
    cents: [0, 11.73, 3.91, 15.64, -13.69, -1.96, -9.78, 1.96, 13.69, -15.64, 17.6, -11.73],
    relative: true,
  },
  pythagorean: {
    label: 'Pythagorean (3-limit)',
    description: 'Pure stacked 3:2 fifths with bright, wide major thirds',
    referenceHz: 440,
    // C, Db, D, Eb, E, F, F#, G, Ab, A, Bb, B
    cents: [0, -9.78, 3.91, -5.87, 7.82, -1.96, 11.73, 1.96, -7.82, 5.87, -3.91, 9.78],
    relative: true,
  },
  meantone: {
    label: 'Quarter-comma Meantone',
    description: 'Renaissance temperament with pure 5:4 major thirds and narrowed fifths',
    referenceHz: 440,
    cents: [0, -24.0, -6.84, 10.26, -13.69, 3.42, -20.53, -3.42, 13.69, -10.26, 6.84, -17.11],
    relative: true,
  },
  werckmeister: {
    label: 'Werckmeister III',
    description: 'Baroque well-temperament giving each key its own harmonic colour',
    referenceHz: 440,
    cents: [0, -9.78, -7.82, -5.87, -9.78, -1.96, -11.73, -3.91, -7.82, -11.73, -3.91, -7.82],
    relative: false,
  },
  kirnberger: {
    label: 'Kirnberger III',
    description: 'Late Baroque well-temperament balancing pure thirds and playable remote keys',
    referenceHz: 440,
    cents: [0, -9.78, -6.84, -5.87, -13.69, -1.96, -9.78, -3.42, -7.82, -10.26, -3.91, -11.73],
    relative: false,
  },
  baroque: {
    label: 'Baroque (A = 415 Hz)',
    description: 'Historical Baroque concert pitch, roughly a semitone below modern A440',
    referenceHz: 415.3,
    cents: [0, -9.78, -6.84, -5.87, -13.69, -1.96, -9.78, -3.42, -7.82, -10.26, -3.91, -11.73],
    relative: false,
  },
  verdi: {
    label: 'Verdi / 432 Hz',
    description: 'Equal temperament referenced to A4 = 432 Hz',
    referenceHz: 432,
    cents: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    relative: false,
  },
  'maqam-rast': {
    label: 'Maqam Rast (quarter-tone)',
    description: 'Arabic Maqam Rast with neutral quarter-flat 3rd and 7th degrees',
    referenceHz: 440,
    cents: [0, 0, 4, -20, -48, -2, 0, 2, 0, 4, -20, -48],
    relative: true,
  },
  'maqam-bayati': {
    label: 'Maqam Bayati (quarter-tone)',
    description: 'Arabic Maqam Bayati with expressive neutral quarter-flat 2nd degree',
    referenceHz: 440,
    cents: [0, -25, -48, -6, 0, -2, 0, 2, -6, 0, -4, 0],
    relative: true,
  },
  pelog: {
    label: 'Pelog (Gamelan)',
    description: 'Javanese Pelog-inspired unequal microtonal intervals',
    referenceHz: 440,
    cents: [0, 22, -18, 35, -30, 14, -42, 8, 28, -24, 18, -36],
    relative: true,
  },
  slendro: {
    label: 'Slendro (Gamelan)',
    description: 'Javanese Slendro-inspired wide equidistant-flavoured pentatonic intervals',
    referenceHz: 440,
    cents: [0, 20, 40, -15, 25, -20, 15, 20, 35, -10, 30, -25],
    relative: true,
  },
  'bohlen-pierce': {
    label: 'Bohlen-Pierce stretch',
    description: 'Non-octave microtonal colour inspired by 13-step tritave divisions',
    referenceHz: 440,
    cents: [0, 46, -8, 38, -15, 31, -23, 23, -31, 15, -38, 8],
    relative: true,
  },
};

/**
 * Total cent deviation of a MIDI pitch from standard 12-TET A4 = 440 Hz.
 * Rounded to 2 decimal places so serialized NoteEvent.detune values stay compact.
 */
export function tuningCentsOffset(pitch: number, tuning: Tuning, root = 0): number {
  const profile = TUNING_PROFILES[tuning];
  const refShift = profile.referenceHz === 440 ? 0 : 1200 * Math.log2(profile.referenceHz / 440);
  const index = profile.relative ? mod(Math.round(pitch) - root, 12) : mod(Math.round(pitch), 12);
  const total = refShift + profile.cents[index];
  return Math.round(total * 100) / 100;
}

/** Exact acoustic frequency in Hz for a MIDI note in the given tuning system. */
export function tuningFrequency(pitch: number, tuning: Tuning = 'equal', root = 0): number {
  const profile = TUNING_PROFILES[tuning];
  const index = profile.relative ? mod(Math.round(pitch) - root, 12) : mod(Math.round(pitch), 12);
  return profile.referenceHz * 2 ** ((pitch - 69 + profile.cents[index] / 100) / 12);
}

/**
 * Builds a MIDI Tuning Standard (MTS) Scale/Octave Tuning 2-byte SysEx message
 * for hardware or DAW synthesizers that support real-time octave tuning.
 */
export function midiTuningSysex(tuning: Tuning, root = 0): number[] {
  const profile = TUNING_PROFILES[tuning];
  const refShift = profile.referenceHz === 440 ? 0 : 1200 * Math.log2(profile.referenceHz / 440);
  const data: number[] = [];
  for (let pc = 0; pc < 12; pc++) {
    const idx = profile.relative ? mod(pc - root, 12) : pc;
    const cents = Math.max(-100, Math.min(100, refShift + profile.cents[idx]));
    // 14-bit value centered at 0x2000 (8192), spanning -100 to +100 cents.
    const val = Math.max(0, Math.min(16383, Math.round(8192 + (cents / 100) * 8192)));
    data.push((val >> 7) & 127, val & 127);
  }
  // Universal Real-Time SysEx: Scale/Octave Tuning Adjust (2-byte form, all channels 0x03 0x7F 0x7F).
  return [0xF0, 0x7F, 0x7F, 0x08, 0x09, 0x03, 0x7F, 0x7F, ...data, 0xF7];
}
