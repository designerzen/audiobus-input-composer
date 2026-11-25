import { ALGORITHMS, FAMILIES, MODES, PARTS, type ComposerOptions, type EmotionFamily, type NoteEvent, type Phrase, type ResolvedMode, type Score } from './types.js';
import { clamp, degreePitch, describeChord, EMOTIONS, mod, random, SCALES, transformMotif, voiceLead, type GrooveStyle, type MotifTransform } from './theory.js';
import { material } from './engines.js';
import { euclidean } from './theory.js';

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

/** Emotion- and section-aware 8-bar harmonic progressions (bar 3 = half cadence, bar 7 = tonic cadence). */
const PROGRESSIONS: Record<EmotionFamily, readonly (readonly number[])[]> = {
  joy: [
    [0, 4, 5, 3, 0, 1, 4, 0],
    [0, 3, 1, 4, 5, 3, 4, 0],
    [5, 3, 0, 4, 1, 3, 4, 0],
  ],
  trust: [
    [0, 3, 0, 4, 5, 3, 4, 0],
    [0, 5, 3, 4, 0, 1, 4, 0],
    [3, 0, 1, 4, 5, 3, 4, 0],
  ],
  fear: [
    [0, 1, 0, 4, 5, 1, 4, 0],
    [0, 5, 1, 4, 0, 6, 1, 0],
    [5, 1, 3, 4, 0, 1, 4, 0],
  ],
  surprise: [
    [0, 1, 4, 5, 3, 1, 4, 0],
    [0, 2, 1, 4, 5, 1, 4, 0],
    [3, 4, 2, 5, 1, 4, 6, 0],
  ],
  sadness: [
    [0, 5, 3, 4, 0, 3, 4, 0],
    [0, 6, 5, 4, 3, 1, 4, 0],
    [5, 3, 0, 4, 3, 5, 4, 0],
  ],
  disgust: [
    [0, 1, 4, 1, 5, 3, 1, 0],
    [0, 3, 6, 4, 1, 5, 1, 0],
    [5, 1, 6, 4, 3, 1, 4, 0],
  ],
  anger: [
    [0, 5, 3, 4, 0, 1, 4, 0],
    [0, 3, 5, 4, 6, 5, 4, 0],
    [5, 4, 3, 4, 0, 5, 4, 0],
  ],
  anticipation: [
    [0, 3, 1, 4, 0, 5, 6, 0],
    [0, 6, 3, 4, 1, 5, 4, 0],
    [3, 4, 5, 4, 1, 3, 4, 0],
  ],
};

function selectHarmony(emotion: EmotionFamily, sectionIndex: number, rng: () => number): readonly number[] {
  const bank = PROGRESSIONS[emotion];
  if (sectionIndex === 2) return bank[2];
  return bank[sectionIndex === 1 && rng() < .55 ? 1 : 0];
}

function phraseArcVelocity(bar: number): number {
  // Natural arch dynamic: gentle opening, rising to bar 5-6 climax, settling at bar 7 cadence.
  const arch = [0, .03, .06, .08, .05, .09, .11, .02];
  return arch[bar] ?? 0;
}

function addAccompaniment(
  add: (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => void,
  voicing: readonly number[],
  beat: number,
  cadence: boolean,
  energy: number,
  swing: number,
  groove: GrooveStyle,
): void {
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

function addBassLine(
  add: (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => void,
  degree: number,
  nextDegree: number,
  root: number,
  mode: ResolvedMode,
  beat: number,
  bar: number,
  cadence: boolean,
  energy: number,
  swing: number,
  groove: GrooveStyle,
): void {
  const bass = degreePitch(degree, root, mode, 2);
  const vel = .6 + energy * .2;
  if (cadence) {
    add('bass', bass, beat, 3.8, vel, 'Tonic arrival completes the phrase', degree);
    return;
  }
  if (energy <= .35) {
    add('bass', bass, beat, 3.6, vel, 'Harmonic root anchors the bar', degree);
    return;
  }
  add('bass', bass, beat, 1.75, vel, 'Harmonic root anchors the bar', degree);
  const midPitch = groove === 'tense' || groove === 'driving'
    ? bass
    : bar % 2 === 0
      ? degreePitch(degree + 4, root, mode, 2)
      : bass + 12;
  const clampedMid = clamp(midPitch, 32, 56);
  if (energy > .62) {
    add('bass', clampedMid, beat + 2, 1.2, vel * .9, 'Fifth or octave supports harmonic rhythm');
    // Approach note into the next bar's root for forward momentum.
    const nextBass = degreePitch(nextDegree, root, mode, 2);
    const approach = nextBass > clampedMid ? nextBass - 1 : nextBass + 1;
    const approachDur = Math.min(.42, Math.max(.03, .48 - swing));
    add('bass', clamp(approach, 32, 56), beat + 3.5 + swing, approachDur, vel * .82, 'Chromatic leading-tone approach into next chord root');
  } else {
    add('bass', clampedMid, beat + 2, 1.65, vel * .9, 'Alternating fifth or octave supports harmonic rhythm');
  }
}

function addPercussion(
  add: (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => void,
  beat: number,
  bar: number,
  cadence: boolean,
  energy: number,
  swing: number,
  groove: GrooveStyle,
): void {
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

export function composePhrase(input: Partial<ComposerOptions> = {}, index = 0, start = index * 32): Phrase {
  const options = normalizeOptions(input);
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(start) || start < 0) throw new RangeError('Invalid phrase position');
  const profile = EMOTIONS[options.emotion];
  const mode = options.mode === 'auto' ? profile.mode : options.mode;
  const rng = random(`${options.seed}:theme`);
  const baseMotif = [0, 2 + Math.floor(rng() * 2), 1 + Math.floor(rng() * 2), 4];
  const sectionIndex = index % 4;
  const sections = ['Establish', 'Develop', 'Contrast', 'Return'];
  const transformMap: MotifTransform[] = ['identity', 'sequence-up', profile.contour < 0 ? 'retrograde' : 'invert', 'identity'];
  const motif = transformMotif(baseMotif, transformMap[sectionIndex]);
  const harmony = selectHarmony(options.emotion, sectionIndex, random(`${options.seed}:harmony:${index}`));
  const phrase: Phrase = { index, start, length: 32, section: sections[sectionIndex], options, mode, bars: [], events: [] };
  let previousVoicing: number[] = [60, 64, 67];
  let previousPitch = clamp(degreePitch(0, options.root, mode) + profile.registerOffset, 58, 84);
  let serial = 0;

  const add = (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => {
    if (!options.parts.includes(part)) return;
    phrase.events.push({
      id: `p${index}:${part}:${serial++}`, part, pitch: Math.round(clamp(pitch, 0, 127)),
      channel: { melody: 1, bass: 2, harmony: 3, percussion: 10 }[part], start: onset,
      duration: Math.max(.01, Math.min(duration, start + 32 - onset)), velocity: clamp(velocity, .05, 1),
      reason, degree, motifId: `${options.seed}:theme`,
    });
  };

  for (let bar = 0; bar < 8; bar++) {
    const beat = start + bar * 4;
    const degree = harmony[bar];
    const nextDegree = harmony[Math.min(7, bar + 1)];
    const cadence = bar === 7;
    const useSeventh = !cadence && options.intensity > .58 && (degree === 4 || degree === 1 || degree === 5 || bar === 3 || bar === 6);
    const chordDegrees = useSeventh ? [degree, degree + 2, degree + 4, degree + 6] : [degree, degree + 2, degree + 4];
    const chord = chordDegrees.map(d => degreePitch(d, options.root, mode));
    // Local tonal-profile rule: raised leading tone on minor dominant at cadential preparation.
    if (mode === 'minor' && degree === 4) chord[1]++;
    const voicing = voiceLead(chord, previousVoicing);
    previousVoicing = voicing;
    const { symbol, roman } = describeChord(chord, ROOT_NAMES[mod(chord[0], 12)], degree, mode);
    const tensionBase = degree === 4 ? .78 : degree === 6 ? .65 : degree === 0 ? .12 : degree === 1 ? .5 : .38;
    phrase.bars.push({
      index: index * 8 + bar, start: beat, chord: symbol, roman,
      degree, pitches: voicing,
      function: bar === 7 ? 'cadence' : bar === 3 ? 'half cadence' : bar < 4 ? 'presentation' : 'continuation',
      tension: clamp(tensionBase * (.5 + options.intensity * .5) + (useSeventh ? .08 : 0), 0, 1),
    });

    addBassLine(add, degree, nextDegree, options.root, mode, beat, bar, cadence, options.energy, options.swing, profile.groove);
    addAccompaniment(add, voicing, beat, cadence, options.energy, options.swing, profile.groove);

    const { degrees, gates, explanation } = material(options, index, bar, motif, { chordDegree: degree, sectionIndex });
    const velRng = random(`${options.seed}:vel:${index}:${bar}`);
    const arcBoost = phraseArcVelocity(bar);
    let attacks = 0;

    for (let slot = 0; slot < 8; slot++) {
      if (!gates[slot] || (cadence && slot > 0)) continue;
      let d = degrees[slot];
      if (slot === 0) d = degree;
      else if (profile.contour && options.intensity > .45) d = clamp(d + profile.contour * Number(slot > 3), 0, 8);
      // Keep strong beats chordal; passing/neighbor motion is available between anchors.
      const chordal = slot % 4 === 0;
      if (chordal) d = chordDegrees.sort((a, b) => Math.abs(a - d) - Math.abs(b - d))[0];
      if (cadence) d = 0;
      let pitch = degreePitch(d, options.root, mode);
      if (mode === 'minor' && degree === 4 && mod(d, 7) === 6) pitch++;
      const targetCenter = clamp(72 + profile.registerOffset + (sectionIndex === 2 ? 3 : 0), 62, 82);
      while (pitch - previousPitch > 9) pitch -= 12;
      while (previousPitch - pitch > 9) pitch += 12;
      if (!cadence && Math.abs(pitch - targetCenter) > 14) pitch += pitch < targetCenter ? 12 : -12;
      pitch = clamp(pitch, 58, 90);
      if (cadence) {
        // Guarantee tonic pitch class on the final cadential arrival.
        const tonic = 60 + options.root;
        pitch = Math.abs(tonic + 12 - previousPitch) < Math.abs(tonic - previousPitch) ? tonic + 12 : tonic;
      }
      previousPitch = pitch;
      const offset = slot / 2 + (slot % 2 ? options.swing : 0);
      const nextSlot = gates.findIndex((g, i) => i > slot && g > 0);
      const space = nextSlot < 0 ? 4 - offset : nextSlot / 2 + (nextSlot % 2 ? options.swing : 0) - offset;
      const duration = cadence ? 3.5 : Math.max(.01, Math.min(space * profile.gate, .6 + (1 - options.energy) * .7));
      const humanize = (velRng() - .5) * .06;
      const velocity = .48 + options.energy * .2 + options.intensity * .08 + arcBoost + (slot % 4 === 0 ? .08 : 0) + humanize;
      add('melody', pitch, beat + offset, duration, velocity,
        cadence ? 'Cadential tonic, protected from surface variation' : chordal ? `${explanation}; chord-tone anchor` : `${explanation}; motif elaboration`, d);
      attacks++;
    }

    addPercussion(add, beat, bar, cadence, options.energy, options.swing, profile.groove);
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
