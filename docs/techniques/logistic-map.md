# T051 — Logistic-map control

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Iterate x_next=r*x*(1-x), whose behaviour depends strongly on r and the initial condition.

## Proposed symbolic-music use

Map a bounded trajectory to phrase-level accent or motif-choice preferences, then apply musical constraints.

## Worked example or experiment setup

For r=4 and x=.2, the next value is .64 and then .9216. Repeated rounding to notes can hide much of the trajectory.

## Time, emotion and energy

Time sets iteration versus musical sampling; energy sets output range; emotion chooses a mapper rather than an asserted chaos-to-feeling rule.

## Failure modes and practical limits

Finite precision and exceptional seeds can produce periodic or degenerate output. More chaotic parameters do not guarantee more energy.

## Evaluation

Record seed, precision and sampling stride; compare with uniform and correlated random controls.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [JuliaDynamics: defined maps and flows](https://juliadynamics.github.io/PredefinedDynamicalSystems.jl/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
