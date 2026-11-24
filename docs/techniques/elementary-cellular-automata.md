# T032 — Elementary cellular automata: Rules 30, 90 and 110

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Update a binary line using the three-cell neighbourhood and one of 256 local rule tables.

## Proposed symbolic-music use

Read each generation as a rhythmic mask or use one column over time as a part trigger. Map rule outputs through a tonal vocabulary.

## Worked example or experiment setup

Rule 90 uses left XOR right. A single central live cell produces two live neighbours in its next generation.

## Time, emotion and energy

Time controls generation rate; energy selects a capped number of live slots; emotion can choose mapping and approved rule families.

## Failure modes and practical limits

Chaotic appearance is not musical direction. Boundary choice and sampling stride can dominate the audible result.

## Evaluation

Check the exact rule table, seed and edge policy; compare several rules with the same symbolic mapping.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Wolfram: elementary cellular automata](https://www.wolframscience.com/nks/p23--how-do-simple-programs-behave/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
