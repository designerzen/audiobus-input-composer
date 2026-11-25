import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALGORITHMS, FAMILIES, GENRES, GENRE_PROFILES, ComposerSession, MidiFollower, Transport, compose, composePhrase, estimateKey, normalizeOptions, scoreMetrics, scoreToMidi } from '../dist/index.js';

const mod = (n, d) => ((n % d) + d) % d;
const sample = (genre, extra = {}) => FAMILIES.map((emotion, i) => scoreMetrics(compose({ genre, emotion, seed: `m${i}`, bars: 32, energy: .6, algorithm: ALGORITHMS[i % ALGORITHMS.length], ...extra })));
const average = (metrics, key) => metrics.reduce((a, m) => a + m[key], 0) / metrics.length;

test('every genre stays within singable, harmonically anchored bounds', () => {
  for (const genre of GENRES) for (const energy of [.15, .6, .95]) {
    for (const m of sample(genre, { energy })) {
      assert.equal(m.chordTones, 1, `${genre}: strong beats are chord tones`);
      assert(m.maxLeap <= 12, `${genre}/${energy}: leap of ${m.maxLeap} semitones`);
      assert(m.range <= 24, `${genre}/${energy}: range ${m.range}`);
      assert(m.pitchEntropy > .5 && m.pitchEntropy < .92, `${genre}/${energy}: pitch entropy ${m.pitchEntropy}`);
    }
  }
});

test('themes recur: returning sections restate material', () => {
  for (const genre of ['pop', 'galant', 'jazz', 'bossa', 'rock']) {
    assert(average(sample(genre), 'repetition') >= .12, `${genre} repeats too little to be remembered`);
  }
});

test('functional idioms voice-lead without many parallel fifths or octaves', () => {
  for (const genre of ['pop', 'galant', 'jazz', 'bossa']) assert(average(sample(genre), 'parallels') <= .1, genre);
});

test('dance idioms are more syncopated than galant and pop', () => {
  const sync = Object.fromEntries(['house', 'techno', 'rock', 'galant', 'pop'].map(g => [g, average(sample(g), 'syncopation')]));
  assert(sync.house > sync.rock && sync.techno > sync.rock, JSON.stringify(sync));
  assert(sync.rock > sync.galant && sync.rock > sync.pop, JSON.stringify(sync));
});

test('each genre has its own timing feel; machine idioms stay on the grid', () => {
  for (const genre of ['house', 'techno', 'trap', 'minimal', 'chiptune']) {
    const m = sample(genre)[0];
    for (const part of ['melody', 'bass', 'harmony']) assert.equal(m.looseness[part] ?? 0, 0, `${genre} ${part} is tight`);
  }
  const boomBap = compose({ genre: 'boom-bap', energy: .6, bars: 16 }).events;
  const push = note => { const hits = boomBap.filter(e => e.pitch === note && e.part === 'percussion'); return hits.reduce((a, e) => a + (e.timing ?? 0), 0) / hits.length; };
  assert(push(38) > .025, 'boom-bap snare sits behind the beat');
  assert(push(38) > push(36) + .02, 'the snare is later than the kick');
  const jazz = compose({ genre: 'jazz', bars: 16 }).events.filter(e => e.part === 'melody');
  assert(jazz.reduce((a, e) => a + (e.timing ?? 0), 0) / jazz.length > .015, 'jazz melody is laid back');
  for (const genre of GENRES) for (const e of compose({ genre, bars: 8 }).events) assert(Math.abs(e.timing ?? 0) <= .08 + 1e-9);
});

test('pitched parts accent strong beats', () => {
  const comp = compose({ genre: 'galant', energy: .9, bars: 16 }).events.filter(e => e.part === 'harmony');
  const at = test => { const xs = comp.filter(e => test(mod(e.start, 4))); return xs.reduce((a, e) => a + e.velocity, 0) / xs.length; };
  assert(at(p => p < 1e-6) > at(p => Math.abs(p % 1 - .25) < 1e-6) + .03, 'downbeats are louder than sixteenths');
});

test('the transport and MIDI export perform the feel; scores stay notated', () => {
  const sent = [];
  const note = { id: 'late', start: 1, duration: 1, pitch: 60, velocity: .7, channel: 1, part: 'melody', motifId: 't', reason: 't', timing: .05 };
  const early = { ...note, id: 'early', start: 0, pitch: 62, timing: -.03 };
  const transport = new Transport({ send: b => sent.push([...b]) }, { clock: 'host' });
  transport.start({ events: [note, early], length: 4, options: { tempo: 60 } });
  assert(sent.some(b => b[0] === 144 && b[1] === 62), 'an early note at the start is clamped to the start, not lost');
  transport.advance(1.02);
  assert(!sent.some(b => b[0] === 144 && b[1] === 60), 'a laid-back note waits for its push');
  transport.advance(.04);
  assert(sent.some(b => b[0] === 144 && b[1] === 60));
  transport.stop();

  const score = compose({ genre: 'boom-bap', bars: 8 });
  assert.notDeepEqual(scoreToMidi(score), scoreToMidi(score, { feel: false }));
  assert(score.events.some(e => e.timing), 'feel is stored beside the notated start');
});

test('a section key lift is prepared by the new key’s dominant', () => {
  const score = compose({ genre: 'rock', bars: 32, root: 0, seed: 'lift' });
  const [, , bridge, last] = score.phrases;
  assert.equal(last.root, 2, 'the last chorus is lifted a tone');
  assert.equal(bridge.cadence, 'modulating');
  assert.equal(bridge.closed, false);
  assert.equal(bridge.bars[7].function, 'modulation');
  assert(bridge.bars[7].pitches.some(p => mod(p, 12) === 9) && bridge.bars[7].pitches.some(p => mod(p, 12) === 1), 'A7 leads to D');
  assert.equal(bridge.bars[7].roman, 'V7→D');
  assert(last.closed, 'the final phrase still closes');
  // The same key throughout needs no modulation.
  assert(compose({ genre: 'pop', bars: 32 }).phrases.every(p => p.cadence !== 'modulating'));
});

test('a live key change is prepared in the last bar of the current phrase', () => {
  const revisions = [], phrases = [];
  const session = new ComposerSession({ tempo: 60, seed: 'rekey', root: 0 }, { send: () => {} }, { onRevise: (p, from) => revisions.push({ p, from }), onPhrase: p => phrases.push(p) }, { clock: 'host' });
  session.start();
  session.advance(10);
  session.update({ root: 7 });
  session.advance(17.6);
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].from, 28);
  assert.equal(revisions[0].p.cadence, 'modulating');
  assert(revisions[0].p.bars[7].pitches.some(p => mod(p, 12) === 6), 'D7 (with F♯) leads to G');
  session.advance(4.5);
  assert.equal(phrases.at(-1).root, 7);
  session.stop();
});

test('a played motif can replace the seeded theme', () => {
  assert.throws(() => normalizeOptions({ motif: [0] }));
  assert.throws(() => normalizeOptions({ motif: [0, 9] }));
  assert.equal('motif' in normalizeOptions({}), false, 'absent unless given');
  const seeded = composePhrase({ seed: 'theme' }, 0), played = composePhrase({ seed: 'theme', motif: [4, 3, 2, 1] }, 0);
  assert.notDeepEqual(played.events.filter(e => e.part === 'melody').map(e => e.pitch), seeded.events.filter(e => e.part === 'melody').map(e => e.pitch));
});

test('the MIDI follower finds the key, follows clock and captures a line', () => {
  const c = estimateKey([5, 0, 3, 0, 4, 2, 0, 5, 0, 2, 0, 1]);
  assert.deepEqual([c.root, c.mode], [0, 'major']);
  let now = 0, key; let beats = 0, started = false;
  const follower = new MidiFollower({ onKey: k => { key = k; }, onClock: b => { beats += b; }, onStart: () => { started = true; } }, { now: () => now });
  const play = pitch => { follower.receive([144, pitch, 100]); now += 300; follower.receive([128, pitch, 0]); now += 50; };
  // A natural minor line around A.
  for (const p of [57, 60, 64, 62, 60, 59, 57, 64, 65, 64, 62, 60, 59, 57, 52, 57]) play(p);
  assert.equal(key?.root, 9); assert.equal(key?.mode, 'minor');
  assert.deepEqual(follower.motif(9, 'minor', 4), [1, 0, 4, 0], 'B A E A as degrees of A minor');
  follower.receive([250]); for (let i = 0; i < 48; i++) follower.receive([248]);
  assert(started); assert(Math.abs(beats - 2) < 1e-9);
});
