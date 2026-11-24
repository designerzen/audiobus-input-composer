# T024 — Differential evolution of composer parameters

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use population-vector differences to propose continuous parameter candidates.

## Proposed symbolic-music use

Search profile parameters such as contour bias, gate ratio and register spread; let a separate decoder realize notes.

## Worked example or experiment setup

Candidate vectors describe three bounded preferences, not fractional MIDI notes. Decode each with identical evaluation seeds.

## Time, emotion and energy

Energy/emotion supply evaluation scenarios; search completes offline or for a future section, never in a timing callback.

## Failure modes and practical limits

Discrete decoding creates plateaus and abrupt jumps. Optimizing one seed overfits incidental choices.

## Evaluation

Evaluate across training and held-out control trajectories and compare with a coarse parameter grid.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [pymoo: differential evolution](https://pymoo.org/algorithms/soo/de.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
