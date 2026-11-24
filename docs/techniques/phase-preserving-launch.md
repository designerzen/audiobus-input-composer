# T113 — Phase-preserving groove launch

Family: **Interactive performance and adaptive timing**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Start a repeating pattern on a shared phase rather than resetting its cycle to the arrival of the request.

## Proposed symbolic-music use

Queue bass or percussion entrances at compatible boundaries while preserving the current arrangement position.

## Worked example or experiment setup

A request halfway through a bar can enter next bar at phase zero; a legato join needs a separately declared policy.

## Time, emotion and energy

Energy can request layer entrances; emotion changes eligible cells; timing authority decides the effective boundary.

## Failure modes and practical limits

Beat alignment is not harmonic validity or identical song position. Queued and sounding states must be distinct.

## Evaluation

Check late joins, odd meters and section changes; compare expected versus actual entry boundaries.

## AudioBus integration

Keep intended waiting, input latency and delivery latency separate. Test human control and contribution recognition alongside event correctness.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Ableton: tempo, phase and arrangement synchronization](https://ableton.github.io/link/)
- [HarmonEasy: ensemble research](../../../harmoneasy/docs/research/ensemble-transformer.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
