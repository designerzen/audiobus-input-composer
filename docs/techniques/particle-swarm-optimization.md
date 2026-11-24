# T063 — Particle swarm optimization

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Move candidate parameter vectors using their own and neighbours’ best-known positions.

## Proposed symbolic-music use

Search a continuous composer-control space offline, with a fixed symbolic decoder and several evaluation scenarios.

## Worked example or experiment setup

Particles tune contour bias and rhythmic contrast; the best parameter vector still needs to be decoded and auditioned.

## Time, emotion and energy

Emotion and energy define target scenarios; time supplies a search deadline, not the particle integration rate for playback.

## Failure modes and practical limits

Particles can collapse prematurely or exploit a noisy evaluator. PSO is optimization, distinct from performing a flock simulation.

## Evaluation

Compare with equal-budget random and differential-evolution searches using held-out seeds.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [pymoo: particle swarm optimization](https://pymoo.org/algorithms/soo/pso.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
