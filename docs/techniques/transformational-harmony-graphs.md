# T090 — Transformational harmony graphs

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Represent chords as nodes connected by specified musical transformations.

## Proposed symbolic-music use

Traverse a graph of common-tone-preserving or profile-defined chord relationships while preserving a thematic rhythm.

## Worked example or experiment setup

Move C major to A minor through a two-common-tone relation; label the relationship rather than assuming every edge has equal expressive meaning.

## Time, emotion and energy

Emotion biases relationship families; energy affects texture; section time sets targets and return obligations.

## Failure modes and practical limits

Graph adjacency is not a universal harmonic grammar. A route can wander indefinitely without a planned return.

## Evaluation

Check edge definitions and audible transitions, comparing constrained routes with functional-harmony plans.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Tonal: music-theory implementation](https://github.com/tonaljs/tonal)
- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
