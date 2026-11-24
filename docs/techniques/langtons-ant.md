# T040 — Langton-style ant and mobile automata

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

An agent reads a cell state, turns, changes that state and moves according to a fixed local rule.

## Proposed symbolic-music use

Use turns as interval directions and visited cells as rhythm or motif-memory locations.

## Worked example or experiment setup

For a specified two-colour rule, alternate left/right turning according to the current colour; the same seed and rule reproduce the path.

## Time, emotion and energy

Energy changes extraction rate or accents, not secretly simulation speed; emotion maps turns into allowed contour vocabulary.

## Failure modes and practical limits

Long transients and repeated highways can dominate output. Boundary wrapping materially changes future visits.

## Evaluation

Replay exact coordinates and compare turn-to-contour with location-to-pitch mappings under identical event counts.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Wolfram: elementary cellular automata](https://www.wolframscience.com/nks/p23--how-do-simple-programs-behave/)
- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
