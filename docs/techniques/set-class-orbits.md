# T102 — Transposition/inversion set-class orbits

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Group collections under declared transposition and optional inversion equivalence.

## Proposed symbolic-music use

Browse related harmonic materials without confusing a class representative with its particular voiced realization.

## Worked example or experiment setup

Compute the minimum bitmask across twelve transpositions and their inversions. That numeric representative is not a Forte catalogue number.

## Time, emotion and energy

Emotion selects candidates within and between classes; energy stays separate; harmonic time controls how a representative is realized.

## Failure modes and practical limits

Equivalent collections can have different musical functions, roots and spellings. Collapsing them loses important context.

## Evaluation

Enumerate class counts with and without inversion, including the empty set as a separately declared case.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)
- [Ian Ring: pitch-set representation and analysis](https://ianring.com/musictheory/scales/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
