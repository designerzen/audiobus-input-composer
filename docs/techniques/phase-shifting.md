# T083 — Discrete and gradual phase shifting

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Change the relative temporal offset between related repeating material.

## Proposed symbolic-music use

Keep a motif recognizable while a second realization moves through new attack relationships.

## Worked example or experiment setup

Delay one four-beat motif by half a beat while preserving the master pulse; distinguish this discrete shift from a temporary tempo difference.

## Time, emotion and energy

Energy controls entrances and accents; emotion selects interval treatment; phase movement occurs over an explicit duration.

## Failure modes and practical limits

Crossings can overcrowd the arrangement. Tempo-based drift needs a reunification and note-release policy.

## Evaluation

Compare fixed-offset, stepped and gradual shifts at matched material and assess recognizable return.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [TidalCycles: pattern structure](https://tidalcycles.org/docs/reference/pattern_structure/)
- [Brockmann and Strogatz: coupled phase oscillators](https://www.complexity-explorables.org/explorables/ride-my-kuramotocycle/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
