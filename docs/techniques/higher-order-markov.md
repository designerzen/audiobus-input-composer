# T012 — Higher-order Markov and n-gram models

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Condition the next event on a fixed-length history of previous symbols.

## Proposed symbolic-music use

Use recent intervals and duration categories to preserve recognizable cells beyond one step.

## Worked example or experiment setup

Histories [0,2] and [4,2] can lead to different continuations although their last degree is the same. An unseen pair needs backoff.

## Time, emotion and energy

Emotion changes candidate preferences after prediction; energy changes rhythm conditioning; phrase time adds target information.

## Failure modes and practical limits

The number of contexts grows rapidly and sparse training can copy fragments or leave dead ends.

## Evaluation

Compare several orders with held-out sequences and track repeated training fragments separately from likelihood.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IDyOM: variable-order and multiple-viewpoint prediction](https://www.marcus-pearce.com/idyom/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
