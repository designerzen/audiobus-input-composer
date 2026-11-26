import { ALGORITHMS, FAMILIES, GENRES, MODES, PARTS, type ComposerOptions, type EmotionFamily, type NoteEvent, type PerformanceCue, type Phrase, type ResolvedMode, type Score } from './types.js';
import { clamp, degreePitch, EMOTIONS, mod, NOTE_NAMES, random, resolveMode, SCALES, transformMotif, voiceLead, type EmotionProfile, type MotifTransform } from './theory.js';
import { elaborate, material, type ElaborationOp, type Material } from './engines.js';
import { GENRE_PROFILES, type GenreProfile, type SectionRole } from './genres.js';
import { CLOSED_CADENCES, planHarmony, realiseChord, type ChordStep, type RealisedChord } from './harmony.js';
import { addAccompaniment, addBassLine, addPercussion, byEnergy, compVoicing, fold, nearestWithPc, patternBass, patternComp, patternDrums, type Add, type Grid } from './parts.js';
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
  if (o.motif === undefined) delete o.motif;
  else if (!Array.isArray(o.motif) || o.motif.length < 2 || o.motif.length > 8 || o.motif.some(d => !Number.isInteger(d) || d < 0 || d > 6)) throw new RangeError('motif must be 2–8 scale degrees, 0–6');
  else o.motif = [...o.motif];
  return o;
}

export const pitchName = (pitch: number): string => `${NOTE_NAMES[mod(pitch, 12)]}${Math.floor(pitch / 12) - 1}`;

const ROLES: readonly SectionRole[] = ['establish', 'develop', 'contrast', 'return'];
const ELABORATIONS: Record<EmotionFamily, readonly [ElaborationOp, ElaborationOp]> = {
  joy: ['arpeggiate', 'passing'], trust: ['neighbour', 'passing'], fear: ['neighbour', 'anticipation'], surprise: ['anticipation', 'arpeggiate'],
  sadness: ['passing', 'neighbour'], disgust: ['neighbour', 'anticipation'], anger: ['anticipation', 'arpeggiate'], anticipation: ['anticipation', 'passing'],
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
    // Keep the line singable: folding into range must not leave a leap wider than an octave.
    while (pitch - previous > 12 && pitch - 12 >= 58) pitch -= 12;
    while (previous - pitch > 12 && pitch + 12 <= 90) pitch += 12;
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
  /** Key of the phrase that follows. When it differs, the last bar turns to its dominant. */
  next?: PhraseKey;
  /** Real-time performance cue applied to this phrase (or starting at cueFromBar). */
  cue?: PerformanceCue;
  /** 0-based bar index where an in-phrase cue starts (default 0). */
  cueFromBar?: number;
  /** Energy before a crescendo lifted options.energy, so the swell ramps smoothly from it. */
  cueStartEnergy?: number;
}
export interface PhraseKey { root: number; mode: ResolvedMode }

/** Tonic and mode of a phrase, including its section's key lift. */
export function phraseKey(input: Partial<ComposerOptions>, index: number): PhraseKey {
  const options = normalizeOptions(input), genre = GENRE_PROFILES[options.genre];
  const section = genre.form[index % genre.form.length];
  const mode = options.mode === 'auto' ? resolveMode(EMOTIONS[options.emotion].mode, options.intensity, genre.modes) : options.mode;
  return { root: mod(options.root + (section.lift ?? 0), 12), mode };
}

/** The dominant seventh of the next key, spelled as a step of the current key. */
function pivotDominant(next: PhraseKey, root: number, mode: ResolvedMode): ChordStep {
  const target = mod(next.root + 7 - root, 12), scale = SCALES[mode];
  let degree = 0;
  for (let d = 1; d < 7; d++) if (Math.abs(signedPc(target - scale[d])) < Math.abs(signedPc(target - scale[degree]))) degree = d;
  return { degree, shift: signedPc(target - scale[degree]) || undefined, quality: 'dom7', tag: `V7→${NOTE_NAMES[next.root]}` };
}
const signedPc = (n: number) => mod(n + 6, 12) - 6;

/** Metrical level of an onset within the bar: 0 downbeat, 1 half bar, 2 beat, 3 eighth, 4 finer. */
function metricLevel(position: number): number {
  const p = mod(position, 4);
  const near = (x: number) => Math.abs(p - x) < .02;
  if (near(0) || near(4)) return 0;
  if (near(2)) return 1;
  if (near(1) || near(3)) return 2;
  if ([.5, 1.5, 2.5, 3.5].some(near)) return 3;
  return 4;
}

export function composePhrase(input: Partial<ComposerOptions> = {}, index = 0, start = index * 32, context: PhraseContext = {}): Phrase {
  const options = normalizeOptions(input);
  if (!Number.isInteger(index) || index < 0 || !Number.isFinite(start) || start < 0) throw new RangeError('Invalid phrase position');
  const genre = GENRE_PROFILES[options.genre];
  const profile = EMOTIONS[options.emotion];
  const section = genre.form[index % genre.form.length];
  const cycleStart = index - (index % genre.form.length);
  const final = !!context.final;
  const cue = context.cue;
  const fromBar = clamp(Math.floor(context.cueFromBar ?? 0), 0, 7);
  const lastBar = cue === 'resolve' ? fromBar : 7;
  const phraseLength = (lastBar + 1) * 4;
  const { root, mode } = phraseKey(options, index);
  const energy = clamp(options.energy + (section.energy ?? 0), 0, 1);
  const sectionParts = section.parts ? options.parts.filter(p => section.parts!.includes(p)) : options.parts;
  const parts = cue === 'drop' ? options.parts : (sectionParts.length ? sectionParts : options.parts);
  const swing = clamp(options.swing + genre.swing8, 0, .45);
  const grid: Grid = { slots: genre.grid, swing16: clamp(options.swing / 2 + genre.swing16, 0, .2) };
  const overhang = final || cue === 'resolve' ? 0 : genre.overhang ?? 0;
  const roleIndex = ROLES.indexOf(section.role);

  const themeRng = random(`${options.seed}:theme`);
  const seeded = [0, 2 + Math.floor(themeRng() * 2), 1 + Math.floor(themeRng() * 2), 4];
  const baseMotif = options.motif ?? seeded;
  const transforms: Record<SectionRole, MotifTransform> = { establish: 'identity', develop: 'sequence-up', contrast: profile.contour < 0 ? 'retrograde' : 'invert', return: 'identity' };
  const motif = transformMotif(baseMotif, transforms[section.role]);
  const plan = planHarmony({ genre, emotion: options.emotion, mode, intensity: options.intensity, seed: options.seed, index, cycleStart, role: section.role, final, contour: profile.contour });
  const { steps } = plan;
  let { cadence } = plan;
  const next = context.next;
  const modulating = !final && cue !== 'resolve' && !!next && (next.root !== root || next.mode !== mode);
  // A key or mode change is prepared by the new key's dominant instead of arriving unannounced.
  if (modulating) { steps[7] = pivotDominant(next, root, mode); cadence = 'modulating'; }
  else if (cue === 'resolve') { cadence = 'authentic'; }

  const phrase: Phrase = {
    index, start, length: phraseLength, section: section.name, genre: options.genre, root, options, mode,
    cadence, closed: cue === 'resolve' || CLOSED_CADENCES.includes(cadence), bars: [], events: [],
    ...(cue ? { cue } : {}),
  };
  if (options.programs) phrase.setup = [[192, genre.programs.melody], [193, genre.programs.bass], [194, genre.programs.harmony]];

  let previousVoicing: number[] = [60, 64, 67];
  const center = clamp(72 + profile.registerOffset + genre.melody.register + (roleIndex === 2 ? 3 : 0), 62, 82);
  let previousPitch = clamp(degreePitch(0, root, mode) + profile.registerOffset + genre.melody.register, 58, 84);
  let serial = 0;
  const feel = genre.feel, feelRng = random(`${options.seed}:feel:${index}`);
  let held: NoteEvent[] = [], heldKey = '';
  let currentParts = parts;
  let currentVelScale = 1;

  const add: Add = (part, pitch, onset, duration, velocity, reason, degree) => {
    if (!currentParts.includes(part)) return undefined;
    // Pitched parts lean on strong beats; drums carry their own accents in the pattern.
    const accent = part === 'percussion' ? 1 : 1 - feel.accent * .035 * metricLevel(onset - start);
    // Triangular spread, so most notes stay close to the part's push.
    const spread = (feelRng() + feelRng() - 1) * feel.jitter;
    const push = (feel.parts?.[part] ?? 0) + (part === 'percussion' ? feel.drums?.[pitch] ?? 0 : 0);
    const event: NoteEvent = {
      id: `p${index}:${part}:${serial++}`, part, pitch: Math.round(clamp(pitch, 0, 127)),
      channel: { melody: 1, bass: 2, harmony: 3, percussion: 10 }[part], start: onset,
      duration: Math.max(.01, Math.min(duration, start + phraseLength + overhang - onset)),
      velocity: clamp(currentVelScale === 1 ? velocity * accent : velocity * accent * currentVelScale, .05, 1),
      reason, degree, motifId: `${options.seed}:theme`,
    };
    const timing = Math.round(clamp(push + spread, -.05, .08) * 1e4) / 1e4;
    if (timing) event.timing = timing;
    phrase.events.push(event);
    return event;
  };

  for (let bar = 0; bar <= lastBar; bar++) {
    let barEnergy = energy;
    currentParts = parts;
    currentVelScale = 1;
    let tensionDelta = 0;
    if (cue === 'crescendo' && bar >= fromBar) {
      const span = lastBar - fromBar + 1;
      const progress = (bar - fromBar + 1) / span;
      const startE = clamp((context.cueStartEnergy ?? Math.max(.15, options.energy - .3)) + (section.energy ?? 0), 0, 1);
      const endE = clamp(Math.max(startE + .3, energy, .8), 0, 1);
      barEnergy = clamp(startE + (endE - startE) * progress, 0, 1);
      currentVelScale = .84 + .34 * progress;
      tensionDelta = .18 * progress;
    } else if (cue === 'breakdown' && bar >= fromBar) {
      const stripped = parts.filter(p => p !== 'percussion');
      const reduced = stripped.length ? stripped : parts;
      currentParts = !genre.drums && reduced.length > 2 ? reduced.filter(p => p !== 'bass') : reduced;
      barEnergy = clamp(Math.min(energy - .35, .22), .08, .35);
      currentVelScale = .78;
      tensionDelta = -.16;
    } else if (cue === 'drop') {
      barEnergy = clamp(Math.max(energy, .78), 0, 1);
      currentVelScale = bar === 0 ? 1.12 : 1.06;
    } else if (cue === 'key-change') {
      currentVelScale = bar === 0 ? 1.08 : 1.04;
    }
    if ((cue === 'crescendo' || cue === 'breakdown') && fromBar > 0 && bar === fromBar) {
      held = [];
      heldKey = '';
    }

    const beat = start + bar * 4;
    const resolving = cue === 'resolve' && bar === lastBar;
    const step = resolving ? { degree: 0, melody: 0 } : steps[bar];
    const cadential = resolving || (bar === lastBar && cadence !== 'open');
    const ext = extensionFor(genre, options.intensity, step, bar, cadential);
    const chord = realiseChord(step, root, mode, ext);
    const next = realiseChord(steps[bar + 1] ?? { degree: 0 }, root, mode, 0);
    const voicing = voiceLead(chord.pitches, previousVoicing);
    previousVoicing = voicing;
    const baseTarget = targetTension(options.emotion, options.intensity, barEnergy, bar);
    const target = tensionDelta ? clamp(baseTarget + tensionDelta, 0, 1) : baseTarget;
    const harmonic = harmonicTension(step, ext, cadential);

    if (genre.bass === 'pop') addBassLine(add, chord, next, beat, bar, cadential, barEnergy, swing, profile.groove);
    else patternBass(add, byEnergy(genre.bass, barEnergy), chord, next, beat, grid, barEnergy, cadential);

    if (genre.comp === 'pop') addAccompaniment(add, voicing, beat, cadential, barEnergy, swing, profile.groove);
    else if (genre.hold && !cadential && bar > 0 && stepKey(step) === heldKey && held.length) {
      for (const e of held) e.duration = Math.min(e.duration + 4 + (bar === lastBar ? overhang : 0), start + phraseLength + overhang - e.start);
    } else {
      const notes = compVoicing(genre.voicing, voicing, chord);
      held = patternComp(add, byEnergy(genre.comp, barEnergy), notes, beat, grid, barEnergy, cadential, bar === lastBar ? overhang : 0);
    }
    heldKey = stepKey(step);

    // Melody: several seeded proposals; keep the one whose tension best follows the target curve.
    let melodyTension = 0, hasMelody = false;
    if (currentParts.includes('melody') && (cadential || !genre.melody.rest?.includes(bar))) {
      const materialIndex = section.role === 'return' ? cycleStart : index;
      let best: { notes: MelodyNote[]; last: number; score: number; tension: number } | undefined;
      for (let k = 0; k < (cadential ? 1 : 4); k++) {
        const proposalEnergy = clamp(barEnergy * genre.melody.density + (k === 1 ? .2 : k === 2 ? -.2 : 0), 0, 1);
        let proposal = material({ ...options, energy: proposalEnergy }, materialIndex, bar, motif, { chordDegree: step.degree, sectionIndex: roleIndex, mode, variant: k === 3 ? 1 : 0 });
        // A return restates the opening bars of each half literally, so the theme is recognised, and varies the rest.
        if (section.role === 'return' && index !== cycleStart && bar % 4 >= 2) {
          const rng = random(`${options.seed}:elaborate:${index}:${bar}`);
          proposal = elaborate(proposal, ELABORATIONS[options.emotion][rng() < .65 ? 0 : 1], step.degree, rng);
        }
        const realised = realiseMelody(proposal, {
          step, chord, root, mode, profile, genre, intensity: options.intensity, energy: barEnergy, previous: previousPitch,
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

    if (genre.drums === 'pop') {
      addPercussion(add, beat, bar, cadential, barEnergy, swing, profile.groove);
      if ((cue === 'drop' || cue === 'key-change') && bar === 0 && barEnergy >= .18) {
        add('percussion', 49, beat, .3, clamp(.55 + barEnergy * .25, .05, 1), 'Crash marks the performance transition');
      }
      if (cue === 'crescendo' && bar >= fromBar && !cadential && (bar === lastBar || bar === lastBar - 1) && barEnergy >= .18) {
        for (const slot of [5, 6, 7]) {
          if (bar === 3 && slot === 7 && barEnergy > .42) continue;
          const onset = beat + slot / 2 + (slot % 2 ? swing : 0);
          const maxDur = slot % 2 ? Math.max(.02, .48 - swing) : .44;
          add('percussion', 38, onset, Math.min(.12, maxDur), clamp(.42 + barEnergy * .3 + (slot - 5) * .08, .05, 1), 'Crescendo snare buildup');
        }
      }
    } else if (genre.drums && barEnergy >= .12) {
      const kit = byEnergy(genre.drums, barEnergy);
      const crescendoFill = cue === 'crescendo' && bar >= fromBar && (bar === lastBar || bar === lastBar - 1);
      const fill = (barEnergy > .45 || modulating || crescendoFill) && (bar === lastBar || crescendoFill || (bar === 3 && barEnergy > .7));
      const crash = bar === 0 && ((barEnergy > .6 && section.role !== 'contrast') || cue === 'drop' || cue === 'key-change');
      patternDrums(add, kit, beat, grid, barEnergy, fill, crash);
    }

    phrase.bars.push({
      index: index * 8 + bar, start: beat, chord: chord.symbol, roman: chord.roman, degree: step.degree, pitches: voicing,
      function: bar === lastBar ? (cue === 'resolve' ? 'cadence' : cadence === 'modulating' ? 'modulation' : cadence === 'half' ? 'half cadence' : cadence === 'deceptive' ? 'deceptive cadence' : cadence === 'open' ? 'continuation' : 'cadence')
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
  const phrases = Array.from({ length: count }, (_, i) => composePhrase(options, i, i * 32, i === count - 1 ? { final: true } : { next: phraseKey(options, i + 1) }));
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
