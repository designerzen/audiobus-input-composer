# T018 — Time-inhomogeneous Markov chains

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Allow the transition matrix to vary with a declared time or control variable.

## Proposed symbolic-music use

Move from stable to exploratory harmonic preferences across a section without replacing the state vocabulary.

## Worked example or experiment setup

If matrices A and B are row-stochastic, (1-w)A+wB remains row-stochastic for 0<=w<=1. That does not preserve every stationary property.

## Time, emotion and energy

Use smoothed wheel intensity for w; keep energy in rhythm decisions; commit matrix changes at an explicit boundary.

## Failure modes and practical limits

Fast changes can erase learned local habits. Interpolating matrices is not proof of perceptually linear emotion change.

## Evaluation

Verify nonnegative normalized rows and compare the requested blend with actual realized harmonic behaviour.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IDyOM: variable-order and multiple-viewpoint prediction](https://www.marcus-pearce.com/idyom/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
