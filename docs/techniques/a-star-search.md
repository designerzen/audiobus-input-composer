# T077 — A-star musical planning

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Prioritize partial routes using accumulated cost plus an estimate of remaining cost.

## Proposed symbolic-music use

Plan a harmonic or motif-transformation route to a known future target.

## Worked example or experiment setup

A lower bound on remaining pitch movement can guide a constrained approach to a cadence; artistic surprise is evaluated separately.

## Time, emotion and energy

Emotion chooses the target region; energy constrains realization; search has a bounded musical horizon.

## Failure modes and practical limits

Optimality claims require the relevant heuristic conditions. A perceptual cost estimate may be useful but not admissible.

## Evaluation

Check tiny graph solutions against exhaustive search and distinguish formal path optimality from perceived musical success.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
