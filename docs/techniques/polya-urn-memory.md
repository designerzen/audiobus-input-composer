# T020 — Reinforced sampling and Polya-urn memory

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Increase an outcome weight when it is selected, creating history-dependent reinforcement.

## Proposed symbolic-music use

Give a motif recurring presence within one session, while a decay or cap keeps one idea from taking over.

## Worked example or experiment setup

Starting weights [1,1], selecting A and adding one gives [2,1], so the next probability of A is 2/3.

## Time, emotion and energy

Emotion can choose eligible motif families; energy affects realization, not reinforcement; time can decay old weights.

## Failure modes and practical limits

Unbounded reinforcement can lock into an arbitrary early choice. Frequency is not a measure of quality.

## Evaluation

Compare reinforced, decayed and unreinforced recall under matched seeds and explicit motif-retention goals.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NumPy: categorical sampling](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
