# T101 — Pitch-set bitmasks and exhaustive collection spaces

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Represent twelve pitch-class memberships in a twelve-bit integer with an explicit bit convention.

## Proposed symbolic-music use

Use complete set membership as a pitch vocabulary, including silent and sparse sets rather than only named scales.

## Worked example or experiment setup

With bit 0 representing C relative to the root, C-major is mask 2741 and the chromatic collection is 4095. Mask 0 is silence.

## Time, emotion and energy

Emotion chooses authored collection preferences; energy controls rhythm independently; change membership at planned boundaries.

## Failure modes and practical limits

A collection is not a cultural practice or a chord progression. Different bit orders can silently change every result.

## Evaluation

Round-trip all 4096 masks and compare named anchors with expected pitch classes.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Ian Ring: pitch-set representation and analysis](https://ianring.com/musictheory/scales/)
- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
