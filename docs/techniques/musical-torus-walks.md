# T108 — Musical torus and lattice walks

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use a periodic pitch lattice whose coordinates map to pitch classes through an explicit formula.

## Proposed symbolic-music use

Move a symbolic cursor through chromatic and fourths-related directions, mapping the path into a melody or harmonic route.

## Worked example or experiment setup

For p=(x+5*y) mod 12, moving right adds one semitone and moving up adds five. A 12-by-12 torus repeats each pitch class twelve times.

## Time, emotion and energy

Emotion selects path tendencies; energy affects rhythm and accents; time controls path sampling and phrase targets.

## Failure modes and practical limits

There are not 144 independent pitch classes. Visual closeness and pitch-class equality encode different relationships.

## Evaluation

Check seams, directional steps and repeated labels; compare lattice paths with direct interval sequences.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
