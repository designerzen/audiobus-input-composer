# T035 — Generations automata and cellular memory

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Extend Life-like rules with additional decay or history states.

## Proposed symbolic-music use

Use cell age to choose articulation or whether a motif is repeated, answered or allowed to fade.

## Worked example or experiment setup

A trigger entering a four-state cycle can create one attack followed by two silent memory steps rather than three repeated attacks.

## Time, emotion and energy

Energy can select extraction density while decay duration stays stable; emotion changes the interpretation of age.

## Failure modes and practical limits

Rule notation may order survival and birth differently from B/S notation. More states do not automatically produce longer musical memory.

## Evaluation

Validate rule parsing and age transitions, then compare decay-as-silence with decay-as-sustained-note mappings.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: Generations and refractory states](https://golly.sourceforge.io/Help/Algorithms/Generations.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
