# T005 — Bounded random walks

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Update a state by sampled increments, with explicit boundary handling.

## Proposed symbolic-music use

Walk through scale degrees or voicing indices. Reflection keeps motion in a tessitura while preserving a sense of local movement.

## Worked example or experiment setup

In degrees 0..6, a proposed step from 6 to 7 reflects to 5 under a reflecting policy; clamping instead stays at 6.

## Time, emotion and energy

Energy may expand the step distribution; emotion can bias direction; a phrase target can constrain the final steps.

## Failure modes and practical limits

Clamping accumulates visits at boundaries; wrapping creates leaps; unconstrained walks meander without endings.

## Evaluation

Compare boundary occupation, leap distributions and cadence arrival for reflecting, clamped and wrapped versions.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
