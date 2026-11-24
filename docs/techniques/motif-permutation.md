# T087 — Constrained motif permutations

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Reorder motif events or cells while preserving declared invariants.

## Proposed symbolic-music use

Keep first and last anchors and permute only interior cells, retaining a phrase’s entry and ending contracts.

## Worked example or experiment setup

For four cells A,B,C,D, preserve A and D and compare A-B-C-D with A-C-B-D.

## Time, emotion and energy

Energy selects ornament realization; emotion weights admissible permutations; change only at a planned phrase boundary.

## Failure modes and practical limits

A permutation can destroy contour or prepared dissonance. Distinct symbolic orders can sound nearly identical.

## Evaluation

Verify preserved anchors and obligations, then assess listener recognition and join quality.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Alonen and Forment: Ziffers](https://zenodo.org/records/7841945)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
