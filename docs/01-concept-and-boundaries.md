# 01 — A composer that produces decisions

## Product definition

An AudioBus Input usually supplies incoming activity. This one supplies its own: an autonomous musical performer with explicit rules, a memory, a time model and controllable expressive intentions. A person can choose a musical world, establish an identity, steer emotion and energy, and let the system develop music without manually entering every note.

Its output should remain inspectable and editable. A note is a choice of pitch, onset, duration, intensity and role, situated in a phrase and harmony. A rest is also a choice. Store enough context to explain why a note occurred and to replay what actually happened.

Useful output vocabulary:

- Notes and note releases; drum strikes as symbolic instrument events.
- Chord and key annotations, phrase boundaries and section transitions.
- Dynamics, articulation and supported controller changes.
- Tempo and transport intentions, subject to an explicitly chosen clock authority.
- Provenance: motif origin, transformation, selected rule, seed and control snapshot.

The internal representation should carry more musical meaning than MIDI. MIDI is one delivery format, not the composition model. A MIDI pitch alone loses degree spelling, harmonic function and whether a note is an accented suspension or an accidental mistake.

## A hierarchy of autonomy

At the smallest scale, select or transform a note. At the beat scale, distribute attacks and accents. At the bar scale, coordinate parts. At the phrase scale, set up and answer expectations. At the section scale, contrast and return. At the session scale, preserve identity while allowing development.

An engine that randomizes pitches within a scale addresses only the first scale. It may avoid obvious wrong notes yet fail to articulate phrases, leave space or remember a theme. Explicit planning is therefore a musical requirement, not merely software organization. The transfer from [MusicLayout](https://arxiv.org/abs/2608.09035v2) is the inspectable planning principle; this proposal does not reproduce its audio model.

## Design principles

1. **Make restrictions productive.** A narrow register and a small motif often create a clearer identity than an unrestricted pitch set.
2. **Separate identity from current expression.** Energy may increase while the original rhythmic signature remains recognizable.
3. **Coordinate voices.** Bass, melody, chords and percussion share a timeline and harmonic plan.
4. **Distinguish randomness from surprise.** Unpredictability has musical meaning only relative to established expectations.
5. **Let controls operate at appropriate boundaries.** Articulation can change on the next event; a key change may wait for a cadence.
6. **Treat silence as arrangement.** Energy can rise through anticipation and selective entrances rather than constant saturation.
7. **Keep the performed result.** Re-running a generator later is insufficient as an archival record.

## Deliberate limits

This research concerns symbolic and procedural composition. Sound design, oscillators, codecs, sample generation, mastering and audio model deployment belong downstream. It does discuss velocity and instrument role because they affect performance, but it does not assume that identical MIDI will sound identical on every instrument.

Start with one clearly named tonal practice and extend through explicit musical profiles. Western functional harmony is useful and well supported in existing code, but it is not a universal definition of music. Modal, drone-based, cyclic, nonfunctional and microtonal music need different constraints. A Euclidean onset sequence does not by itself reproduce a cultural performance practice; see [05](05-rhythm-and-time.md).

## Success condition

A convincing first version can develop a small authored motif for several minutes, respond perceptibly to energy changes, preserve a coherent harmonic direction, stop cleanly, and reproduce its resolved score. It should be possible to point to any unusual event and explain the musical decision that produced it.
