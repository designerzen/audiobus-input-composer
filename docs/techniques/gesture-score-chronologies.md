# T111 — Gesture-to-score chronologies

Family: **Interactive performance and adaptive timing**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Separate an ordered score event sequence from the times at which a performer requests its next event.

## Proposed symbolic-music use

Let a person control when an authored or generated onset occurs while the composer supplies pitch and phrase context.

## Worked example or experiment setup

One accepted gesture requests one simultaneous note/chord group; holding the input does not authorize an entire melody.

## Time, emotion and energy

The wheel changes future material; energy changes realization; gesture time and arrangement time remain separate records.

## Failure modes and practical limits

Early queues, late recovery and long rests require explicit policies. This is not equivalent to a phrase-launch button.

## Evaluation

Use missed-note and late-entry scenarios and ask participants to predict the musical consequence of a gesture.

## AudioBus integration

Keep intended waiting, input latency and delivery latency separate. Test human control and contribution recognition alongside event correctness.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: ensemble research](../../../harmoneasy/docs/research/ensemble-transformer.md)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
