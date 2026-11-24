# T027 — Novelty search

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Select behaviourally unusual candidates relative to neighbours or an archive rather than only a target-performance score.

## Proposed symbolic-music use

Define descriptors such as accent position, contour shape and rest distribution for phrase exploration.

## Worked example or experiment setup

Two phrases with different note names but identical contour and rhythm can be close in the chosen descriptor space.

## Time, emotion and energy

Use novelty as an optional exploration setting; emotion keeps profile eligibility; energy stays an independent activity constraint.

## Failure modes and practical limits

Novelty can reward noise, extreme density or trivial transposition if descriptors are poorly chosen.

## Evaluation

Compare descriptor novelty with listener-perceived difference and enforce minimum musical validity before archive admission.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Lehman: novelty-search dissertation](https://stars.library.ucf.edu/etd/2214/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
