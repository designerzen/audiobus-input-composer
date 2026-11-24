# T007 — Coloured-noise control trajectories

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Correlate random values across time through filtering or a prescribed spectral construction.

## Proposed symbolic-music use

Use slow correlated fluctuations for density or register instead of unrelated per-note random values. The output remains a symbolic control curve.

## Worked example or experiment setup

Smooth [0,1,0,1] before mapping to an ornament chance; hold the resulting value for a bar rather than jittering each attack.

## Time, emotion and energy

Energy sets range, emotion sets baseline and correlation time; keep the sampling interval fixed or accounted for.

## Failure modes and practical limits

A generic low-pass filter is not automatically exact pink noise. Spectral slope does not establish musical coherence.

## Evaluation

Compare independent, smoothed and explicitly specified pink-noise controls using the same mean and variance.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: filtering sequences](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.lfilter.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
