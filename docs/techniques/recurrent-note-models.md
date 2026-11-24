# T091 — Recurrent and LSTM note models

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Generate a sequence using a recurrent hidden state conditioned on previous events.

## Proposed symbolic-music use

Propose a melody continuation from recent resolved notes and the planned harmony, with a procedural fallback.

## Worked example or experiment setup

A worker receives two bars of symbolic context and proposes the next phrase; reject it if its plan revision is obsolete.

## Time, emotion and energy

Emotion conditions or reranks proposals only where supported; energy is verified in the resolved score; generation has a deadline.

## Failure modes and practical limits

Local continuation can lose form and identity. A sampling temperature is not a calibrated emotion or energy control.

## Evaluation

Compare held-out continuation, motif retention, actual control following and deadline failures separately.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Magenta.js: MusicRNN implementation](https://github.com/magenta/magenta-js/blob/master/music/src/music_rnn/model.ts)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
