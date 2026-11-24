# T085 — Canon and delayed imitation

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Derive another voice by a specified time delay and pitch or contour transformation.

## Proposed symbolic-music use

Compose a source phrase with its answer in mind, retaining explicit provenance between voices.

## Worked example or experiment setup

A theme delayed two beats and transposed a diatonic fifth becomes an answer only if range and current harmony permit it.

## Time, emotion and energy

Energy controls active imitation voices; emotion chooses transformations; delay stays in declared beat units.

## Failure modes and practical limits

A delayed line can collide with a later chord or obscure the source. Heavy repair should be labelled free imitation.

## Evaluation

Check exact derivation before repair and evaluate voice independence and intelligibility after repair.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Tonal: music-theory implementation](https://github.com/tonaljs/tonal)
- [Alonen and Forment: Ziffers](https://zenodo.org/records/7841945)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
