# T068 — Excitable and refractory networks

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Nodes activate in response to input and then pass through a refractory interval.

## Proposed symbolic-music use

Model a network of answering motifs where one gesture can invite another after a known delay.

## Worked example or experiment setup

A lead activation enables an answer node; its refractory period prevents immediate repeated answers.

## Time, emotion and energy

Energy controls transmission eligibility; emotion selects response cells; delays are expressed in musical beats.

## Failure modes and practical limits

Feedback loops can create uncontrolled activity. A refractory rule needs clear units and deterministic update order.

## Evaluation

Test pulse propagation, loop termination and density bounds, then compare with a simple call-and-response state machine.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: Generations and refractory states](https://golly.sourceforge.io/Help/Algorithms/Generations.html)
- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
