# T025 — Covariance-matrix adaptation evolution strategy

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Adapt a search distribution over continuous parameters, including relationships between parameter directions.

## Proposed symbolic-music use

Tune interacting symbolic preferences such as leap size, articulation and rhythmic contrast as a profile-level search.

## Worked example or experiment setup

A candidate is a five-parameter profile evaluated across several fixed motifs; receiver volume is excluded from the musical objective.

## Time, emotion and energy

Emotion and energy define test contexts; iterations run away from playback; freeze accepted parameters for a session revision.

## Failure modes and practical limits

Noisy listener scores and hard quantization can frustrate search. Continuous parameter efficiency does not imply better composition.

## Evaluation

Repeat evaluations across seeds and compare with differential evolution using equal decoding budgets.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [CMA-ES: author implementation](https://github.com/CMA-ES/pycma)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
