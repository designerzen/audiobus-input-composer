# T003 — Poisson counts and event clouds

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

A Poisson variable models counts with a specified mean; an ideal homogeneous Poisson process has exponentially distributed waiting times.

## Proposed symbolic-music use

Choose the number of ornamental events in a musical window, then map positions and pitches through the current profile.

## Worked example or experiment setup

At mean three attacks per bar, zero attacks has probability exp(-3), about .0498. Capping the count at six changes the resulting distribution.

## Time, emotion and energy

Energy steers the mean; section envelopes steer its trajectory; emotion selects register and articulation independently.

## Failure modes and practical limits

Unrestricted clouds can cluster or overwhelm other parts. Quantizing or adding minimum spacing changes the ideal process.

## Evaluation

Measure uncapped and capped count distributions separately and inspect silence, clustering and foreground clarity.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: Poisson distribution](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.poisson.html)
- [SciPy: exponential distribution](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.expon.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
