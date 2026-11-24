# T026 — Pareto search with NSGA-II

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Maintain candidates trading off multiple objectives through nondominated selection and diversity management.

## Proposed symbolic-music use

Keep separate objectives for motif identity, target density and voice-leading instead of hiding their trade-offs in one score.

## Worked example or experiment setup

A sparse recognizable phrase and a busier less-recognizable phrase can both remain nondominated; choose with the current musical goal.

## Time, emotion and energy

Energy selects a desired region of the frontier; emotion adjusts criteria; time limits when a candidate may be committed.

## Failure modes and practical limits

Bad objectives produce a misleading frontier. Many objectives can leave almost everything nondominated.

## Evaluation

Inspect representative frontier candidates and validate criteria with musicians rather than reporting frontier size as quality.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [pymoo: NSGA-II](https://pymoo.org/algorithms/moo/nsga2.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
