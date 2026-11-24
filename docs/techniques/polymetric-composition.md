# T082 — Polymetric loop composition

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Run musical cycles with different lengths against a common time unit.

## Proposed symbolic-music use

Use a short bass loop and a differently sized answer cycle to create changing alignments.

## Worked example or experiment setup

Loops of three and four equal-duration steps realign after twelve steps. Their harmony still needs coordination.

## Time, emotion and energy

Energy changes orchestration rather than cycle lengths by default; emotion selects material; time tracks the supercycle.

## Failure modes and practical limits

Independent loops can conflict at harmonic changes. Least common multiple in steps is not valid when step durations differ.

## Evaluation

Verify alignment and chord-boundary handling; compare changing alignments with an authored twelve-step arrangement.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [TidalCycles: pattern structure](https://tidalcycles.org/docs/reference/pattern_structure/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
