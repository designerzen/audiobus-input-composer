# T060 — De Bruijn sequences

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Arrange symbols cyclically so every word of a fixed length occurs once.

## Proposed symbolic-music use

Systematically audition local rhythmic or motif-choice combinations without independent random repetition.

## Worked example or experiment setup

The cyclic binary sequence 00010111 contains each three-bit word once when wraparound windows are included.

## Time, emotion and energy

Energy maps symbols to different activity levels; emotion selects material; cycle traversal is grouped into musically planned sections.

## Failure modes and practical limits

Exhaustive local coverage is not convincing long-range form. Mapping collisions can make distinct words sound identical.

## Evaluation

Verify unique cyclic windows and compare perceived variety with a matched-length random sequence.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NetworkX: Eulerian traversal](https://networkx.org/documentation/stable/reference/algorithms/euler.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
