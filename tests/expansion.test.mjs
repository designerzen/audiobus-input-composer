import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALGORITHMS, ALGORITHM_COMBINERS, GENRES, GENRE_MIX_MODES, GENRE_PROFILES, GROOVES, TUNINGS, TUNING_PROFILES,
  ComposerSession, EmotionFollower, combineMaterial, compose, composePhrase, material, midiTuningSysex, mixGenres,
  normalizeOptions, plutchikPath, scoreToMidi, tuningCentsOffset, tuningFrequency,
} from '../dist/index.js';

const mod = (n, d) => ((n % d) + d) % d;

test('new genres produce idiomatic grooves, tempos and valid scores', () => {
  const added = ['dnb', 'funk', 'afrobeat', 'waltz', 'synthwave', 'latin', 'garage'];
  assert.equal(GENRES.length, 20);
  for (const genre of added) {
    const score = compose({ genre, energy: .75, bars: 16, seed: `idiom-${genre}` });
    assert(score.events.length > 40, `${genre} generates a full arrangement`);
    assert(score.phrases.at(-1).closed, `${genre} closes on final phrase`);
  }
  // Afrobeat and Latin use rim-click (37) clave patterns; Waltz uses a 12-slot triple grid.
  const latin = compose({ genre: 'latin', energy: .7, bars: 8 });
  assert(latin.events.some(e => e.part === 'percussion' && e.pitch === 37), 'latin has clave rim clicks');
  assert.equal(GENRE_PROFILES.waltz.grid, 12);
  assert(GENRE_PROFILES.garage.swing16 > .05, 'UK garage has strong 16th-note shuffle');
  assert(GENRE_PROFILES.dnb.tempo[0] >= 165, 'DnB sits in fast breakbeat tempo range');
});

test('groove presets and dynamics create valid bar-to-bar rhythmic variation', () => {
  for (const groove of GROOVES) {
    const score = compose({ genre: 'house', groove, dynamics: .6, energy: .7, bars: 8, seed: `grv-${groove}` });
    const ends = new Map();
    for (const e of score.events) {
      assert(e.start >= 0 && e.start + e.duration <= score.length + 1e-9, `${groove} bounds`);
      const addr = `${e.channel}:${e.pitch}`;
      assert((ends.get(addr) ?? 0) <= e.start + 1e-8, `${groove} no overlap on ${addr} at ${e.start}`);
      ends.set(addr, e.start + e.duration);
    }
  }
  const straight = compose({ genre: 'boom-bap', groove: 'straight', energy: .6, bars: 8 });
  assert(straight.events.every(e => !e.timing), 'straight groove removes microtiming offsets');

  const poly = compose({ genre: 'house', groove: 'polyrhythm', energy: .7, bars: 8 });
  assert(poly.events.some(e => e.part === 'percussion' && e.pitch === 37), 'polyrhythm layers a cross-pulse rim click');

  const staticScore = compose({ genre: 'funk', energy: .7, bars: 8, seed: 'dyn-test' });
  const dynamicScore = compose({ genre: 'funk', energy: .7, dynamics: .9, bars: 8, seed: 'dyn-test' });
  assert.notDeepEqual(
    staticScore.events.filter(e => e.part === 'percussion').map(e => [e.start, e.pitch]),
    dynamicScore.events.filter(e => e.part === 'percussion').map(e => [e.start, e.pitch]),
    'dynamics mutates drum grooves across bars',
  );
});

test('tuning systems compute accurate frequencies, detune pitched events and build valid MTS SysEx', () => {
  assert.equal(TUNINGS.length, 13);
  assert(Math.abs(tuningFrequency(69, 'equal') - 440) < 1e-6);
  assert(Math.abs(tuningFrequency(69, 'verdi') - 432) < 1e-6);
  assert(Math.abs(tuningFrequency(69, 'baroque') - 415.3) < 5);

  // Just intonation perfect fifth (C4 -> G4) is pure 3:2.
  const c4 = tuningFrequency(60, 'just', 0);
  const g4 = tuningFrequency(67, 'just', 0);
  assert(Math.abs(g4 / c4 - 1.5) < 1e-4, `just 5th ratio ${g4 / c4}`);

  // Maqam Rast has a neutral ~quarter-flat 3rd (~ -48 cents).
  assert(tuningCentsOffset(64, 'maqam-rast', 0) < -40);

  // Equal tuning omits detune; non-equal attaches detune to pitched parts only.
  const eq = compose({ genre: 'jazz', bars: 8, seed: 'tune' });
  assert(eq.events.every(e => e.detune === undefined));

  const ji = compose({ genre: 'jazz', tuning: 'just', bars: 8, seed: 'tune' });
  assert(ji.events.some(e => e.part !== 'percussion' && typeof e.detune === 'number'));
  assert(ji.events.filter(e => e.part === 'percussion').every(e => e.detune === undefined));

  const sysex = midiTuningSysex('maqam-rast', 0);
  assert.equal(sysex[0], 0xF0);
  assert.equal(sysex.at(-1), 0xF7);
  assert.equal(sysex.length, 33);

  const midiText = new TextDecoder().decode(scoreToMidi(ji));
  assert(midiText.includes(TUNING_PROFILES.just.label), 'MIDI export embeds tuning label');
});

test('genre mixing fuses idioms across all five modes including cross-grid pairs', () => {
  const pairs = [
    ['jazz', 'dnb'],
    ['galant', 'house'],
    ['pop', 'afrobeat'],
    ['waltz', 'trap'],
    ['ambient', 'funk'],
  ];
  for (const mode of GENRE_MIX_MODES) {
    for (const [primary, secondary] of pairs) {
      const score = compose({
        genre: primary,
        genreMix: { genre: secondary, mode, amount: .55 },
        energy: .7,
        bars: 16,
        seed: `mix-${mode}-${primary}-${secondary}`,
      });
      for (const phrase of score.phrases) {
        const ends = new Map();
        for (const e of phrase.events) {
          assert(e.start >= phrase.start && e.start + e.duration <= score.length + 1e-9);
          const addr = `${e.channel}:${e.pitch}`;
          assert((ends.get(addr) ?? 0) <= e.start + 1e-8, `${mode} ${primary}×${secondary} overlap on ${addr}`);
          ends.set(addr, e.start + e.duration);
        }
      }
      assert(score.phrases.at(-1).closed);
    }
  }
  const swapped = mixGenres(GENRE_PROFILES.galant, { genre: 'house', mode: 'rhythm-swap', amount: .8 }, 0);
  assert.equal(swapped.harmony, 'schemata', 'rhythm-swap keeps primary harmony');
  assert(swapped.drums !== null, 'rhythm-swap imports secondary drums');
});

test('algorithm combiners fuse independent engines across all five modes', () => {
  const opts = normalizeOptions({ seed: 'combo', algorithm: 'torus', energy: .65 });
  const motif = [0, 2, 1, 4];

  const primary = material(opts, 0, 1, motif, { mode: 'major' });
  const secondary = material({ ...opts, algorithm: 'life' }, 0, 1, motif, { mode: 'major' });

  // Split: primary degrees + secondary gates (with downbeat anchor preserved).
  const split = combineMaterial(opts, 0, 1, motif, { secondary: 'life', mode: 'split', weight: .5 }, { mode: 'major' });
  assert.deepEqual(split.degrees, primary.degrees);
  assert.deepEqual(split.gates, [1, ...secondary.gates.slice(1)]);

  // Alternate (bar-level): bar 0 uses primary, bar 1 uses secondary.
  const alt0 = combineMaterial(opts, 0, 0, motif, { secondary: 'life', mode: 'alternate', weight: .5 }, { mode: 'major' });
  const alt1 = combineMaterial(opts, 0, 1, motif, { secondary: 'life', mode: 'alternate', weight: .5 }, { mode: 'major' });
  assert.deepEqual(alt0.degrees, material(opts, 0, 0, motif, { mode: 'major' }).degrees);
  assert.deepEqual(alt1.degrees, secondary.degrees);

  // Full compose check across all combiner modes and algorithm pairs.
  for (const mode of ALGORITHM_COMBINERS) {
    const score = compose({
      genre: 'funk',
      algorithm: 'grammar',
      algorithmMix: { secondary: 'evolution', mode, weight: .6 },
      energy: .7,
      bars: 16,
      seed: `algo-${mode}`,
    });
    assert(score.phrases.at(-1).closed);
    for (const phrase of score.phrases) {
      for (const e of phrase.events.filter(ev => ev.part === 'melody')) {
        const offset = (e.start - phrase.start) % 4;
        if (Math.abs(offset) > 1e-9 && Math.abs(offset - 2) > 1e-9) continue;
        const bar = phrase.bars[Math.floor((e.start - phrase.start) / 4)];
        assert(bar.pitches.some(p => mod(p, 12) === mod(e.pitch, 12)), `${mode}: strong beat chord tone`);
      }
    }
  }
});

test('groove, dynamics and tuning apply at the next bar in live sessions', () => {
  const revisions = [];
  const session = new ComposerSession(
    { tempo: 60, genre: 'house', energy: .6, seed: 'live-bar' },
    { send: () => {} },
    { onRevise: (p, from) => revisions.push({ p, from }) },
    { clock: 'host' },
  );
  session.start();
  session.advance(1);
  session.update({ groove: 'polyrhythm', dynamics: .8, tuning: 'just' });
  assert.deepEqual(session.pending, { bar: true, phrase: false });
  session.advance(2.6);
  assert.equal(revisions.length, 1);
  assert.equal(session.applied.groove, 'polyrhythm');
  assert.equal(session.applied.dynamics, .8);
  assert.equal(session.applied.tuning, 'just');
  session.stop();
});

test('validation rejects invalid tuning, groove, dynamics, genreMix and algorithmMix', () => {
  assert.throws(() => normalizeOptions({ tuning: 'bogus' }));
  assert.throws(() => normalizeOptions({ groove: 'bogus' }));
  assert.throws(() => normalizeOptions({ dynamics: 2 }));
  assert.throws(() => normalizeOptions({ genreMix: { genre: 'bogus' } }));
  assert.throws(() => normalizeOptions({ genreMix: { genre: 'jazz', mode: 'bogus' } }));
  assert.throws(() => normalizeOptions({ algorithmMix: { secondary: 'bogus', mode: 'pipeline' } }));
  assert.throws(() => normalizeOptions({ algorithmMix: { secondary: 'life', mode: 'bogus' } }));
  // Defaults are omitted so existing normalized objects stay compact.
  const def = normalizeOptions({ tuning: 'equal', groove: 'auto', dynamics: 0 });
  assert.equal('tuning' in def, false);
  assert.equal('groove' in def, false);
  assert.equal('dynamics' in def, false);
});

test('EmotionFollower walks Plutchik wheel step-by-step and creates one bar per step', () => {
  // Opposite emotions (joy -> sadness): 4 steps around the wheel.
  const opp = plutchikPath({ emotion: 'joy', intensity: 2 / 3 }, { emotion: 'sadness', intensity: 2 / 3 });
  assert.deepEqual(opp.map(s => s.emotion), ['trust', 'fear', 'surprise', 'sadness']);
  assert.equal(opp.at(-1).arrival, true);

  // Counter-clockwise shorter path (joy -> anger): passes through anticipation.
  const ccw = plutchikPath({ emotion: 'joy', intensity: 2 / 3 }, { emotion: 'anger', intensity: 2 / 3 });
  assert.deepEqual(ccw.map(s => s.emotion), ['anticipation', 'anger']);

  // Radial intensity walk on the same petal (Serenity -> Ecstasy): passes through Joy.
  const radial = plutchikPath({ emotion: 'joy', intensity: 1 / 3 }, { emotion: 'joy', intensity: 1 });
  assert.deepEqual(radial.map(s => s.label), ['Joy', 'Ecstasy']);

  // Composing a phrase with the follower's path assigns each step to its own bar.
  const follower = new EmotionFollower({ emotion: 'joy', intensity: 2 / 3 });
  follower.guideTo({ emotion: 'sadness', intensity: 2 / 3 });
  const steps = follower.takeForBars(8);
  const phrase = composePhrase({ emotion: 'sadness', intensity: 2 / 3, seed: 'plutchik' }, 1, 32, { emotionPath: steps });
  assert.deepEqual(phrase.bars.slice(0, 4).map(b => b.emotion), ['trust', 'fear', 'surprise', 'sadness']);
  assert.deepEqual(phrase.bars.slice(4).map(b => b.emotion), ['sadness', 'sadness', 'sadness', 'sadness']);
  // Verify strong beats remain chord tones across the stepping-stone bars.
  for (const e of phrase.events.filter(ev => ev.part === 'melody')) {
    const offset = (e.start - phrase.start) % 4;
    if (Math.abs(offset) > 1e-9 && Math.abs(offset - 2) > 1e-9) continue;
    const bar = phrase.bars[Math.floor((e.start - phrase.start) / 4)];
    assert(bar.pitches.some(p => mod(p, 12) === mod(e.pitch, 12)), `bar ${bar.index} chord tone`);
  }

  // Live session follows the Plutchik path across phrase boundaries without jump-scaring.
  const phrases = [];
  const session = new ComposerSession(
    { emotion: 'joy', intensity: 2 / 3, tempo: 120, seed: 'live-follow' },
    { send: () => {} },
    { onPhrase: p => phrases.push(p) },
    { clock: 'host' },
  );
  session.start();
  session.update({ emotion: 'sadness', intensity: 2 / 3 });
  assert.deepEqual(session.plannedEmotionPath.map(s => s.emotion), ['trust', 'fear', 'surprise', 'sadness']);
  session.advance(32);
  assert.equal(phrases.length, 2);
  assert.deepEqual(phrases[1].bars.slice(0, 4).map(b => b.emotion), ['trust', 'fear', 'surprise', 'sadness']);
  assert.equal(session.currentEmotion.emotion, 'trust', 'bar 1 sounds Trust');
  session.advance(4);
  assert.equal(session.currentEmotion.emotion, 'fear', 'bar 2 sounds Fear');
  session.advance(4);
  assert.equal(session.currentEmotion.emotion, 'surprise', 'bar 3 sounds Surprise');
  session.advance(4);
  assert.equal(session.currentEmotion.emotion, 'sadness', 'bar 4 arrives at Sadness');
  session.stop();
});
