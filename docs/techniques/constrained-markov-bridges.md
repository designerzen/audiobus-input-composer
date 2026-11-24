# T017 — Constrained Markov generation and endpoint bridges

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Condition sequence sampling on admissibility rules or a required future endpoint.

## Proposed symbolic-music use

Choose a cadence target first, then favour transitions that can still reach it in the remaining slots.

## Worked example or experiment setup

If only two events remain and a target is unreachable from one candidate, reject it or compute endpoint-conditioned transition weights.

## Time, emotion and energy

Emotion changes the valid route vocabulary; energy changes optional subdivisions; time supplies the remaining horizon.

## Failure modes and practical limits

Simply forcing the last note can create an awkward leap. Filtering transitions requires renormalization and dead-end detection.

## Evaluation

Check endpoint reachability and compare whole-route conditioning against last-note replacement.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IDyOM: variable-order and multiple-viewpoint prediction](https://www.marcus-pearce.com/idyom/)
- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
