# T028 — MAP-Elites and quality-diversity libraries

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Keep high-performing candidates in cells of a user-defined behaviour-descriptor space.

## Proposed symbolic-music use

Build an auditionable motif library indexed by density and contour, while evaluating validity and identity within each cell.

## Worked example or experiment setup

A 4-by-4 archive can contain sixteen different density/contour regions. Empty cells indicate missing candidates, not bad music.

## Time, emotion and energy

Energy selects a density region; emotion chooses among compatible colours; section time follows a coherent route through the archive.

## Failure modes and practical limits

Descriptor coverage does not establish emotional coverage. Selecting distant cells can destroy continuity.

## Evaluation

Inspect archive diversity, transition quality and held-out control following, comparing against an equally sized random library.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Mouret and Clune: MAP-Elites](https://arxiv.org/abs/1504.04909)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
