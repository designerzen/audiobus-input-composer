# T019 — Factor-oracle recombination

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use a compact sequence automaton and shared-context links to recombine observed material.

## Proposed symbolic-music use

Store interval/rhythm tuples from authored or session motifs and jump between context-compatible continuations.

## Worked example or experiment setup

Two motifs sharing the suffix [up-step,repeat] can offer different next cells; filter the proposed continuation against the current harmony.

## Time, emotion and energy

Energy selects rhythmic variants; emotion biases eligible continuations; phrase time controls jump opportunities.

## Failure modes and practical limits

Context-compatible symbols can still make poor phrase joins. Recombination can overuse a small source corpus.

## Evaluation

Track jump points, source provenance and listener-recognized continuity; compare with simple cell concatenation.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IRCAM: OMax factor-oracle improvisation](https://forum.ircam.fr/article/omax5-tutorials/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
