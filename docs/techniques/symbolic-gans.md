# T094 — Generative adversarial models for symbolic tracks

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Train a generator against a discriminator over symbolic representations such as multitrack piano rolls.

## Proposed symbolic-music use

Propose coordinated short textures or accompaniment candidates, then convert them into explicit note events.

## Worked example or experiment setup

A five-track piano roll needs a defined rule for repeated adjacent cells, sustained gates and overlapping voices before MIDI delivery.

## Time, emotion and energy

Emotion and energy require supported conditions or post-selection; time reserves a bounded candidate window.

## Failure modes and practical limits

Piano-roll plausibility is not complete song form. Mode collapse can hide behind attractive selected demos.

## Evaluation

Inspect diversity, note decoding and interpart relationships alongside listener ratings and rejected examples.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Dong and colleagues: MuseGAN](https://arxiv.org/abs/1709.06298)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
