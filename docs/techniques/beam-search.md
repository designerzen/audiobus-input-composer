# T076 — Beam search

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Keep only a bounded number of promising partial sequences at each expansion step.

## Proposed symbolic-music use

Build phrases with several possible future continuations while limiting computation.

## Worked example or experiment setup

A width-four beam retains four partial motifs after each note; score obligations and remaining cadence reachability before pruning.

## Time, emotion and energy

Emotion changes candidate ranking; energy limits expansions; commit only complete validated phrases.

## Failure modes and practical limits

An early scoring bias can eliminate the best long-term route. Beam width does not remove a flawed objective.

## Evaluation

Compare widths and equal-budget random proposals, tracking both completion failures and musical preferences.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Huang and colleagues: Music Transformer](https://arxiv.org/abs/1809.04281)
- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
