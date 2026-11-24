# T112 — Landmark and target synchronization

Family: **Interactive performance and adaptive timing**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Coordinate local musical progress toward declared future positions rather than conflating tempo and position.

## Proposed symbolic-music use

Let an answering phrase recover toward a future bar or cadence without bursting through all missed attacks.

## Worked example or experiment setup

After a delay, choose a reachable next phrase boundary; any duration compression is explicitly bounded and labelled as a heuristic.

## Time, emotion and energy

Emotion changes material, not recovery authority; energy remains separate; time supplies the landmark and confidence.

## Failure modes and practical limits

Aggressive correction can destroy phrasing. A local heuristic is not an implementation of Antescofo’s full synchronization algorithms.

## Evaluation

Measure phase, tempo and perceived control independently during late input, skipped material and role changes.

## AudioBus integration

Keep intended waiting, input latency and delivery latency separate. Test human control and contribution recognition alongside event correctness.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IRCAM: synchronization strategies](https://antescofo-doc.ircam.fr/Reference/time_synchro/)
- [HarmonEasy: ensemble research](../../../harmoneasy/docs/research/ensemble-transformer.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
