import { ALGORITHMS, FAMILIES, GENRES, MODES, PARTS, type ComposerOptions, type EmotionFamily, type NoteEvent, type Phrase, type ResolvedMode, type Score } from './types.js';
import { clamp, degreePitch, EMOTIONS, euclidean, mod, NOTE_NAMES, random, resolveMode, SCALES, transformMotif, voiceLead, type EmotionProfile, type GrooveStyle, type MotifTransform } from './theory.js';
import { elaborate, material, type ElaborationOp, type Material } from './engines.js';
import { GENRE_PROFILES, type DrumKit, type GenreProfile, type SectionRole } from './genres.js';
import { CLOSED_CADENCES, planHarmony, realiseChord, type ChordStep, type RealisedChord } from './harmony.js';
import { combineTension, harmonicTension, melodicTension, targetTension } from './tension.js';
import { GENERATOR_VERSION } from './version.js';

export const DEFAULT_OPTIONS: Readonly<ComposerOptions> = Object.freeze({
  seed: 'first-light', emotion: 'joy', intensity: 2 / 3, energy: .5, tempo: 104,
  root: 0, mode: 'auto', algorithm: 'motif', genre: 'pop', bars: 16, swing: 0,
  parts: Object.freeze(['melody', 'bass', 'harmony', 'percussion']) as unknown as ComposerOptions['parts'],
  programs: false,
});

export function normalizeOptions(input: Partial<ComposerOptions> = {}): ComposerOptions {
  const o = { ...DEFAULT_OPTIONS, ...input, parts: [...(input.parts ?? DEFAULT_OPTIONS.parts)] };
  if (typeof o.seed !== 'string' || !o.seed.trim() || o.seed.length > 128) throw new RangeError('Seed must contain 1–128 characters');
  if (!FAMILIES.includes(o.emotion) || !ALGORITHMS.includes(o.algorithm) || !MODES.includes(o.mode) || !GENRES.includes(o.genre)) throw new RangeError('Unknown emotion, algorithm, mode or genre');
  for (const key of ['energy', 'intensity', 'tempo', 'root', 'bars', 'swing'] as const) if (!Number.isFinite(o[key])) throw new RangeError(`${key} must be finite`);
  if (o.energy < 0 || o.energy > 1 || o.intensity < 0 || o.intensity > 1 || o.tempo < 30 || o.tempo > 240 || o.swing < 0 || o.swing > .45) throw new RangeError('Control outside its supported range');
  if (!Number.isInteger(o.root) || o.root < 0 || o.root > 11 || !Number.isInteger(o.bars) || o.bars < 8 || o.bars > 128 || o.bars % 8) throw new RangeError('Root must be 0–11 and bars a multiple of eight, 8–128');
  if (o.parts.some(p => !PARTS.includes(p)) || new Set(o.parts).size !== o.parts.length) throw new RangeError('Invalid or duplicate part');
  if (typeof o.programs !== 'boolean') throw new RangeError('programs must be true or false');
  return o;
}

export const pitchName = (pitch: number): string => `${NOTE_NAMES[mod(pitch, 12)]}${Math.floor(pitch / 12) - 1}`;

type Add = (part: NoteEvent['part'], pitch: number, onset: number, duration: number, velocity: number, reason: string, degree?: number) => NoteEvent | undefined;

const ROLES: readonly SectionRole[] = ['establish', 'develop', 'contrast', 'return'];
const ELABORATIONS: Record<EmotionFamily, readonly [ElaborationOp, ElaborationOp]> = {
  joy: ['arpeggiate', 'passing'], trust: ['neighbour', 'passing'], fear: ['neighbour', 'anticipation'], surprise: ['anticipation', 'arpeggiate'],
  sadness: ['passing', 'neighbour'], disgust: ['neighbour', 'anticipation'], anger: ['anticipation', 'arpeggiate'], anticipation: ['anticipation', 'passing'],
};
const DRUM_WEIGHTS: Record<string, number> = { X: 1, x: .82, o: .62, g: .4, r: .75 };
const DRUM_REASONS: Record<number, string> = {
  36: 'Kick anchors the metrical hierarchy', 37: 'Rim click articulates the clave', 38: 'Snare backbeat contrast', 39: 'Clap marks the backbeat',
  42: 'Closed hi-hat subdivision', 46: 'Open hi-hat lifts the off-beat', 49: 'Crash marks the section downbeat', 51: 'Ride cymbal carries the swing',
  70: 'Shaker texture fills the grid',
};

function phraseArcVelocity(bar: number): number {
  // Natural arch dynamic: gentle opening, rising to bar 5-6 climax, settling at bar 7 cadence.
  const arch = [0, .03, .06, .08, .05, .09, .11, .02];
  return arch[bar] ?? 0;
}

/** Nearest pitch to `pitch` whose class belongs to the chord; ties go toward the previous melody note. */
function snapToChord(pitch: number, pcs: ReadonlySet<number>, previous: number): number {
  if (pcs.has(mod(pitch, 12))) return pitch;
  for (let distance = 1; distance <= 6; distance++) {
    const found = [pitch - distance, pitch + distance].filter(p => pcs.has(mod(p, 12)));
    if (found.length) return found.sort((a, b) => Math.abs(a - previous) - Math.abs(b - previous))[0];
  }
  return pitch;
}

function nearestWithPc(pc: number, reference: number, low: number, high: number): number {
  let best = low + mod(pc - low, 12);
  for (let p = best; p <= high; p += 12) if (Math.abs(p - reference) < Math.abs(best - reference)) best = p;
  return best;
}

const fold = (pitch: number, low: number, high: number) => {
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

function addAccompaniment(add: Add, voicing: readonly number[], beat: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
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

function addBassLine(add: Add, chord: RealisedChord, next: RealisedChord, beat: number, bar: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
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

function addPercussion(add: Add, beat: number, bar: number, cadence: boolean, energy: number, swing: number, groove: GrooveStyle): void {
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
const byEnergy = <T>(levels: { low: T; mid: T; high: T }, energy: number): T => energy < .34 ? levels.low : energy < .67 ? levels.mid : levels.high;

interface Grid { slots: number; swing16: number }
const slotOnset = (slot: number, grid: Grid) => slot * 4 / grid.slots + (grid.slots === 16 && slot % 2 ? grid.swing16 : 0);

/** Attack segments of a one-bar pattern: each runs until the next attack or the end of the bar. */
function segments(pattern: string, grid: Grid): { slot: number; symbol: string; onset: number; length: number }[] {
  const out = [];
  for (let slot = 0; slot < pattern.length; slot++) {
    const symbol = pattern[slot];
    if (symbol === '.' || symbol === '-') continue;
    let end = slot + 1;
    while (end < pattern.length && pattern[end] === '-') end++;
    const onset = slotOnset(slot, grid);
    let until = end >= pattern.length ? 4 : slotOnset(end, grid);
    // A rest after a sustained run ends the note there.
    if (end < pattern.length && pattern[end] === '.') until = slotOnset(end, grid);
    out.push({ slot, symbol, onset, length: until - onset });
  }
  return out;
}

function patternBass(add: Add, pattern: string, chord: RealisedChord, next: RealisedChord, beat: number, grid: Grid, energy: number, cadence: boolean): void {
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

function compVoicing(style: GenreProfile['voicing'], voicing: readonly number[], chord: RealisedChord): number[] {
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

function patternComp(add: Add, pattern: string, notes: readonly number[], beat: number, grid: Grid, energy: number, cadence: boolean, overhang: number): NoteEvent[] {
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

function patternDrums(add: Add, kit: DrumKit, beat: number, grid: Grid, energy: number, feel: Readonly<Record<number, number>>, fill: boolean, crash: boolean): void {
  const base = .32 + energy * .35, slot = 4 / grid.slots;
  for (const [key, pattern] of Object.entries(kit)) {
    const note = Number(key), push = feel[note] ?? 0;
    for (let i = 0; i < pattern.length; i++) {
      const weight = DRUM_WEIGHTS[pattern[i]];
      if (!weight) continue;
      const onset = beat + slotOnset(i, grid) + push;
      if (pattern[i] === 'r') {
        for (let hit = 0; hit < 3; hit++) add('percussion', note, onset + hit * slot / 3, slot / 3 * .7, base * weight * (.8 + hit * .1), 'Hi-hat roll subdivides the pulse');
      } else {
        add('percussion', note, onset, Math.min(.12, slot * .7), clamp(base * weight + (i === 0 ? .05 : 0), .05, 1), DRUM_REASONS[note] ?? 'Percussion from the genre template');
      }
    }
  }
  if (fill) {
    const snare = kit[38] ?? '', from = grid.slots - grid.slots / 4;
    for (let i = from; i < grid.slots; i++) {
      if (snare[i] && snare[i] !== '.') continue;
      add('percussion', 38, beat + slotOnset(i, grid), Math.min(.1, slot * .7), base * (.5 + .5 * (i - from) / (grid.slots / 4)), 'Turnaround fill signals the phrase boundary');
    }
  }
  if (crash) add('percussion', 49, beat, .3, base, DRUM_REASONS[49]);
}

interface MelodyNote { pitch: number; offset: number; duration: number; velocity: number; degree: number; reason: string }
interface MelodyContext {
  step: ChordStep; chord: RealisedChord; root: number; mode: ResolvedMode; profile: EmotionProfile; genre: GenreProfile;
  intensity: number; energy: number; previous: number; center: number; cadential: boolean; swing: number; velocityKey: string; arc: number;
}

function realiseMelody(m: Material, c: MelodyContext): { notes: MelodyNote[]; last: number } {
  const notes: MelodyNote[] = [];
  const velRng = random(c.velocityKey);
  let previous = c.previous;
  for (let slot = 0; slot < 8; slot++) {
    if (!m.gates[slot] || (c.cadential && slot > 0)) continue;
    let d = m.degrees[slot];
    if (slot === 0) d = c.step.melody ?? c.step.degree;
    else if (c.profile.contour && c.intensity > .45) d = clamp(d + c.profile.contour * Number(slot > 3), 0, 8);
    // Keep strong beats chordal; passing/neighbour motion is available between anchors.
    const chordal = slot % 4 === 0;
    let pitch = degreePitch(d, c.root, c.mode);
    if (c.mode === 'minor' && mod(c.step.degree, 7) === 4 && !c.step.quality && mod(d, 7) === 6) pitch++;
    while (pitch - previous > 9) pitch -= 12;
    while (previous - pitch > 9) pitch += 12;
    if (!c.cadential && Math.abs(pitch - c.center) > 14) pitch += pitch < c.center ? 12 : -12;
    pitch = fold(pitch, 58, 90);
    if (chordal) pitch = fold(snapToChord(pitch, c.chord.pcs, previous), 58, 90);
    // Cadential arrival lands on the planned skeleton degree, nearest the previous note.
    if (c.cadential) pitch = fold(snapToChord(nearestWithPc(mod(degreePitch(c.step.melody ?? 0, c.root, c.mode), 12), previous, 58, 90), c.chord.pcs, previous), 58, 90);
    previous = pitch;
    const offset = slot / 2 + (slot % 2 ? c.swing : 0);
    const nextSlot = m.gates.findIndex((g, i) => i > slot && g > 0);
    const space = nextSlot < 0 ? 4 - offset : nextSlot / 2 + (nextSlot % 2 ? c.swing : 0) - offset;
    const gate = c.genre.melody.gate;
    const duration = c.cadential ? 3.5 : Math.max(.01, Math.min(space * .98, space * c.profile.gate * gate, (.6 + (1 - c.energy) * .7) * gate));
    const humanize = (velRng() - .5) * .06;
    const velocity = .48 + c.energy * .2 + c.intensity * .08 + c.arc + (chordal ? .08 : 0) + humanize;
    notes.push({
      pitch, offset, duration, velocity, degree: d,
      reason: c.cadential ? 'Cadential arrival, protected from surface variation' : chordal ? `${m.explanation}; chord-tone anchor` : `${m.explanation}; motif elaboration`,
    });
  }
  return { notes, last: previous };
}

const stepKey = (s: ChordStep) => `${s.degree}:${s.shift ?? 0}:${s.quality ?? ''}:${s.bass ?? ''}`;

function extensionFor(genre: GenreProfile, intensity: number, step: ChordStep, bar: number, cadential: boolean): number {
  if (genre.harmony === 'emotion' && genre.ext[1] > 0) {
    const degree = mod(step.degree, 7);
    return !cadential && intensity > .58 && (degree === 4 || degree === 1 || degree === 5 || bar === 3 || bar === 6) ? 1 : 0;
  }
  const level = Math.round(genre.ext[0] + (genre.ext[1] - genre.ext[0]) * intensity);
  return cadential && genre.harmony !== 'jazz' && !genre.hold ? Math.min(level, genre.ext[0]) : level;
}

export interface PhraseContext {
  /** Last phrase of a piece: its cadence must close and nothing rings past its end. */
  final?: boolean;
}

export function composePhrase(input: Partial<ComposerOptions> = {}, index = 0, start = index * 32, context: PhraseContext = {}): Phrase {
  const options = normalizeOptions(input);
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(start) || start < 0) throw new RangeError('Invalid phrase position');
  const genre = GENRE_PROFILES[options.genre];
  const profile = EMOTIONS[options.emotion];
  const section = genre.form[index % genre.form.length];
  const cycleStart = index - (index % genre.form.length);
  const final = !!context.final;
  const root = mod(options.root + (section.lift ?? 0), 12);
  const mode = options.mode === 'auto' ? resolveMode(profile.mode, options.intensity, genre.modes) : options.mode;
  const energy = clamp(options.energy + (section.energy ?? 0), 0, 1);
  const sectionParts = section.parts ? options.parts.filter(p => section.parts!.includes(p)) : options.parts;
  const parts = sectionParts.length ? sectionParts : options.parts;
  const swing = clamp(options.swing + genre.swing8, 0, .45);
  const grid: Grid = { slots: genre.grid, swing16: clamp(options.swing / 2 + genre.swing16, 0, .2) };
  const overhang = final ? 0 : genre.overhang ?? 0;
  const roleIndex = ROLES.indexOf(section.role);

  const themeRng = random(`${options.seed}:theme`);
  const baseMotif = [0, 2 + Math.floor(themeRng() * 2), 1 + Math.floor(themeRng() * 2), 4];
  const transforms: Record<SectionRole, MotifTransform> = { establish: 'identity', develop: 'sequence-up', contrast: profile.contour < 0 ? 'retrograde' : 'invert', return: 'identity' };
  const motif = transformMotif(baseMotif, transforms[section.role]);
  const { steps, cadence } = planHarmony({ genre, emotion: options.emotion, mode, intensity: options.intensity, seed: options.seed, index, cycleStart, role: section.role, final, contour: profile.contour });

  const phrase: Phrase = {
    index, start, length: 32, section: section.name, genre: options.genre, root, options, mode,
    cadence, closed: CLOSED_CADENCES.includes(cadence), bars: [], events: [],
  };
  if (options.programs) phrase.setup = [[192, genre.programs.melody], [193, genre.programs.bass], [194, genre.programs.harmony]];

  let previousVoicing: number[] = [60, 64, 67];
  const center = clamp(72 + profile.registerOffset + genre.melody.register + (roleIndex === 2 ? 3 : 0), 62, 82);
  let previousPitch = clamp(degreePitch(0, root, mode) + profile.registerOffset + genre.melody.register, 58, 84);
  let serial = 0;
  let held: NoteEvent[] = [], heldKey = '';

  const add: Add = (part, pitch, onset, duration, velocity, reason, degree) => {
    if (!parts.includes(part)) return undefined;
    const event: NoteEvent = {
      id: `p${index}:${part}:${serial++}`, part, pitch: Math.round(clamp(pitch, 0, 127)),
      channel: { melody: 1, bass: 2, harmony: 3, percussion: 10 }[part], start: onset,
      duration: Math.max(.01, Math.min(duration, start + 32 + overhang - onset)), velocity: clamp(velocity, .05, 1),
      reason, degree, motifId: `${options.seed}:theme`,
    };
    phrase.events.push(event);
    return event;
  };

  for (let bar = 0; bar < 8; bar++) {
    const beat = start + bar * 4;
    const step = steps[bar];
    const cadential = bar === 7 && cadence !== 'open';
    const ext = extensionFor(genre, options.intensity, step, bar, cadential);
    const chord = realiseChord(step, root, mode, ext);
    const next = realiseChord(steps[bar + 1] ?? { degree: 0 }, root, mode, 0);
    const voicing = voiceLead(chord.pitches, previousVoicing);
    previousVoicing = voicing;
    const target = targetTension(options.emotion, options.intensity, energy, bar);
    const harmonic = harmonicTension(step, ext, cadential);

    if (genre.bass === 'pop') addBassLine(add, chord, next, beat, bar, cadential, energy, swing, profile.groove);
    else patternBass(add, byEnergy(genre.bass, energy), chord, next, beat, grid, energy, cadential);

    if (genre.comp === 'pop') addAccompaniment(add, voicing, beat, cadential, energy, swing, profile.groove);
    else if (genre.hold && !cadential && bar > 0 && stepKey(step) === heldKey && held.length) {
      for (const e of held) e.duration = Math.min(e.duration + 4 + (bar === 7 ? overhang : 0), start + 32 + overhang - e.start);
    } else {
      const notes = compVoicing(genre.voicing, voicing, chord);
      held = patternComp(add, byEnergy(genre.comp, energy), notes, beat, grid, energy, cadential, bar === 7 ? overhang : 0);
    }
    heldKey = stepKey(step);

    // Melody: several seeded proposals; keep the one whose tension best follows the target curve.
    let melodyTension = 0, hasMelody = false;
    if (parts.includes('melody') && (cadential || !genre.melody.rest?.includes(bar))) {
      const materialIndex = section.role === 'return' ? cycleStart : index;
      let best: { notes: MelodyNote[]; last: number; score: number; tension: number } | undefined;
      for (let k = 0; k < (cadential ? 1 : 4); k++) {
        const proposalEnergy = clamp(energy * genre.melody.density + (k === 1 ? .2 : k === 2 ? -.2 : 0), 0, 1);
        let proposal = material({ ...options, energy: proposalEnergy }, materialIndex, bar, motif, { chordDegree: step.degree, sectionIndex: roleIndex, mode, variant: k === 3 ? 1 : 0 });
        if (section.role === 'return' && index !== cycleStart) {
          const rng = random(`${options.seed}:elaborate:${index}:${bar}`);
          proposal = elaborate(proposal, ELABORATIONS[options.emotion][rng() < .65 ? 0 : 1], step.degree, rng);
        }
        const realised = realiseMelody(proposal, {
          step, chord, root, mode, profile, genre, intensity: options.intensity, energy, previous: previousPitch,
          center, cadential, swing, velocityKey: `${options.seed}:vel:${index}:${bar}`, arc: phraseArcVelocity(bar),
        });
        const tension = melodicTension(realised.notes.map(n => n.pitch), chord.pcs, center);
        const score = Math.abs(combineTension(harmonic, tension, realised.notes.length > 0) - target) + k * .015;
        if (!best || score < best.score) best = { ...realised, score, tension };
      }
      if (!best?.notes.length) throw new Error('Phrase must preserve a melody anchor');
      for (const n of best.notes) add('melody', n.pitch, beat + n.offset, n.duration, n.velocity, n.reason, n.degree);
      previousPitch = best.last; melodyTension = best.tension; hasMelody = true;
    }

    if (genre.drums === 'pop') addPercussion(add, beat, bar, cadential, energy, swing, profile.groove);
    else if (genre.drums && energy >= .12) {
      const kit = byEnergy(genre.drums, energy);
      const fill = energy > .45 && (bar === 7 || (bar === 3 && energy > .7));
      patternDrums(add, kit, beat, grid, energy, genre.feel ?? {}, fill, bar === 0 && energy > .6 && section.role !== 'contrast');
    }

    phrase.bars.push({
      index: index * 8 + bar, start: beat, chord: chord.symbol, roman: chord.roman, degree: step.degree, pitches: voicing,
      function: bar === 7 ? (cadence === 'half' ? 'half cadence' : cadence === 'deceptive' ? 'deceptive cadence' : cadence === 'open' ? 'continuation' : 'cadence')
        : bar === 3 && mod(step.degree, 7) === 4 && !step.shift ? 'half cadence' : bar < 4 ? 'presentation' : 'continuation',
      tension: combineTension(harmonic, melodyTension, hasMelody), targetTension: target,
    });
  }

  phrase.events.sort((a, b) => a.start - b.start || a.channel - b.channel || a.pitch - b.pitch);
  validateEvents(phrase.events);
  return phrase;
}

export function compose(input: Partial<ComposerOptions> = {}): Score {
  const options = normalizeOptions(input);
  const count = options.bars / 8;
  const phrases = Array.from({ length: count }, (_, i) => composePhrase(options, i, i * 32, { final: i === count - 1 }));
  return { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options, length: options.bars * 4, phrases, events: phrases.flatMap(p => p.events) };
}

export function validateEvents(events: readonly NoteEvent[]): void {
  const ids = new Set<string>();
  for (const e of events) {
    if (!e.id || ids.has(e.id) || !PARTS.includes(e.part) || !Number.isInteger(e.channel) || e.channel < 1 || e.channel > 16 || !Number.isInteger(e.pitch) || e.pitch < 0 || e.pitch > 127 || !Number.isFinite(e.start) || e.start < 0 || !Number.isFinite(e.duration) || e.duration <= 0 || !Number.isFinite(e.velocity) || e.velocity <= 0 || e.velocity > 1) throw new RangeError(`Invalid musical event ${e.id}`);
    ids.add(e.id);
  }
}

export function scaleFor(options: Partial<ComposerOptions> = {}): number[] {
  const o = normalizeOptions(options);
  const mode = o.mode === 'auto' ? resolveMode(EMOTIONS[o.emotion].mode, o.intensity, GENRE_PROFILES[o.genre].modes) : o.mode;
  return SCALES[mode].map(p => mod(p + o.root, 12));
}
