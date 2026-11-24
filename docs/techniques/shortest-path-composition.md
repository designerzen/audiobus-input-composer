# T075 — Shortest-path composition

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Find a route through a weighted graph under the selected algorithm’s cost assumptions.

## Proposed symbolic-music use

Treat harmonic or pitch-set states as vertices and admissible transitions as edges.

## Worked example or experiment setup

Find a route from an opening chord to a cadence through two intermediate layers, with edges weighted by voice movement.

## Time, emotion and energy

Emotion selects graph regions; energy alters realization; time-layered vertices can enforce exact phrase length.

## Failure modes and practical limits

The cheapest route can be repetitive or too short. Negative costs and cycles require the correct algorithm and interpretation.

## Evaluation

Verify route length and edge costs; compare the resulting music with alternative near-optimal routes.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
