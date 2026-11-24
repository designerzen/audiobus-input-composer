# T055 — Coupled phase oscillators and Kuramoto networks

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Let oscillator phases influence one another through a coupling function.

## Proposed symbolic-music use

Assign parts to oscillators and trigger symbolic gestures at phase crossings, allowing alignment and divergence.

## Worked example or experiment setup

Two close frequencies may align more strongly as coupling increases; extract event times through crossing detection, not display frames.

## Time, emotion and energy

Energy controls orchestration; emotion can select coupling profiles; a master transport still governs delivery and phrase boundaries.

## Failure modes and practical limits

Synchronization can reduce interesting variation. Numerical steps can miss crossings, and abrupt coupling changes can disrupt phrasing.

## Evaluation

Measure phase coherence and event timing separately; compare emergent alignment with an authored polymetric cycle.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Brockmann and Strogatz: coupled phase oscillators](https://www.complexity-explorables.org/explorables/ride-my-kuramotocycle/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
