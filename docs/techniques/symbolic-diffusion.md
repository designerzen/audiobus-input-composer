# T095 — Diffusion models for symbolic scores

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Iteratively denoise a symbolic or latent representation, potentially conditioned on higher-level structure.

## Proposed symbolic-music use

Generate future phrases under form, harmony and texture conditions while preserving fixed regions.

## Worked example or experiment setup

Freeze an authored theme and ask for accompaniment in the remaining symbolic regions; verify that fixed material is unchanged.

## Time, emotion and energy

Emotion enters only through supported controls; energy is checked after decoding; iteration count must meet the planning deadline.

## Failure modes and practical limits

Guidance strength is not musical correctness. Denoising may be too slow for an immediate response.

## Evaluation

Measure edit locality, structure following and generation delay against the procedural baseline.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Wang, Min and Xia: hierarchical symbolic diffusion](https://arxiv.org/abs/2405.09901)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
