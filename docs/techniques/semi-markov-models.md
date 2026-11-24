# T015 — Semi-Markov and explicit-duration models

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Model state residence durations explicitly instead of letting transitions alone determine them.

## Proposed symbolic-music use

Represent section or phrase roles whose lengths matter musically, while a lower-level generator fills their material.

## Worked example or experiment setup

Choose a contrast duration from four or eight bars, then generate its phrase events without resampling its role every beat.

## Time, emotion and energy

Energy can influence allowed duration weights; emotion affects texture; ending requests override only at valid boundaries.

## Failure modes and practical limits

Too many duration options dilute form. Truncating a sampled duration can invalidate the model assumptions.

## Evaluation

Compare residence-length distributions and audible section clarity against a memoryless state-transition baseline.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Johnson and Willsky: explicit-duration hidden semi-Markov models](https://arxiv.org/abs/1203.1365)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
