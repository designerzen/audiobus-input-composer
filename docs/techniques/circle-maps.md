# T054 — Circle maps and modular phase processes

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Iterate an angular state modulo one, optionally with nonlinear phase feedback.

## Proposed symbolic-music use

Use phase crossing as an attack source and phase differences as rhythmic relationships between parts.

## Worked example or experiment setup

The simple rotation theta_next=(theta+1/3) mod 1 repeats after three steps; an irrational increment has different recurrence behaviour.

## Time, emotion and energy

Energy can alter extraction density while preserving reference tempo; emotion adjusts accents and permitted phrase roles.

## Failure modes and practical limits

Floating-point equality is unsuitable for detecting wrap events. Nonlinear parameters can produce unexpected locking regimes.

## Evaluation

Count crossings from unwrapped phase and compare rational and irrational rotations under finite precision.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [JuliaDynamics: defined maps and flows](https://juliadynamics.github.io/PredefinedDynamicalSystems.jl/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
