# T071 — Constraint programming for musical events

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Assign variables from finite domains subject to explicit relationships.

## Proposed symbolic-music use

Solve a short phrase with pitch ranges, chord anchors, duration totals and voice-separation requirements.

## Worked example or experiment setup

Choose four degree anchors from finite sets while requiring the last anchor to reach the cadence target and total rhythm to fill the bar.

## Time, emotion and energy

Emotion adds soft preferences; energy sets hard event budgets; solve before the phrase deadline.

## Failure modes and practical limits

An infeasible model needs a diagnostic and fallback. Hard-coding one style’s rules can exclude intended expression.

## Evaluation

Check solutions and infeasible examples; record which preferences were relaxed and compare with musician annotations.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [OR-Tools: integer constraint solving](https://developers.google.com/optimization/cp/cp_solver)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
