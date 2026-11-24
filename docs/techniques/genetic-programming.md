# T022 — Typed genetic programming

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Evolve programs or expression trees rather than only fixed-length parameter vectors.

## Proposed symbolic-music use

Use typed operators such as sequence, rotate, mask and transpose; terminals are motifs or bounded patterns.

## Worked example or experiment setup

A valid tree can be rotate(sequence(m1,m2),oneBeat). Forbid an operator whose expansion exceeds the phrase event budget.

## Time, emotion and energy

Emotion ranks transformations; energy bounds expansion; time selects when a generated program becomes active.

## Failure modes and practical limits

Tree bloat and unrestricted evaluation threaten deadlines. Program validity does not ensure musical coherence.

## Evaluation

Measure tree size, event expansion and motif preservation; compare learned trees with a small authored grammar.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [DEAP: genetic programming](https://deap.readthedocs.io/en/stable/tutorials/advanced/gp.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
