# T014 — Hidden Markov models

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

A latent Markov state governs the distribution of observed events.

## Proposed symbolic-music use

Let hidden states represent phrase roles such as statement, response and closing, with separate note/rhythm emissions.

## Worked example or experiment setup

A closing state can favour long tonic-related events while an active state favours short connecting notes. States need not equal emotion labels.

## Time, emotion and energy

Emotion biases allowable emissions; energy adjusts activity within a state; time and minimum residence prevent flicker.

## Failure modes and practical limits

Learned states may not match named musical roles. Ordinary HMM duration behaviour may produce implausibly rapid state changes.

## Evaluation

Inspect state occupancy and emitted music; compare with an explicitly authored role-state controller.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [hmmlearn: hidden Markov model tutorial](https://hmmlearn.readthedocs.io/en/stable/tutorial.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
