# T074 — Dynamic programming for phrase paths

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Reuse solutions to subproblems when the retained state contains all information needed for future costs.

## Proposed symbolic-music use

Select a sequence of voicings or melodic anchors with minimal declared transition cost over a fixed harmonic route.

## Worked example or experiment setup

For each chord and candidate voicing, store the best predecessor cost and reconstruct the final path.

## Time, emotion and energy

Emotion supplies candidate vocabulary; energy constrains texture; phrase length fixes the planning horizon.

## Failure modes and practical limits

A state omitting unresolved suspensions or motif position loses necessary history. More state increases cost.

## Evaluation

Compare with exhaustive search on tiny cases and audition against greedy nearest-voicing selection.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
