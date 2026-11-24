# T078 — Monte Carlo tree search

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Allocate exploration to a decision tree through repeated selection, expansion and evaluated simulations.

## Proposed symbolic-music use

Explore a few phrase-level conductor actions by simulating their symbolic consequences over a short horizon.

## Worked example or experiment setup

Compare hold, thin and introduce-answer actions through bounded rollouts; none of the hypothetical notes is sent to output.

## Time, emotion and energy

Emotion supplies goals; energy sets budgets; planning time limits rollouts before the commitment boundary.

## Failure modes and practical limits

A poor rollout evaluator can prefer harmful actions. Simulated future audience satisfaction is not an observed reward.

## Evaluation

Compare with exhaustive shallow action evaluation and count decision quality per computation budget.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Spinning Up: reinforcement-learning formulation](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
