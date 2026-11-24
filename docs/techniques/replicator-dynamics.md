# T065 — Replicator dynamics for strategy mixtures

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Change strategy proportions according to relative payoff in a population.

## Proposed symbolic-music use

Let repeat, answer and transform strategies compete for future phrase selection using explicit, inspectable payoffs.

## Worked example or experiment setup

A strategy gaining share is used more often, but one strategy is sampled per opportunity rather than all firing concurrently.

## Time, emotion and energy

Emotion changes payoff hypotheses; energy constrains realization; update proportions only after committed phrases.

## Failure modes and practical limits

Payoff design can erase diversity or generate cycles. A successful strategy can mean metric exploitation rather than musical quality.

## Evaluation

Track population shares, cycles and listener judgments; compare against a fixed authored strategy mixture.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
