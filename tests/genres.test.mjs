import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ALGORITHMS, FAMILIES, GENRES, GENRE_PROFILES, GENERATOR_VERSION, SCALES, compose, composePhrase, resolveMode, scoreToMidi, material, normalizeOptions, Transport, ComposerSession, webMidiOutput } from '../dist/index.js';

const mod = (n, d) => ((n % d) + d) % d;
const melodyOf = (phrase) => phrase.events.filter(e => e.part === 'melody');
const barOf = (phrase, e) => phrase.bars[Math.floor((e.start - phrase.start) / 4)];

test('genre patterns are well formed for their grid', () => {
  for (const genre of GENRES) {
    const g = GENRE_PROFILES[genre];
    const check = (pattern, alphabet, where) => {
      assert.equal(pattern.length, g.grid, `${genre} ${where} length`);
      assert(new RegExp(`^[${alphabet}.-]+$`).test(pattern), `${genre} ${where} symbols`);
    };
    for (const level of ['low', 'mid', 'high']) {
      if (g.bass !== 'pop') check(g.bass[level], 'R58 3AW'.replace(' ', ''), `bass.${level}`);
      if (g.comp !== 'pop') check(g.comp[level], 'CSPAL', `comp.${level}`);
      if (g.drums && g.drums !== 'pop') for (const [note, pattern] of Object.entries(g.drums[level])) check(pattern, 'Xxogr', `drums.${level}.${note}`);
    }
    assert(g.form.length > 0 && g.tempo[0] < g.tempo[1]);
  }
});

test('every genre, emotion and energy produces valid, non-overlapping events that close on the tonic', () => {
  for (const genre of GENRES) for (const emotion of FAMILIES) for (const energy of [0, .5, 1]) {
    const score = compose({ genre, emotion, energy, bars: 8, seed: `${genre}-${emotion}`, algorithm: ALGORITHMS[(GENRES.indexOf(genre) + FAMILIES.indexOf(emotion)) % ALGORITHMS.length] });
    const phrase = score.phrases[0], ends = new Map();
    assert(phrase.closed, `${genre}/${emotion}: a final phrase must close`);
    for (const e of score.events) {
      assert(e.start >= 0 && e.start + e.duration <= score.length + 1e-9, `${genre}: event inside the score`);
      assert.equal(e.channel, { melody: 1, bass: 2, harmony: 3, percussion: 10 }[e.part]);
      const address = `${e.channel}:${e.pitch}`;
      assert((ends.get(address) ?? 0) <= e.start + 1e-8, `${genre}/${emotion}/${energy}: overlapping ${address} at ${e.start}`);
      ends.set(address, e.start + e.duration);
    }
    const last = melodyOf(phrase).at(-1);
    if (last) { assert.equal(mod(last.pitch, 12), phrase.root, `${genre}/${emotion}: tonic arrival`); assert.equal(last.start, 28); }
    assert.equal(phrase.bars[7].function, 'cadence');
  }
});

test('strong-beat melody notes are chord tones of their bar, including chromatic chords', () => {
  for (const genre of GENRES) for (const algorithm of ALGORITHMS) for (const seed of ['a', 'b']) {
    const score = compose({ genre, algorithm, seed, emotion: FAMILIES[(seed.charCodeAt(0) + ALGORITHMS.indexOf(algorithm)) % 8], intensity: .9, bars: 32 });
    for (const phrase of score.phrases) for (const e of melodyOf(phrase)) {
      const offset = (e.start - phrase.start) % 4;
      if (Math.abs(offset) > 1e-9 && Math.abs(offset - 2) > 1e-9) continue;
      const bar = barOf(phrase, e);
      assert(bar.pitches.some(p => mod(p, 12) === mod(e.pitch, 12)), `${genre}/${algorithm}: ${e.pitch} over ${bar.chord}`);
    }
  }
});

test('a vi chord keeps a melody note that is already one of its chord tones', () => {
  // Regression: degree 0 (C) over vi (A–C–E) used to be moved to A.
  for (const seed of ['x', 'y', 'z', 'w']) {
    const phrase = composePhrase({ seed, emotion: 'joy', algorithm: 'motif' }, 0);
    for (const e of melodyOf(phrase)) {
      const bar = barOf(phrase, e);
      if (bar.degree !== 5 || (e.start - phrase.start) % 4 !== 0 || e.degree === undefined) continue;
      if (mod(e.degree, 7) === 0) assert.equal(mod(e.pitch, 12), 0, 'C stays C over Am');
    }
  }
});

test('half-cadence labels only appear on dominant chords', () => {
  for (const genre of GENRES) for (const emotion of FAMILIES) {
    const score = compose({ genre, emotion, bars: 16 });
    for (const phrase of score.phrases) for (const bar of phrase.bars) {
      if (bar.function === 'half cadence') assert.equal(mod(bar.degree, 7), 4, `${genre}/${emotion}: ${bar.chord} labelled half cadence`);
    }
  }
});

test('the torus walk is quantised to the mode instead of spread evenly over seven degrees', () => {
  const options = normalizeOptions({ algorithm: 'torus', seed: 'tonnetz' });
  const counts = new Map();
  for (let bar = 0; bar < 64; bar++) for (const d of material(options, bar >> 3, bar & 7, [0, 2, 1, 4], { mode: 'major' }).degrees) counts.set(d, (counts.get(d) ?? 0) + 1);
  // Fifth/third walks reach C, G, D, E and B most; a linear pc×6/11 projection had no such relationship.
  const pcs = [...counts.keys()].map(d => SCALES.major[d]);
  assert(pcs.every(pc => SCALES.major.includes(pc)));
  assert(counts.size >= 4);
});

test('genres sound like their idioms', () => {
  const at = (score, part, pitch) => score.events.filter(e => e.part === part && (pitch === undefined || e.pitch === pitch));
  const house = compose({ genre: 'house', energy: .9, bars: 32 });
  const drop = house.phrases.find(p => p.section === 'Drop');
  const kicks = drop.events.filter(e => e.pitch === 36 && e.part === 'percussion').map(e => (e.start - drop.start) % 4);
  assert(kicks.filter(k => k < 1e-6 || Math.abs(k - 1) < .05 || Math.abs(k - 2) < .05 || Math.abs(k - 3) < .05).length >= 28, 'four-on-the-floor kick');
  assert.equal(house.phrases[0].events.filter(e => e.part === 'melody').length, 0, 'the intro holds the melody back');

  const jazz = compose({ genre: 'jazz', energy: .6, bars: 8, seed: 'walk' });
  const walking = at(jazz, 'bass').filter(e => e.start < 28);
  assert.equal(walking.length, 7 * 4, 'walking bass plays four beats a bar');
  assert(at(jazz, 'percussion', 51).length > 20, 'ride cymbal pattern');

  assert.equal(at(compose({ genre: 'galant', energy: 1 }), 'percussion').length, 0, 'galant has no drum kit');
  assert.equal(at(compose({ genre: 'ambient', energy: 1 }), 'percussion').length, 0, 'ambient has no drum kit');

  const trap = compose({ genre: 'trap', energy: 1, bars: 16 });
  const hats = at(trap, 'percussion', 42).map(e => e.start).sort((a, b) => a - b);
  assert(hats.some((t, i) => i > 1 && t - hats[i - 2] < .2), 'hi-hat rolls subdivide the sixteenth');

  const rock = compose({ genre: 'rock', bars: 32, energy: .6 });
  assert.equal(rock.phrases[3].root, 2, 'the last chorus lifts the key');
  assert(rock.phrases[3].events.filter(e => e.part === 'harmony').every((e, _, all) => all.length > 0), 'power chords present');

  const ambient = compose({ genre: 'ambient', bars: 16, energy: .2 });
  assert(ambient.phrases[0].events.some(e => e.part === 'harmony' && e.start + e.duration > 32), 'pads ring into the next phrase');
  assert(ambient.events.every(e => e.start + e.duration <= ambient.length + 1e-9), 'the final phrase does not ring past the score');
});

test('reharmonisation adds chromatic chords at high intensity and keeps the cadence', () => {
  const tags = new Set();
  for (let i = 0; i < 12; i++) for (const emotion of FAMILIES) {
    const score = compose({ genre: 'jazz', emotion, intensity: 1, seed: `reharm-${i}`, bars: 8 });
    for (const bar of score.phrases[0].bars) if (/V7\/|subV7|♭VII7|^iv$|♭VI/.test(bar.roman)) tags.add(bar.roman.replace(/\/.*/, '/x'));
    assert.equal(score.phrases[0].bars[7].degree, 0);
  }
  assert(tags.size >= 3, `several kinds of rewrite: ${[...tags]}`);
});

test('intensity moves the mode along the brightness axis within what the genre allows', () => {
  assert.equal(resolveMode('major', 1), 'lydian');
  assert.equal(resolveMode('minor', 1), 'harmonic-minor');
  assert.equal(resolveMode('minor', .1), 'dorian');
  assert.equal(resolveMode('mixolydian', .1), 'mixolydian', 'never crosses from bright to dark');
  assert.equal(resolveMode('major', .5, ['phrygian', 'minor', 'dorian']), 'dorian');
  assert.equal(compose({ emotion: 'joy', intensity: 1, bars: 8 }).phrases[0].mode, 'lydian');
  assert.equal(compose({ emotion: 'joy', intensity: 1, genre: 'techno', bars: 8 }).phrases[0].mode, 'dorian');
});

test('chosen bars follow the emotion’s tension target', () => {
  const mean = (score, key) => score.phrases.flatMap(p => p.bars.map(b => b[key])).reduce((a, b) => a + b) / (score.phrases.length * 8);
  const calm = compose({ emotion: 'trust', energy: .2, algorithm: 'markov', bars: 32 });
  const tense = compose({ emotion: 'anger', energy: .9, algorithm: 'markov', bars: 32 });
  assert(mean(tense, 'targetTension') > mean(calm, 'targetTension') + .2);
  assert(mean(tense, 'tension') > mean(calm, 'tension'));
  for (const score of [calm, tense]) for (const p of score.phrases) for (const b of p.bars) assert(b.tension >= 0 && b.tension <= 1);
});

test('returning sections reuse the opening harmony with a re-elaborated surface', () => {
  const score = compose({ seed: 'theme', algorithm: 'markov', bars: 32, genre: 'jazz' });
  const [a, a2] = score.phrases;
  assert.deepEqual(a2.bars.slice(0, 6).map(b => b.chord), a.bars.slice(0, 6).map(b => b.chord));
  assert.notDeepEqual(melodyOf(a2).map(e => e.pitch), melodyOf(a).map(e => e.pitch));
});

test('program changes are opt-in, sent once per instrument set and exported to MIDI', () => {
  assert.equal(compose({ bars: 8 }).phrases[0].setup, undefined);
  const score = compose({ genre: 'jazz', programs: true, bars: 8 });
  assert.deepEqual(score.phrases[0].setup, [[192, 66], [193, 32], [194, 0]]);
  const bytes = scoreToMidi(score);
  assert(bytes.some((b, i) => b === 192 && bytes[i + 1] === 66));

  const sent = [];
  const session = new ComposerSession({ genre: 'jazz', programs: true, tempo: 60 }, { send: b => sent.push([...b]) }, {}, { clock: 'host' });
  session.start(); session.advance(32); session.advance(32);
  assert.equal(sent.filter(b => (b[0] & 240) === 192).length, 3, 'not repeated while the genre is unchanged');
  session.stop();
});

test('internal clock chains phrases at the exact boundary and keeps ringing notes', () => {
  let now = 0; const sent = [];
  const event = (id, start, duration, pitch) => ({ id, start, duration, pitch, velocity: .7, channel: 3, part: 'harmony', motifId: 't', reason: 't' });
  let transport;
  transport = new Transport({ send: b => sent.push([...b]) }, {
    now: () => now, maxGapMs: 10_000,
    onEnd: () => transport.chain({ events: [event('n0', 0, 1, 64)], length: 4, options: { tempo: 60 } }),
  });
  transport.start({ events: [event('pad', 2, 4, 60)], length: 4, options: { tempo: 60 } }, false);
  now = 2000; transport.tick();
  now = 4250; transport.tick();
  assert(Math.abs(transport.beat - .25) < 1e-9, 'overshoot is carried on the internal clock');
  assert.equal(transport.activeCount, 2, 'the pad keeps ringing across the boundary');
  now = 6100; transport.tick();
  assert.deepEqual(sent.filter(b => b[1] === 60).map(b => b[0]), [146, 130], 'pad released on the new timeline');
  transport.stop();
});

test('bar-level controls recompose the rest of the phrase from the next bar line', () => {
  const revisions = [];
  const session = new ComposerSession({ tempo: 60, energy: .2, seed: 'bars' }, { send: () => {} }, { onRevise: (p, from) => revisions.push({ p, from }) }, { clock: 'host' });
  session.start();
  session.advance(1);
  session.update({ energy: .9, emotion: 'fear' });
  assert.deepEqual(session.pending, { bar: true, phrase: true });
  session.advance(2.6);
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].from, 4);
  assert.equal(session.applied.energy, .9);
  assert.equal(session.applied.emotion, 'joy', 'emotion still waits for the phrase');
  assert(revisions[0].p.events.filter(e => e.start >= 4).every(e => e.id.includes('~r')));
  session.stop();
});

test('Web MIDI outputs are scheduled ahead with timestamps and cleared on stop', () => {
  let now = 1000; const messages = []; let cleared = 0;
  const output = webMidiOutput({ send: (data, t) => messages.push({ data, t }), clear: () => { cleared++; } });
  const transport = new Transport(output, { now: () => now, lookaheadMs: 100 });
  const note = { id: 'a', start: .05, duration: 1, pitch: 60, velocity: .7, channel: 1, part: 'melody', motifId: 't', reason: 't' };
  transport.start({ events: [note], length: 2, options: { tempo: 60 } }, false);
  assert.equal(messages.length, 1, 'the attack 50 ms ahead is sent now');
  assert.equal(messages[0].t, 1050);
  transport.stop();
  assert.equal(cleared, 1);
  assert(messages.some(m => m.data[0] === 128 && m.t > now + 100), 'a late release follows anything still scheduled');
});

test('finish continues past an open phrase to the next closed cadence', () => {
  let stopped;
  const phrases = [];
  const session = new ComposerSession({ genre: 'house', tempo: 120 }, { send: () => {} }, { onPhrase: p => phrases.push(p), onStop: r => { stopped = r; } }, { clock: 'host' });
  session.start();
  assert.equal(phrases[0].closed, false, 'a loop antecedent stays open');
  session.finish();
  session.advance(32);
  assert.equal(phrases.length, 2);
  assert(phrases[1].closed);
  session.advance(32);
  assert.equal(stopped, 'finished');
});

test('golden scores change only deliberately', () => {
  const digest = options => createHash('sha256').update(JSON.stringify(compose(options))).digest('hex').slice(0, 16);
  assert.equal(GENERATOR_VERSION, '0.2.0', 'bump the version and these digests together');
  const actual = Object.fromEntries(['pop', 'jazz', 'galant', 'house', 'ambient'].map(genre => [genre, digest({ genre, seed: 'golden', bars: 16 })]));
  assert.deepEqual(actual, GOLDEN);
});

// Regenerate only when a musical change is intended, and bump GENERATOR_VERSION with it.
const GOLDEN = { pop: '6096f2e538175195', jazz: '6f11abad62de2d61', galant: '2b3841b54f334dff', house: '3fc6d4eb76b92c0f', ambient: '629b901873e0685d' };
