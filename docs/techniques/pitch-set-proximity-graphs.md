# T107 — Pitch-set proximity and mutation graphs

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Connect collections through declared small membership changes or transformation relationships.

## Proposed symbolic-music use

Plan harmonic colour paths by adding, removing or moving one pitch class at a time.

## Worked example or experiment setup

A Hamming-distance-one edge toggles one membership bit; preserve essential theme anchors while searching toward a target set.

## Time, emotion and energy

Emotion selects target vocabularies; energy controls part activity; harmonic time determines when a set change becomes active.

## Failure modes and practical limits

Small bit distance is not necessarily small perceptual distance. Changing a tonic-defining pitch can be structurally large.

## Evaluation

Compare mathematical distance, common tones and listener judgments of continuity with explicit voicing control.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)
- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
