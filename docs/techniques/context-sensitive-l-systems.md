# T045 — Context-sensitive rewriting

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Choose a rewrite using neighbouring symbols as well as the symbol being replaced.

## Proposed symbolic-music use

Make a response depend on surrounding harmonic or phrase-role tokens, allowing locally aware development.

## Worked example or experiment setup

Rewrite an ornament token differently when preceded by a dominant marker than when preceded by a tonic marker.

## Time, emotion and energy

Emotion modifies allowed response rules; energy sets ornament budgets; evaluate each generation against the same frozen context.

## Failure modes and practical limits

Overlapping matches need precedence rules. Updating symbols in place accidentally changes parallel rewrite semantics.

## Evaluation

Use small hand-derived strings to check matching and compare context-aware joins with context-free ones.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz and Lindenmayer: author publication archive](https://algorithmicbotany.org/papers/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
