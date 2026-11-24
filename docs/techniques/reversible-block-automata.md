# T036 — Reversible block cellular automata

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Apply reversible local transformations on alternating partitions of a grid.

## Proposed symbolic-music use

Move a fixed population of rhythmic tokens between slots, conserving material while changing its arrangement.

## Worked example or experiment setup

A token-swapping block rule preserves the number of tokens; alternate the block origin so tokens can cross previous partition boundaries.

## Time, emotion and energy

Energy selects accents or orchestration rather than silently changing conserved population; emotion selects admissible permutations.

## Failure modes and practical limits

Conservation can still yield tedious cycles. A non-bijective rule loses reversibility; note gates must not depend on visual persistence alone.

## Evaluation

Run forward then inverse steps and verify state recovery, then measure rhythmic recurrence and useful variation.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: rule implementations](https://golly.sourceforge.io/Help/Algorithms/RuleLoader.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
