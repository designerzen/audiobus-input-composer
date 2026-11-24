# T114 — Score-aware human tempo following

Family: **Interactive performance and adaptive timing**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Estimate performed tempo using elapsed score beats associated with observed gestures.

## Proposed symbolic-music use

Follow a designated performer or confidence-weighted group while preserving a separate phase-correction policy.

## Worked example or experiment setup

Two gestures two score beats apart and one second apart imply 120 BPM; they do not imply 60 BPM merely because there were two taps.

## Time, emotion and energy

Emotion and energy may affect intended expression but must not override clock ownership; time estimates carry confidence.

## Failure modes and practical limits

Rests, repeated presses and recovery jumps corrupt naive inter-tap estimation. Dense parts should not dominate by event count alone.

## Evaluation

Compare fixed clock, designated conductor and bounded group following, measuring drift, oscillation and enjoyment.

## AudioBus integration

Keep intended waiting, input latency and delivery latency separate. Test human control and contribution recognition alongside event correctness.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [HarmonEasy: ensemble research](../../../harmoneasy/docs/research/ensemble-transformer.md)
- [IRCAM: synchronization strategies](https://antescofo-doc.ircam.fr/Reference/time_synchro/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
