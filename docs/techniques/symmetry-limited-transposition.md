# T109 — Symmetry and limited transposition

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Identify transformations that preserve a collection, producing repeated equivalent images.

## Proposed symbolic-music use

Use symmetric collections as stable colour fields or as contrasting material with fewer distinct transpositions.

## Worked example or experiment setup

The whole-tone set [0,2,4,6,8,10] is invariant under transposition by two semitones and has two distinct transpositions.

## Time, emotion and energy

Emotion chooses a tested colour palette; energy changes realization; section time determines how symmetry is broken or restored.

## Failure modes and practical limits

Symmetry can reduce tonal orientation, but does not imply a particular feeling. Different voicings can obscure the same invariance.

## Evaluation

Enumerate stabilizing transforms and distinct images, then listen to rooted and unrooted realizations.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Ian Ring: pitch-set representation and analysis](https://ianring.com/musictheory/scales/)
- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
