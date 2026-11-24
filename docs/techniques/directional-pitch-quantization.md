# T110 — Directional pitch-set quantization

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Map an incoming or proposed pitch to an allowed pitch under nearest, upward, downward or membership-filter rules.

## Proposed symbolic-music use

Use quantization as a constrained decoder for stochastic/agent proposals, preserving original release addresses.

## Worked example or experiment setup

Between C4 and D4, C-sharp4 maps to C4 under nearest-with-downward-tie policy; upward maps to D4. Empty membership suppresses attacks.

## Time, emotion and energy

Emotion selects the vocabulary; energy controls event selection; edits affect future attacks, while active notes keep their recorded targets.

## Failure modes and practical limits

Nearest snapping can collapse several source notes onto one pitch and erase ornaments or independent voices.

## Evaluation

Test full MIDI boundaries, ties, collisions and releases after a collection edit, then inspect preserved melodic contour.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
