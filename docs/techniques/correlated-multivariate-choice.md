# T008 — Correlated multivariate sampling

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Sample related variables jointly rather than choosing every dimension independently.

## Proposed symbolic-music use

Couple gate, accent and leap preferences through a valid covariance structure, then project into allowable musical ranges.

## Worked example or experiment setup

A profile might correlate larger leaps with longer gates but keep attack count independent, producing room for a leap to register.

## Time, emotion and energy

Energy can alter variance; emotion selects a tested coupling profile; change covariance at phrase boundaries.

## Failure modes and practical limits

A non-positive-semidefinite covariance is invalid. Clipping and quantization can substantially change the intended correlations.

## Evaluation

Inspect realized score correlations and compare them with the latent sampled values, not just the requested matrix.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
