# T106 — Interval-class vectors and cyclic autocorrelation

Family: **Pitch-set geometry and harmonic spaces**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Count pitch-pair relationships independently of a particular voicing.

## Proposed symbolic-music use

Use interval content as one descriptor when retrieving or contrasting collections, alongside root and functional information.

## Worked example or experiment setup

C-E-G has interval-class counts [0,0,1,1,1,0]. A tritone contributes one unordered pair, not two.

## Time, emotion and energy

Emotion mapping may hypothesize interval preferences; energy remains rhythmic; section time constrains retrieval and transition.

## Failure modes and practical limits

Different collections can share interval content. An interval vector does not measure tension, pleasantness or cultural meaning directly.

## Evaluation

Check that vector entries sum to n*(n-1)/2 and compare equal-vector collections without claiming they are identical.

## AudioBus integration

This family assumes twelve-tone equal temperament and octave equivalence. Preserve root, spelling, role and voicing outside the collection representation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: local pitch-set research](../../../harmoneasy/research/scales-and-musical-torus.md)
- [Ian Ring: pitch-set representation and analysis](https://ianring.com/musictheory/scales/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
