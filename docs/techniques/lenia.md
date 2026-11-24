# T038 — Lenia and continuous cellular automata

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Evolve continuous cell values through neighbourhood kernels and growth functions.

## Proposed symbolic-music use

Extract region mass, centroid and movement as slow symbolic register or texture controls, rather than emitting a note from every pixel.

## Worked example or experiment setup

Quantize a moving centroid to a degree centre once per bar; use total mass to weight a capped set of optional attacks.

## Time, emotion and energy

Time separates simulation step from musical sampling; energy changes extraction limits; emotion chooses the profile mapper.

## Failure modes and practical limits

Threshold chatter and numerical instability can dominate. A continuous visual organism is not evidence of expressive musical behaviour.

## Evaluation

Check bounded finite states and sampling-rate sensitivity; compare regional features with raw threshold crossings.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Chan: Lenia project](https://github.com/Chakazul/Lenia)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
