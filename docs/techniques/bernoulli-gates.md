# T002 — Bernoulli gates and stochastic masks

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Each eligible slot has a binary success probability.

## Proposed symbolic-music use

Apply gates to optional attacks while preserving motif anchors. Keep the mask keyed by bar, part and slot so overlapping queries agree.

## Worked example or experiment setup

An eight-slot pattern with p=.25 has two expected retained attacks, but a particular bar can contain none. Reserve the first anchor separately.

## Time, emotion and energy

Energy controls eligible-attack probability; emotion may favour particular metric positions without changing total expectation.

## Failure modes and practical limits

Expectation is not a hard density limit. Independent gates can erase the theme or create unbalanced clusters.

## Evaluation

Check anchor survival and aggregate caps; compare independent gates with exact-count selection at matched mean density.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
