# T093 — Variational autoencoders for motifs

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Encode musical sequences into a latent distribution and decode samples or interpolated latent values.

## Proposed symbolic-music use

Create related phrase variants for an authored theme, keeping selected rhythm or cadence anchors protected.

## Worked example or experiment setup

Decode several points between two motif latents and inspect whether pitch contour changes smoothly after symbolic quantization.

## Time, emotion and energy

Emotion may choose calibrated latent regions; energy stays an explicit checked descriptor; transitions occur at phrase boundaries.

## Failure modes and practical limits

Latent distance is not perceptual distance. Interpolation may lose motif identity or violate locked material.

## Evaluation

Evaluate reconstruction, variation and controllability separately; compare with simple rule-based motif transforms.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Roberts and colleagues: MusicVAE](https://arxiv.org/abs/1803.05428)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
