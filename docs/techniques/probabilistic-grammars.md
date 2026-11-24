# T042 — Probabilistic context-free grammars

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Attach normalized choice probabilities to alternative productions.

## Proposed symbolic-music use

Vary phrase structures while retaining the same hierarchical musical roles and terminal constraints.

## Worked example or experiment setup

A response may expand to Echo with .6 probability or Contrast with .4. Its selected production still must meet the duration contract.

## Time, emotion and energy

The wheel modifies profile-specific production weights; energy selects surface complexity; section position conditions ending rules.

## Failure modes and practical limits

High recursion probability can create excessive depth. Probability-weighted syntax does not ensure balanced large-scale form.

## Evaluation

Measure realized production frequencies, termination and phrase lengths before listening to structural diversity.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Bird, Klein and Loper: grammars and parsing](https://www.nltk.org/book/ch08.html)
- [NumPy: categorical sampling](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
