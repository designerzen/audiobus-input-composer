# T069 — Stigmergic shared musical memory

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Coordinate agents indirectly through persistent, decaying changes in a shared environment.

## Proposed symbolic-music use

Let performed motifs leave tagged traces that bias later answers without a direct instruction from the original part.

## Worked example or experiment setup

A phrase leaves an interval-contour trace for four bars; an answering part may recall it, while decay prevents endless reuse.

## Time, emotion and energy

Emotion affects trace compatibility; energy controls answer opportunities; trace age uses committed musical time.

## Failure modes and practical limits

Shared traces can become an echo chamber. Speculative generation must not leave traces for music never performed.

## Evaluation

Track provenance and expiry; compare indirect recall with explicit conductor-selected memory.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
