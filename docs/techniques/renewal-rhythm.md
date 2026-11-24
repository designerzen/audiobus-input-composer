# T004 — Renewal processes for rhythm

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Generate successive inter-event intervals from an interval distribution.

## Proposed symbolic-music use

Use a rhythmic alphabet such as half, one and two beats instead of assuming every event occupies the same grid slot.

## Worked example or experiment setup

Intervals [1,.5,.5,2] sum to a four-beat bar. A newly drawn interval that exceeds the phrase needs a declared trim, defer or rejection policy.

## Time, emotion and energy

Energy changes interval weights; emotion can alter long-short contrast; time supplies phrase boundaries.

## Failure modes and practical limits

Independent intervals can drift across bars. A final forced interval can create a conspicuous repair.

## Evaluation

Compare unconstrained renewal, conditional bar filling and authored rhythmic cells under identical budgets.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: exponential distribution](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.expon.html)
- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
