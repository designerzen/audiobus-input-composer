# T086 — Serial rows and ordered pitch-class operations

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Transform an ordered pitch-class collection through transposition, inversion, retrograde and related operations.

## Proposed symbolic-music use

Use a row as pitch-order structure while rhythm, register and articulation remain separate decisions.

## Worked example or experiment setup

For row fragment [0,1,4], inversion around zero gives [0,11,8] modulo twelve. Assign register afterward.

## Time, emotion and energy

Emotion selects realization preferences, not an automatic tonal label; energy controls rhythm; phrase time controls row segmentation.

## Failure modes and practical limits

Ordered coverage does not supply convincing form. Tonal chord-fit metrics can misjudge the intended profile.

## Evaluation

Verify row transformations and repeated pitch classes, then compare heard relatedness under controlled rhythm and register.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Alonen and Forment: Ziffers](https://zenodo.org/records/7841945)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
