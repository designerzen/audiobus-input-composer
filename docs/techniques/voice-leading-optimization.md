# T089 — Voice-leading and voicing optimization

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Select pitch placements for chord identities according to movement, range, spacing and voice relationships.

## Proposed symbolic-music use

Enumerate bounded voicing candidates and optimize across several chords, preserving a separate bass function.

## Worked example or experiment setup

C-E-G to C-E-A retains two common tones, unlike moving every voice to a high root-position A-minor chord.

## Time, emotion and energy

Energy alters spacing or role count; emotion changes eligible harmonies; time fixes chord-change positions.

## Failure modes and practical limits

Minimum movement can become static. Independent sorting can hide voice identity or crossing.

## Evaluation

Compare greedy and phrase-level paths and inspect individual voices as well as summed movement.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Tonal: music-theory implementation](https://github.com/tonaljs/tonal)
- [Herremans and Chew: MorpheuS](https://arxiv.org/abs/1812.04832)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
