# T053 — Lorenz-system trajectories

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Integrate coupled nonlinear differential equations to obtain a time-varying trajectory.

## Proposed symbolic-music use

Use changes between broad trajectory regions as section cues and one coordinate as a bounded register preference.

## Worked example or experiment setup

Sample a normalized coordinate once per bar rather than translating every solver step into a note. Store solver settings for replay.

## Time, emotion and energy

Energy affects musical extraction; emotion maps regions to phrase vocabularies; simulation and transport time remain distinct.

## Failure modes and practical limits

Integration step and initial state affect outcomes. Chaotic divergence makes regenerated long sessions sensitive to numerical implementation.

## Evaluation

Compare integration tolerances and save resolved symbolic traces; test whether region changes support useful musical transitions.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [JuliaDynamics: defined maps and flows](https://juliadynamics.github.io/PredefinedDynamicalSystems.jl/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
