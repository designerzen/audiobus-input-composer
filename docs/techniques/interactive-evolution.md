# T029 — Interactive evolutionary selection

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use explicit human judgments to help select or rank candidates during an evolutionary process.

## Proposed symbolic-music use

Present a small, comparable set of motif variants and let the performer keep, reject or pin material.

## Worked example or experiment setup

Audition four equal-length phrases under the same renderer; keep two parents and generate a limited next batch.

## Time, emotion and energy

The wheel specifies desired expression; energy is held fixed during a comparison; feedback changes future candidates only.

## Failure modes and practical limits

Listening fatigue, order effects and renderer preference can dominate judgments. Frequent interruption undermines autonomous flow.

## Evaluation

Measure useful choices per audition, fatigue and later preference stability; offer an offline curation mode.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [DEAP: evolutionary operators](https://deap.readthedocs.io/en/master/api/tools.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
