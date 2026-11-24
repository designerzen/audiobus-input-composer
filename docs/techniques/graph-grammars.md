# T047 — Graph grammars for form

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Rewrite subgraphs according to rules while retaining declared connections.

## Proposed symbolic-music use

Expand a section graph into statement, contrast and return structures with explicit incoming and outgoing harmonic conditions.

## Worked example or experiment setup

Replace one development node with two linked variants while keeping its entrance and exit nodes unchanged.

## Time, emotion and energy

Emotion changes eligible expansions; energy changes orchestration inside nodes; form edits affect future sections only.

## Failure modes and practical limits

Rewrites can introduce unreachable endings or cycles. Graph validity alone does not make transitions audible.

## Evaluation

Check reachability and bounded duration, then compare the heard form with its planned graph.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)
- [Prusinkiewicz: score generation with L-systems](https://algorithmicbotany.org/papers/score.icmc86.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
