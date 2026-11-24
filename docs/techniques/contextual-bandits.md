# T099 — Contextual bandits for musical action choice

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Choose among actions using contextual features and feedback while balancing exploration and exploitation.

## Proposed symbolic-music use

Select an optional transformation from a small library when explicit, appropriately labelled feedback exists.

## Worked example or experiment setup

Given section, emotion and energy, choose repeat or answer; observe a later explicit accept/reject label without assuming a full future-state model.

## Time, emotion and energy

Emotion and energy define context; limit exploration during performance; maintain uncertainty when feedback is sparse.

## Failure modes and practical limits

Delayed attribution and changing preferences violate simple assumptions. Random exploration can interrupt a phrase.

## Evaluation

Compare with fixed action weights and inspect feedback attribution, uncertainty and user control.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Spinning Up: reinforcement-learning formulation](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)
- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
