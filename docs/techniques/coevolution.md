# T030 — Co-evolution of musical parts

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Evaluate evolving populations through their interactions rather than an isolated score for each individual.

## Proposed symbolic-music use

Evolve lead and answer candidates together, rewarding complementary rhythm and motif relations within shared budgets.

## Worked example or experiment setup

A good answer is tested against several lead phrases, so it cannot succeed only by exploiting one partner.

## Time, emotion and energy

Emotion defines shared phrase aims; energy supplies a joint attack budget; selection happens over future phrase ensembles.

## Failure modes and practical limits

Populations can cycle or collude toward a simplistic convention. Strong isolated parts may combine poorly.

## Evaluation

Test cross-pairings with held-out partners and compare joint evaluation against independently optimized parts.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [DEAP: evolutionary operators](https://deap.readthedocs.io/en/master/api/tools.html)
- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
