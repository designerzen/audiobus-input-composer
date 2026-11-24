# T023 — Grammar-guided evolutionary encoding

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Decode an evolving genotype through a constrained production grammar.

## Proposed symbolic-music use

Evolve phrase plans that can only produce legal sections, harmonic functions and motif transformations.

## Worked example or experiment setup

A gene chooses between statement-plus-answer and statement-plus-rest; another selects a permitted cadence route.

## Time, emotion and energy

Emotion changes production preferences; energy changes legal density variants; decode against a fixed phrase horizon.

## Failure modes and practical limits

Small genotype changes can cause large phenotype changes. Different genes may decode to the same phrase.

## Evaluation

Count invalid or duplicate decoded results and compare controllability against direct phrase encoding.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Grammatical Evolution: author publications](https://www.grammatical-evolution.org/pubs.html)
- [DEAP: genetic programming](https://deap.readthedocs.io/en/stable/tutorials/advanced/gp.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
