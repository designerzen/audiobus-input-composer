# T073 — Mixed-integer and integer programming

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Optimize an objective under linear relationships with integer and optionally continuous decision variables.

## Proposed symbolic-music use

Allocate onsets, parts and register placements to meet a global density plan and minimize declared movement costs.

## Worked example or experiment setup

Binary slot variables sum to six optional attacks; continuous variables can describe some performance preferences in a suitable solver.

## Time, emotion and energy

Energy sets occupancy bounds; emotion changes objective weights; time supplies a deadline and feasible fallback.

## Failure modes and practical limits

Some musical rules need nonlinear or expanded encodings. CP-SAT specifically uses integer terms, not arbitrary continuous variables.

## Evaluation

Compare feasible incumbents at a fixed time budget and inspect objective components rather than claiming global musical optimality.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [OR-Tools: integer constraint solving](https://developers.google.com/optimization/cp/cp_solver)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
