# T092 — Symbolic Transformer models

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use attention over tokenized musical context to predict or reconstruct symbolic events.

## Proposed symbolic-music use

Propose longer motif-aware continuations while explicit plans retain section, harmony and ending authority.

## Worked example or experiment setup

Represent time, pitch and duration explicitly; preserve a theme reference in context and validate the decoded note lifecycle.

## Time, emotion and energy

Emotion needs actual conditioning or constrained reranking; energy is measured from the output; plan ahead outside delivery callbacks.

## Failure modes and practical limits

Context length does not guarantee controllability or long-form quality. Tokenization can lose voice or meter information.

## Evaluation

Compare early and late excerpts, locked-region preservation and training-fragment similarity under documented data provenance.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Huang and colleagues: Music Transformer](https://arxiv.org/abs/1809.04281)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
