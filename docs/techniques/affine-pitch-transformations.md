# T105 — Affine pitch-class transformations

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Map pitch class p to a*p+b modulo twelve, with invertibility depending on the multiplier.

## Proposed symbolic-music use

Explore related interval structures through reflection, transposition and coprime multiplication.

## Worked example or experiment setup

Multipliers 5 and 7 permute all twelve classes; multiplying by 2 can merge classes and reduce cardinality.

## Time, emotion and energy

Emotion selects permitted transforms; energy does not require a multiplier change; apply at a phrase boundary.

## Failure modes and practical limits

An invertible mathematical mapping need not preserve tonal function or recognizable melody.

## Evaluation

Verify cardinality for coprime multipliers and explicitly test collisions for non-coprime ones.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
