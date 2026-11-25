import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALGORITHMS, FAMILIES, MODES, compose, composePhrase, normalizeOptions, pitchMask, intervalVector, quantize, lifeStep, trainMarkov, euclidean, evolveMotif, random, voiceLead, degreePitch, describeChord, transformMotif, scoreToMidi, Transport, ComposerSession, audioBusOutput } from '../dist/index.js';

test('composition is reproducible, query-independent and develops a persistent theme', () => {
  const score = compose({ seed: 'test', bars: 16 });
  assert.deepEqual(compose({ seed: 'test', bars: 16 }), score);
  compose({ seed: 'unrelated' });
  assert.deepEqual(composePhrase({ seed: 'test' }, 1), score.phrases[1]);
  assert.notDeepEqual(score.events, compose({ seed: 'another' }).events);
  assert.equal(new Set(score.events.map(e => e.motifId)).size, 1);
  assert.deepEqual(score.phrases.map(p => p.section), ['Establish', 'Develop']);
  assert.equal(score.phrases[0].bars[3].function, 'half cadence');
  // Antecedent–consequent: the first phrase may stay open, the second always closes on the tonic.
  assert(['cadence', 'half cadence', 'deceptive cadence'].includes(score.phrases[0].bars[7].function));
  assert.equal(score.phrases[1].bars[7].function, 'cadence');
  assert(score.phrases[1].closed);
});

test('every engine and emotion respects score bounds, cadence, channels and address lifetimes', () => {
  for (const algorithm of ALGORITHMS) for (const emotion of FAMILIES) for (const energy of [0, .5, 1]) {
    const root = (ALGORITHMS.indexOf(algorithm) + FAMILIES.indexOf(emotion)) % 12;
    const score = compose({ algorithm, emotion, energy, root, bars: 8, swing: .45 });
    const ids = new Set(), addressEnds = new Map();
    for (const e of score.events) {
      assert(!ids.has(e.id)); ids.add(e.id);
      assert(Number.isInteger(e.pitch) && e.pitch >= 0 && e.pitch <= 127);
      assert(e.start >= 0 && e.duration > 0 && e.start + e.duration <= score.length);
      assert(e.velocity > 0 && e.velocity <= 1);
      assert.equal(e.channel, { melody: 1, bass: 2, harmony: 3, percussion: 10 }[e.part]);
      const address = `${e.channel}:${e.pitch}`;
      assert((addressEnds.get(address) ?? 0) <= e.start + 1e-8, `${algorithm}: overlapping ${address}`);
      addressEnds.set(address, e.start + e.duration);
    }
    const last = score.events.filter(e => e.part === 'melody').at(-1);
    assert.equal(last.pitch % 12, root);
    assert.equal(last.start, 28);
  }
});

test('energy controls activity independently from the selected emotion', () => {
  for (const algorithm of ALGORITHMS) {
    const low = compose({ algorithm, energy: 0, emotion: 'sadness' });
    const high = compose({ algorithm, energy: 1, emotion: 'sadness' });
    assert(high.events.length > low.events.length);
    assert.equal(high.options.emotion, low.options.emotion);
  }
  assert.equal(compose({ emotion: 'sadness', mode: 'major' }).phrases[0].mode, 'major');
  assert(compose({ parts: [] }).events.length === 0);
});

test('reject invalid controls instead of silently generating malformed music', () => {
  for (const patch of [{ energy: NaN }, { intensity: 2 }, { tempo: 0 }, { root: 12 }, { algorithm: 'missing' }, { bars: 9 }, { bars: 10000 }, { seed: '' }, { parts: ['melody', 'melody'] }, { swing: Infinity }]) assert.throws(() => normalizeOptions(patch), RangeError);
  const a = normalizeOptions(), b = normalizeOptions(); a.parts.pop(); assert.equal(b.parts.length, 4);
});

test('pitch-set tools, quantization and voice leading have explicit musical semantics', () => {
  const major = pitchMask([0, 2, 4, 5, 7, 9, 11]);
  assert.equal(major, 2741);
  assert.deepEqual(intervalVector(pitchMask([0, 4, 7])), [0, 0, 1, 1, 1, 0]);
  assert.equal(quantize(61, major), 60);
  assert.equal(quantize(61, major, 'up'), 62);
  assert.equal(quantize(61, 0), undefined);
  assert.equal(degreePitch(-1, 0, 'major'), 59);
  const v = voiceLead([67, 71, 74], [60, 64, 67]);
  assert(v[0] <= v[1] && v[1] <= v[2]);
  assert.deepEqual(v.map(p => p % 12).sort((a, b) => a - b), [2, 7, 11]);
});

test('Life is synchronous; Markov smoothing and Euclidean spacing match the documented mechanisms', () => {
  const board = Array.from({ length: 5 }, () => Array(5).fill(false));
  board[2][1] = board[2][2] = board[2][3] = true;
  const vertical = lifeStep(board);
  assert.deepEqual(vertical.map((r, y) => r.flatMap((v, x) => v ? [[x, y]] : [])).flat(), [[2, 1], [2, 2], [2, 3]]);
  assert.deepEqual(lifeStep(vertical), board);
  assert.deepEqual(trainMarkov([0, 2, 1, 2, 0], 3)[2], [3 / 7, 3 / 7, 1 / 7]);
  for (let steps = 1; steps <= 32; steps++) for (let hits = 0; hits <= steps; hits++) {
    const pattern = euclidean(hits, steps, 3); assert.equal(pattern.reduce((a, b) => a + b), hits);
    const onsets = pattern.flatMap((v, i) => v ? [i] : []);
    if (hits > 1) { const gaps = onsets.map((v, i) => ((onsets[(i + 1) % hits] - v + steps - 1) % steps) + 1); assert(Math.max(...gaps) - Math.min(...gaps) <= 1); }
  }
  const seed = [0, 2, 1, 4, 0, 2, 1, 4], original = [...seed];
  const evolved = evolveMotif(seed, random('ga'));
  assert.deepEqual(seed, original); assert.equal(evolved[0], seed[0]); assert.equal(evolved.at(-1), seed.at(-1));
});

function note(id, start, duration, pitch = 60) {
  return { id, start, duration, pitch, velocity: .7, channel: 1, part: 'melody', motifId: 'fixture', reason: 'test' };
}
test('transport releases owned notes and superseded gates cannot silence a retrigger', () => {
  let now = 0; const sent = [], transport = new Transport({ send: b => sent.push([...b]) }, { now: () => now, maxGapMs: 2000 });
  transport.start({ events: [note('old', 0, 1), note('new', .5, 1.5)], length: 3, options: { tempo: 60 } }, false);
  assert.deepEqual(sent, [[144, 60, 89]]);
  now = 500; transport.tick(); assert.deepEqual(sent.slice(-2), [[128, 60, 0], [144, 60, 89]]);
  now = 1000; transport.tick(); assert.equal(transport.activeCount, 1); assert.equal(sent.length, 3);
  transport.stop(); assert.equal(transport.activeCount, 0); assert.deepEqual(sent.at(-1), [128, 60, 0]);
  now = 5000; transport.tick(); assert.equal(sent.length, 4);
});

test('seeking releases sounding notes and plays on from the new beat, backwards or forwards', () => {
  let now = 0; const sent = [], transport = new Transport({ send: b => sent.push([...b]) }, { now: () => now, maxGapMs: 5000 });
  transport.start({ events: [note('a', 0, 2), note('b', 2, 1, 64), note('c', 3, 1, 67)], length: 4, options: { tempo: 60 } }, false);
  now = 2500; transport.tick(); assert.deepEqual(sent.slice(-1), [[144, 64, 89]]);
  transport.seek(0); assert.deepEqual(sent.slice(-2), [[128, 64, 0], [144, 60, 89]], 'b is released and a starts again');
  assert(Math.abs(transport.beat) < 1e-9); assert.equal(transport.activeCount, 1);
  transport.seek(3); assert.deepEqual(sent.slice(-2), [[128, 60, 0], [144, 67, 89]]);
  const hosted = new Transport({ send: () => {} }, { clock: 'host' });
  hosted.start({ events: [note('a', 0, 1)], length: 4, options: { tempo: 60 } }); hosted.seek(2);
  assert.equal(hosted.beat, 0, 'a host clock owns its position');
});

test('suspension and output failure stop delivery without catch-up attacks', () => {
  let now = 0; const sent = []; let reason, error;
  const transport = new Transport({ send: b => sent.push([...b]) }, { now: () => now, onStop: r => { reason = r; } });
  transport.start({ events: [note('a', 0, 4), note('b', 1, 1, 64)], length: 8, options: { tempo: 60 } }, false);
  now = 2000; transport.tick(); assert.equal(reason, 'suspended'); assert.equal(sent.filter(b => b[0] === 144).length, 1); assert.equal(transport.activeCount, 0);
  const broken = new Transport({ send: () => { throw Error('disconnected'); } }, { onError: e => { error = e; } });
  broken.start({ events: [note('a', 0, 1)], length: 2, options: { tempo: 60 } }, false);
  assert(!broken.running); assert.equal(error.message, 'disconnected');
});

test('AudioBus adapter sends due bytes immediately without invented timestamp arguments', () => {
  const calls = []; audioBusOutput({ sendMidi(...args) { calls.push(args); } }).send([144, 60, 100]);
  assert.deepEqual(calls, [[[144, 60, 100]]]);
});

test('host observers can stop synchronously on an attack without leaving an owned note', () => {
  const sent = []; let transport;
  transport = new Transport({ send: b => sent.push([...b]) }, { onEvent: r => { if ((r.bytes[0] & 240) === 144) transport.stop(); } });
  transport.start({ events: [note('a', 0, 1), note('b', 0, 1, 64)], length: 2, options: { tempo: 60 } }, false);
  assert(!transport.running); assert.equal(transport.activeCount, 0);
  assert.deepEqual(sent, [[144, 60, 89], [128, 60, 0]]);
});

test('session applies controls only at boundaries and finish stops after the cadence', t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  let now = 0, stopped; const phrases = [], sink = { send: () => {} };
  const session = new ComposerSession({ tempo: 240, emotion: 'joy' }, sink, { onPhrase: p => phrases.push(p), onStop: r => { stopped = r; } }, { now: () => now });
  session.start(); session.update({ emotion: 'sadness', energy: 0 });
  assert.equal(session.applied.emotion, 'joy');
  for (let i = 0; i < 80; i++) { now += 100; t.mock.timers.tick(100); }
  assert.equal(phrases.length, 2); assert.equal(session.applied.emotion, 'sadness');
  session.finish();
  for (let i = 0; i < 80; i++) { now += 100; t.mock.timers.tick(100); }
  assert.equal(stopped, 'finished'); assert(!session.running); assert.equal(phrases.length, 2);
  const recording = session.recording; recording.phrases.pop(); assert.equal(session.recording.phrases.length, 2);
});

test('MIDI export is a parseable track with balanced gates and an explicit tempo', () => {
  const score = compose({ algorithm: 'markov', bars: 8 }), bytes = scoreToMidi(score);
  const view = new DataView(bytes.buffer); assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), 'MThd');
  assert.equal(view.getUint16(12), 480); assert.equal(new TextDecoder().decode(bytes.slice(14, 18)), 'MTrk');
  assert.equal(view.getUint32(18), bytes.length - 22);
  let cursor = 22, tick = 0; const active = new Set(); let tempo = false, end = false;
  const vlq = () => { let result = 0, b; do { b = bytes[cursor++]; result = (result << 7) | (b & 127); } while (b & 128); return result; };
  while (cursor < bytes.length) {
    tick += vlq(); const status = bytes[cursor++];
    if (status === 255) { const type = bytes[cursor++], length = vlq(); if (type === 81) tempo = true; if (type === 47) end = true; cursor += length; }
    else { const pitch = bytes[cursor++]; cursor++; const address = `${status & 15}:${pitch}`; if ((status & 240) === 144) { assert(!active.has(address)); active.add(address); } else { assert(active.has(address)); active.delete(address); } }
  }
  assert(tempo && end); assert.equal(active.size, 0); assert.equal(tick, score.length * 480);
});

test('a host clock drives phrases from beats, never from wall time, and chains without drift', () => {
  const sent = [], phrases = [];
  const session = new ComposerSession({ seed: 'host', emotion: 'joy', tempo: 60 }, { send: bytes => sent.push([...bytes]) }, { onPhrase: p => phrases.push(p) }, { clock: 'host' });
  session.start();
  assert.equal(session.hosted, true);
  assert.equal(phrases.length, 1);
  session.advance(32 + 0.25);
  assert.equal(phrases.length, 2, 'second phrase begins once 32 beats have elapsed');
  assert.ok(Math.abs(session.beat - 0.25) < 1e-6, 'overshoot carries into the next phrase');
  session.stop();
  assert.ok(sent.filter(b => (b[0] & 240) === 144).length <= sent.filter(b => (b[0] & 240) === 128).length, 'stop releases every owned note');
  const before = sent.length;
  session.advance(4);
  assert.equal(sent.length, before, 'a stopped session ignores the host clock');
});

test('all modal colours, 4-voice seventh voice leading, chord analysis and motif transforms work cleanly', () => {
  for (const mode of MODES) {
    const score = compose({ mode, emotion: 'surprise', intensity: 0.9, energy: 0.85, bars: 8 });
    assert(score.events.length > 0);
    assert.equal(score.phrases[0].bars.length, 8);
    assert(score.phrases[0].bars.every(b => typeof b.roman === 'string' && b.roman.length > 0));
  }
  const seventh = voiceLead([67, 71, 74, 77], [60, 64, 67]);
  assert.equal(seventh.length, 4);
  assert(seventh[0] <= seventh[1] && seventh[1] <= seventh[2] && seventh[2] <= seventh[3]);
  assert.deepEqual(seventh.map(p => p % 12).sort((a, b) => a - b), [2, 5, 7, 11]);
  assert.deepEqual(describeChord([60, 64, 67, 71], 'C', 0, 'major'), { symbol: 'Cmaj7', roman: 'Imaj7' });
  assert.deepEqual(describeChord([62, 65, 69, 72], 'D', 1, 'major'), { symbol: 'Dm7', roman: 'ii7' });
  assert.deepEqual(transformMotif([0, 2, 4, 1], 'retrograde'), [1, 4, 2, 0]);
  assert.deepEqual(transformMotif([0, 2, 4, 1], 'sequence-up'), [1, 3, 5, 2]);
  assert.deepEqual(transformMotif([2, 4, 3, 0], 'invert'), [2, 0, 1, 4]);
});

test('emotions produce distinct harmonic progressions and MIDI export embeds section/chord markers', () => {
  const joyChords = compose({ emotion: 'joy', bars: 8 }).phrases[0].bars.map(b => b.degree);
  const fearChords = compose({ emotion: 'fear', bars: 8 }).phrases[0].bars.map(b => b.degree);
  assert.notDeepEqual(joyChords, fearChords);
  const bytes = scoreToMidi(compose({ emotion: 'anger', intensity: 0.85, bars: 8 }));
  const text = new TextDecoder().decode(bytes);
  assert(text.includes('AudioBus Composer'));
  assert(text.includes('Establish'));
});
