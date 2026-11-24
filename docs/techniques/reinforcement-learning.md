# T098 — Reinforcement learning for conductor actions

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Learn an action policy through transitions and rewards in a specified environment.

## Proposed symbolic-music use

Choose bounded actions such as hold, answer, thin or return; keep event validation and transport ownership deterministic.

## Worked example or experiment setup

Reward valid cadence completion and explicit task success while retaining separate penalties for excessive density and ignored human input.

## Time, emotion and energy

The wheel is part of the observed context; energy sets action limits; training simulation is separate from live execution.

## Failure modes and practical limits

Reward hacking and simulator mismatch can dominate. A handcrafted reward is not measured listener satisfaction.

## Evaluation

Evaluate on unseen scenarios and compare with an authored conductor under matched material and compute budgets.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Spinning Up: reinforcement-learning formulation](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
