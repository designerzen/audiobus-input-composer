# T079 — Wave Function Collapse for musical tiles

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Propagate local compatibility constraints while selecting among remaining tile possibilities.

## Proposed symbolic-music use

Use authored rhythmic/harmonic cells as tiles with entry, exit and voice-leading compatibility labels.

## Worked example or experiment setup

A dominant-entry tile can only follow a compatible predecessor; pin a cadence tile at the final slot and propagate constraints backward.

## Time, emotion and energy

Emotion adjusts tile weights; energy selects permitted densities; time fixes finite phrase length.

## Failure modes and practical limits

Local compatibility does not guarantee long-form development. Contradictions need bounded backtracking or restart; this is not quantum computation.

## Evaluation

Test impossible tile sets, completion rate and phrase joins against simple compatible random concatenation.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Gumin: Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
