# T103 — Modal rebasing and collection rotation

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Rebase a selected collection on one of its included pitches while retaining explicit tonic treatment.

## Proposed symbolic-music use

Create related pitch vocabularies for contrast or return, preserving degree-aware motif information where possible.

## Worked example or experiment setup

Rebase C-major on D to obtain offsets [0,2,3,5,7,9,10]. A mode-zero convention can instead preserve an unrooted custom mask unchanged.

## Time, emotion and energy

Emotion biases allowed modes as a profile hypothesis; energy controls arrangement; announce effective harmonic boundaries.

## Failure modes and practical limits

Rotation and transposition are different operations. A scale’s interval pattern alone does not reproduce a modal performance practice.

## Evaluation

Verify cardinality, membership and rebasing identities, then test motif preservation after mode changes.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)
- [Ian Ring: pitch-set representation and analysis](https://ianring.com/musictheory/scales/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
