import { ALGORITHMS, FAMILIES, MODES, PARTS, type ComposerOptions, type NoteEvent, type Phrase, type Score } from './types.js';
import { clamp, degreePitch, EMOTIONS, mod, random, SCALES, voiceLead } from './theory.js';
import { material } from './engines.js';

export const DEFAULT_OPTIONS: Readonly<ComposerOptions> = Object.freeze({
  seed: 'first-light', emotion: 'joy', intensity: 2 / 3, energy: .5, tempo: 104,
  root: 0, mode: 'auto', algorithm: 'motif', bars: 16, swing: 0,
  parts: Object.freeze(['melody', 'bass', 'harmony', 'percussion']) as unknown as ComposerOptions['parts'],
});

export function normalizeOptions(input: Partial<ComposerOptions> = {}): ComposerOptions {
  const o = { ...DEFAULT_OPTIONS, ...input, parts: [...(input.parts ?? DEFAULT_OPTIONS.parts)] };
  if (typeof o.seed !== 'string' || !o.seed.trim() || o.seed.length > 128) throw new RangeError('Seed must contain 1–128 characters');
  if (!FAMILIES.includes(o.emotion) || !ALGORITHMS.includes(o.algorithm) || !MODES.includes(o.mode)) throw new RangeError('Unknown emotion, algorithm or mode');
  for (const key of ['energy', 'intensity', 'tempo', 'root', 'bars', 'swing'] as const) if (!Number.isFinite(o[key])) throw new RangeError(`${key} must be finite`);
  if (o.energy < 0 || o.energy > 1 || o.intensity < 0 || o.intensity > 1 || o.tempo < 30 || o.tempo > 240 || o.swing < 0 || o.swing > .45) throw new RangeError('Control outside its supported range');
  if (!Number.isInteger(o.root) || o.root < 0 || o.root > 11 || !Number.isInteger(o.bars) || o.bars < 8 || o.bars > 128 || o.bars % 8) throw new RangeError('Root must be 0–11 and bars a multiple of eight, 8–128');
  if (o.parts.some(p => !PARTS.includes(p)) || new Set(o.parts).size !== o.parts.length) throw new RangeError('Invalid or duplicate part');
  return o;
}

const ROOT_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
export const pitchName = (pitch: number): string => `${ROOT_NAMES[mod(pitch, 12)]}${Math.floor(pitch / 12) - 1}`;

export function composePhrase(input: Partial<ComposerOptions> = {}, index = 0, start = index * 32): Phrase {
  const options = normalizeOptions(input);
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(start) || start < 0) throw new RangeError('Invalid phrase position');
  const profile = EMOTIONS[options.emotion];
  const mode = options.mode === 'auto' ? profile.mode : options.mode;
  const rng = random(`${options.seed}:theme`);
  const motif = [0, 2 + Math.floor(rng() * 2), 1 + Math.floor(rng() * 2), 4];
  const harmony = index % 4 === 2 ? [5, 3, 1, 4, 0, 3, 4, 0] : [0, 3, 1, 4, 0, 5, 4, 0];
  const sections = ['Establish', 'Develop', 'Contrast', 'Return'];
  const phrase: Phrase = { index, start, length: 32, section: sections[index % 4], options, mode, bars: [], events: [] };
  let previousVoicing = [60, 64, 67], previousPitch = degreePitch(0, options.root, mode);
  let serial = 0;
  const add = (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => {
    if (!options.parts.includes(part)) return;
    phrase.events.push({ id: `p${index}:${part}:${serial++}`, part, pitch: Math.round(clamp(pitch, 0, 127)),
      channel: { melody: 1, bass: 2, harmony: 3, percussion: 10 }[part], start: onset,
      duration: Math.min(duration, start + 32 - onset), velocity: clamp(velocity, .05, 1),
      reason, degree, motifId: `${options.seed}:theme` });
  };
  for (let bar = 0; bar < 8; bar++) {
    const beat = start + bar * 4, degree = harmony[bar];
    const chord = [degree, degree + 2, degree + 4].map(d => degreePitch(d, options.root, mode));
    // A local tonal-profile rule: harmonic-minor dominant at phrase preparation.
    if (mode === 'minor' && degree === 4) chord[1]++;
    const voicing = voiceLead(chord, previousVoicing); previousVoicing = voicing;
    const quality = mod(chord[1] - chord[0], 12) === 3 ? 'm' : '';
    const diminished = mod(chord[2] - chord[0], 12) === 6 ? '°' : '';
    const tension = degree === 4 ? .75 : degree === 0 ? .1 : .4;
    phrase.bars.push({ index: index * 8 + bar, start: beat, chord: ROOT_NAMES[chord[0] % 12] + (diminished || quality),
      degree, pitches: voicing, function: bar === 7 ? 'cadence' : bar === 3 ? 'half cadence' : bar < 4 ? 'presentation' : 'continuation',
      tension: tension * (.5 + options.intensity * .5) });
    const cadence = bar === 7;
    const bass = degreePitch(degree, options.root, mode, 2);
    add('bass', bass, beat, cadence ? 3.8 : 1.7, .6 + options.energy * .2, cadence ? 'Tonic arrival completes the phrase' : 'Harmonic root anchors the bar', degree);
    if (!cadence && options.energy > .35) add('bass', bass + (bar % 2 ? 7 : 12), beat + 2, 1.5, .55 + options.energy * .15, 'Alternating fifth or octave supports harmonic rhythm');
    for (const p of voicing) add('harmony', p, beat, cadence ? 3.8 : 3.5, .34 + options.energy * .17, 'Common-tone/inversion search minimizes three-voice movement');
    const { degrees, gates, explanation } = material(options, index, bar, motif);
    let attacks = 0;
    for (let slot = 0; slot < 8; slot++) {
      if (!gates[slot] || (cadence && slot > 0)) continue;
      let d = degrees[slot];
      if (slot === 0) d = degree;
      else if (profile.contour && options.intensity > .45) d = clamp(d + profile.contour * Number(slot > 3), 0, 8);
      // Keep strong beats chordal; passing/neighbor motion is available between anchors.
      const chordal = slot % 4 === 0;
      if (chordal) d = [degree, degree + 2, degree + 4].sort((a, b) => Math.abs(a - d) - Math.abs(b - d))[0];
      if (cadence) d = 0;
      let pitch = degreePitch(d, options.root, mode);
      if (mode === 'minor' && degree === 4 && mod(d, 7) === 6) pitch++;
      while (pitch - previousPitch > 9) pitch -= 12;
      while (previousPitch - pitch > 9) pitch += 12;
      pitch = clamp(pitch, 60, 88); previousPitch = pitch;
      const offset = slot / 2 + (slot % 2 ? options.swing : 0);
      const nextSlot = gates.findIndex((g, i) => i > slot && g > 0);
      const space = nextSlot < 0 ? 4 - offset : nextSlot / 2 + (nextSlot % 2 ? options.swing : 0) - offset;
      const duration = cadence ? 3.5 : Math.max(.01, Math.min(space * profile.gate, .55 + (1 - options.energy) * .65));
      const velocity = .5 + options.energy * .2 + options.intensity * .08 + (slot % 4 === 0 ? .08 : 0);
      add('melody', pitch, beat + offset, duration, velocity,
        cadence ? 'Cadential tonic, protected from surface variation' : chordal ? `${explanation}; chord-tone anchor` : `${explanation}; motif elaboration`, d);
      attacks++;
    }
    if (options.energy >= .2 && !cadence) {
      add('percussion', 36, beat, .12, .55 + options.energy * .25, 'Downbeat kick anchors the metrical hierarchy');
      add('percussion', 38, beat + 2, .12, .48 + options.energy * .2, 'Backbeat contrast');
      if (options.energy > .5) for (let s = 1; s < 8; s += 2) add('percussion', 42, beat + s / 2 + options.swing, .08, .26 + options.energy * .2, 'Optional offbeat activity within the energy budget');
    }
    if (!attacks) throw new Error('Phrase must preserve a melody anchor');
  }
  phrase.events.sort((a, b) => a.start - b.start || a.channel - b.channel || a.pitch - b.pitch);
  validateEvents(phrase.events);
  return phrase;
}

export function compose(input: Partial<ComposerOptions> = {}): Score {
  const options = normalizeOptions(input);
  const phrases = Array.from({ length: options.bars / 8 }, (_, i) => composePhrase(options, i));
  return { schemaVersion: 1, generatorVersion: '0.1.0', options, length: options.bars * 4, phrases, events: phrases.flatMap(p => p.events) };
}

export function validateEvents(events: readonly NoteEvent[]): void {
  const ids = new Set<string>();
  for (const e of events) {
    if (!e.id || ids.has(e.id) || !PARTS.includes(e.part) || !Number.isInteger(e.channel) || e.channel < 1 || e.channel > 16 || !Number.isInteger(e.pitch) || e.pitch < 0 || e.pitch > 127 || !Number.isFinite(e.start) || e.start < 0 || !Number.isFinite(e.duration) || e.duration <= 0 || !Number.isFinite(e.velocity) || e.velocity <= 0 || e.velocity > 1) throw new RangeError(`Invalid musical event ${e.id}`);
    ids.add(e.id);
  }
}

export function scaleFor(options: Partial<ComposerOptions> = {}): number[] {
  const o = normalizeOptions(options), mode = o.mode === 'auto' ? EMOTIONS[o.emotion].mode : o.mode;
  return SCALES[mode].map(p => mod(p + o.root, 12));
}
