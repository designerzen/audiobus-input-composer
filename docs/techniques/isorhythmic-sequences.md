# T084 — Isorhythmic pitch-duration pairing

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Repeat pitch and duration sequences independently so their pairings evolve.

## Proposed symbolic-music use

Use a short pitch cell with a differently sized duration cell to generate limited-material variation.

## Worked example or experiment setup

A three-pitch sequence and five-duration sequence repeat their pairings after fifteen events, not necessarily fifteen beats.

## Time, emotion and energy

Energy selects duration vocabulary; emotion changes pitch-cell realization; section time decides where to interrupt or resolve.

## Failure modes and practical limits

Event-count recurrence can cross bar boundaries. Changing durations changes the elapsed supercycle length.

## Evaluation

Calculate both pair recurrence and actual summed duration; compare phrase endings with and without conductor intervention.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Alonen and Forment: Ziffers](https://zenodo.org/records/7841945)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
