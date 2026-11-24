# T016 — Factorial and factored state models

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Represent several interacting latent or observed state components rather than one undifferentiated state label.

## Proposed symbolic-music use

Separate harmonic region, texture and rhythmic activity, then constrain incompatible joint combinations.

## Worked example or experiment setup

A stable harmony can coexist with an active texture; changing the texture state need not reset the harmonic route.

## Time, emotion and energy

Emotion steers selected factors; energy steers activity; section time arbitrates simultaneous transitions.

## Failure modes and practical limits

Independent factors can create musically incompatible combinations. The full joint state space can still grow combinatorially.

## Evaluation

Compare factor independence with constrained coupling and count rejected joint states alongside listening judgments.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Ghahramani and Jordan: Factorial Hidden Markov Models](https://papers.neurips.cc/paper/1144-factorial-hidden-markov-models.pdf)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
