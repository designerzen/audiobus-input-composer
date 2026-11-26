import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALGORITHMS,
  GENRES,
  PERFORMANCE_CUES,
  ComposerSession,
  Transport,
  composePhrase,
  scoreToMidi,
} from '../dist/index.js';

const mod = (n, d) => ((n % d) + d) % d;
const barOf = (phrase, e) => phrase.bars[Math.floor((e.start - phrase.start) / 4)];

test('all six performance cues produce valid, non-overlapping, chord-anchored music across genres', () => {
  const genres = ['pop', 'rock', 'house', 'jazz', 'galant', 'ambient'];
  for (const cue of PERFORMANCE_CUES) {
    for (const genre of genres) {
      for (const fromBar of [0, 3]) {
        if (fromBar > 0 && !['crescendo', 'breakdown', 'resolve'].includes(cue)) continue;
        const algorithm = ALGORITHMS[(genres.indexOf(genre) + PERFORMANCE_CUES.indexOf(cue)) % ALGORITHMS.length];
        const swing = genre === 'pop' ? .45 : .15;
        const phrase = composePhrase({ genre, algorithm, emotion: 'joy', intensity: .8, energy: .5, swing, seed: `perf-${genre}` }, 0, 0, {
          cue,
          cueFromBar: fromBar,
          ...(cue === 'crescendo' ? { cueStartEnergy: .3 } : {}),
        });
        assert.equal(phrase.cue, cue);
        const ends = new Map();
        for (const e of phrase.events) {
          assert(e.start >= 0 && e.start < phrase.length, `${cue}/${genre}: event start in range`);
          assert(e.duration > 0 && e.start + e.duration <= phrase.length + 4 + 1e-9, `${cue}/${genre}: duration in range`);
          const address = `${e.channel}:${e.pitch}`;
          assert((ends.get(address) ?? 0) <= e.start + 1e-8, `${cue}/${genre}: overlapping ${address} at ${e.start}`);
          ends.set(address, e.start + e.duration);
        }
        for (const e of phrase.events.filter(ev => ev.part === 'melody')) {
          const offset = (e.start - phrase.start) % 4;
          if (Math.abs(offset) > 1e-9 && Math.abs(offset - 2) > 1e-9) continue;
          const bar = barOf(phrase, e);
          assert(bar.pitches.some(p => mod(p, 12) === mod(e.pitch, 12)), `${cue}/${genre}: strong-beat chord tone`);
        }
        const midi = scoreToMidi({ schemaVersion: 1, generatorVersion: '0.3.0', options: phrase.options, length: phrase.length, phrases: [phrase], events: phrase.events });
        assert.equal(new TextDecoder().decode(midi.slice(0, 4)), 'MThd');
      }
    }
  }
});

test('crescendo ramps energy, velocity and tension from the cued bar and clears if user overrides energy', () => {
  const phrase = composePhrase({ genre: 'pop', energy: .85, seed: 'cresc' }, 0, 0, { cue: 'crescendo', cueFromBar: 2, cueStartEnergy: .2 });
  assert.equal(phrase.bars.length, 8);
  assert(phrase.bars[7].targetTension > phrase.bars[2].targetTension, 'target tension rises across crescendo');
  const meanVel = bar => {
    const notes = phrase.events.filter(e => e.start >= bar * 4 && e.start < (bar + 1) * 4);
    return notes.reduce((s, e) => s + e.velocity, 0) / notes.length;
  };
  assert(meanVel(6) > meanVel(2), 'velocity swells across the crescendo');
  assert(phrase.events.some(e => e.part === 'percussion' && e.pitch === 38 && e.start >= 24 && e.reason.includes('Crescendo')));

  const revisions = [];
  const session = new ComposerSession({ tempo: 60, energy: .25, seed: 'sess-cresc' }, { send: () => {} }, { onRevise: (p, from) => revisions.push({ p, from }) }, { clock: 'host' });
  session.start();
  session.advance(4);
  session.cue('crescendo');
  assert.equal(session.nextBarTarget.bar, 2);
  session.advance(3.6);
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].from, 8);
  assert.equal(session.activeCue, 'crescendo');
  assert(session.options.energy >= .55, 'crescendo lifts target energy');

  session.update({ swing: .2 });
  session.advance(4);
  assert.equal(session.activeCue, 'crescendo', 'swing adjustment keeps crescendo active');

  session.update({ energy: .15 });
  session.advance(4);
  assert.equal(session.activeCue, undefined, 'explicit energy slider overrides crescendo');
  session.stop();
});

test('breakdown strips drums (and bass in drumless genres) without mutating selected ensemble', () => {
  const revisions = [];
  const session = new ComposerSession({ genre: 'pop', tempo: 60, energy: .85, seed: 'break' }, { send: () => {} }, { onRevise: (p, from) => revisions.push({ p, from }) }, { clock: 'host' });
  session.start();
  session.advance(4);
  session.cue('breakdown');
  session.advance(3.6);
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].from, 8);
  assert.equal(revisions[0].p.events.filter(e => e.start >= 8 && e.part === 'percussion').length, 0);
  assert.deepEqual(session.options.parts, ['melody', 'bass', 'harmony', 'percussion'], 'selected ensemble stays intact');
  session.stop();

  const ambient = composePhrase({ genre: 'ambient', energy: .75, seed: 'amb-break' }, 0, 0, { cue: 'breakdown', cueFromBar: 2 });
  assert.equal(ambient.events.filter(e => e.start >= 8 && e.part === 'bass').length, 0, 'drumless genres also strip bass in breakdown');
  assert(ambient.events.filter(e => e.start >= 8 && e.part === 'harmony').length > 0, 'harmony re-articulates at breakdown bar');
});

test('bridge and drop cut cleanly at the next bar on host and internal clocks into their target sections', t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const phrases = [], sent = [];
  const host = new ComposerSession({ genre: 'rock', tempo: 60, energy: .4, seed: 'rock-cut' }, { send: b => sent.push([...b]) }, { onPhrase: p => phrases.push(p) }, { clock: 'host' });
  host.start();
  assert.equal(phrases[0].section, 'Verse');
  host.advance(9);
  host.cue('bridge');
  assert.equal(host.nextBarTarget.bar, 3);
  host.advance(2.6);
  assert.equal(phrases.length, 1, 'waits for the exact bar line');
  host.advance(0.45);
  assert.equal(phrases.length, 2, 'cuts at beat 12 into the bridge');
  assert.equal(phrases[1].section, 'Bridge');
  assert.equal(phrases[1].cue, 'bridge');

  // Drop restores full ensemble even from a stripped House Intro and triggers crash + lifted energy.
  const housePhrases = [];
  const house = new ComposerSession({ genre: 'house', tempo: 120, energy: .25, seed: 'house-drop' }, { send: () => {} }, { onPhrase: p => housePhrases.push(p) }, { clock: 'host' });
  house.start();
  assert.equal(housePhrases[0].section, 'Intro');
  assert.equal(housePhrases[0].events.filter(e => e.part === 'melody').length, 0);
  house.advance(3.2);
  house.cue('drop');
  house.advance(0.4);
  house.advance(0.45);
  assert.equal(housePhrases.length, 2);
  assert.equal(housePhrases[1].section, 'Drop');
  assert(housePhrases[1].events.some(e => e.part === 'melody'));
  assert(housePhrases[1].events.some(e => e.part === 'percussion' && e.pitch === 49 && e.start === 0), 'downbeat crash on drop');
  assert(house.options.energy >= .78);

  // Internal clock also cuts cleanly without timer drift or stuck notes.
  let now = 0;
  const internalPhrases = [], internalSent = [];
  const internal = new ComposerSession({ genre: 'jazz', tempo: 120, seed: 'jazz-int' }, { send: b => internalSent.push([...b]) }, { onPhrase: p => internalPhrases.push(p) }, { now: () => now });
  internal.start();
  internal.cue('bridge');
  for (let i = 0; i < 22; i++) { now += 100; t.mock.timers.tick(100); }
  assert.equal(internalPhrases.length, 2);
  assert.equal(internalPhrases[1].section, 'B');
  internal.stop();
  host.stop();
  house.stop();
  for (const stream of [sent, internalSent]) {
    const active = new Set();
    for (const [s, p] of stream) {
      const key = `${s & 15}:${p}`;
      if ((s & 240) === 144) active.add(key);
      else if ((s & 240) === 128) active.delete(key);
    }
    assert.equal(active.size, 0, 'all owned notes released on stop');
  }
});

test('key-change shifts tonic up two semitones on the next bar and keeps subsequent phrases in the new key', () => {
  const phrases = [];
  const session = new ComposerSession({ genre: 'pop', root: 0, tempo: 60, seed: 'key-lift' }, { send: () => {} }, { onPhrase: p => phrases.push(p) }, { clock: 'host' });
  session.start();
  session.advance(4);
  session.cue('key-change');
  session.advance(3.6);
  session.advance(0.45);
  assert.equal(phrases.length, 2);
  assert.equal(phrases[1].root, 2);
  assert.equal(session.options.root, 2);
  session.advance(32);
  assert.equal(phrases.length, 3);
  assert.equal(phrases[2].root, 2, 'new key persists into subsequent phrases');
  session.stop();
});

test('resolve ends at the next bar on a tonic cadence, stopping when finishing or continuing otherwise', () => {
  let stopped;
  const phrases = [], revisions = [];
  const finishing = new ComposerSession({ genre: 'house', root: 5, tempo: 60, seed: 'res-fin' }, { send: () => {} }, {
    onPhrase: p => phrases.push(p),
    onRevise: (p, from) => revisions.push({ p, from }),
    onStop: r => { stopped = r; },
  }, { clock: 'host' });
  finishing.start();
  finishing.finish();
  finishing.advance(5);
  finishing.cue('resolve');
  finishing.advance(2.6);
  assert.equal(revisions.length, 1);
  assert.equal(revisions[0].from, 8);
  assert.equal(revisions[0].p.length, 12);
  assert.equal(revisions[0].p.closed, true);
  assert.equal(revisions[0].p.bars.at(-1).function, 'cadence');
  assert.equal(mod(revisions[0].p.bars.at(-1).degree, 7), 0);
  finishing.advance(4.5);
  assert.equal(stopped, 'finished');
  assert.equal(finishing.running, false);

  const contPhrases = [];
  const continuing = new ComposerSession({ genre: 'pop', tempo: 60, seed: 'res-cont' }, { send: () => {} }, { onPhrase: p => contPhrases.push(p) }, { clock: 'host' });
  continuing.start();
  continuing.advance(3.2);
  continuing.cue('resolve');
  continuing.advance(0.4);
  continuing.advance(4.5);
  assert.equal(contPhrases.length, 2, 'continues into a fresh phrase when not finishing');
  assert.equal(contPhrases[1].length, 32);
  continuing.stop();
});

test('arming, switching, cancelling, pre-start cueing, seeking and pad carryover behave cleanly', t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const session = new ComposerSession({ genre: 'ambient', tempo: 60, seed: 'amb-cut' }, { send: () => {} }, {}, { clock: 'host' });
  assert.throws(() => session.cue('nope'), RangeError);
  assert.deepEqual(session.pending, { bar: false, phrase: false }, 'pending omits cue when none armed');

  session.cue('drop');
  assert.deepEqual(session.pending, { bar: false, phrase: false, cue: 'drop' });
  session.clearCue();
  assert.equal(session.queuedCue, undefined);

  session.cue('bridge');
  session.start();
  assert.equal(session.activeCue, 'bridge', 'pre-start cue shapes opening phrase');
  assert.equal(session.queuedCue, undefined);
  session.stop();
  assert.equal(session.activeCue, undefined);

  // Seek cancels a pending half-beat cut cleanly on internal clock.
  let now = 0;
  const phrases = [];
  const seekSess = new ComposerSession({ genre: 'pop', tempo: 60, seed: 'seek-cut' }, { send: () => {} }, { onPhrase: p => phrases.push(p) }, { now: () => now, maxGapMs: 5000 });
  seekSess.start();
  seekSess.cue('bridge');
  for (let i = 0; i < 36; i++) { now += 100; t.mock.timers.tick(100); }
  assert.equal(seekSess.queuedCue, 'bridge');
  seekSess.seek(0);
  now += 500; t.mock.timers.tick(500);
  assert.equal(phrases.length, 1, 'seeking back cancels the pending bar cut');
  seekSess.stop();

  // Transport.replaceFrom carries active pad note-offs across an early cut without stuck notes.
  const sent = [];
  let chained = 0;
  const note = (id, start, duration, pitch) => ({ id, start, duration, pitch, velocity: .7, channel: 3, part: 'harmony', motifId: 'm', reason: 'pad' });
  let transport;
  transport = new Transport({ send: b => sent.push([...b]) }, {
    clock: 'host',
    onEnd: () => { chained++; transport.chain({ events: [note('next', 0, 1, 64)], length: 8, options: { tempo: 60 } }); },
  });
  transport.start({ events: [note('pad', 0, 7, 60)], length: 32, options: { tempo: 60 } });
  transport.advance(3.6);
  transport.replaceFrom(4, [], 4);
  transport.advance(0.5);
  assert.equal(chained, 1);
  assert.equal(transport.activeCount, 2, 'pad keeps ringing into the chained score');
  transport.advance(3.1);
  assert.deepEqual(sent.filter(b => b[1] === 60).map(b => b[0]), [146, 130], 'carried pad releases at beat 7 - 4 = 3');
  transport.stop();
});
