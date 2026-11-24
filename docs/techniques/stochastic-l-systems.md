# T044 — Stochastic L-systems

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Choose among parallel rewrite alternatives with declared probabilities.

## Proposed symbolic-music use

Generate related phrase families whose branching structures vary without replacing the whole motif vocabulary.

## Worked example or experiment setup

A may become AB with .7 probability or BA with .3; use independent keyed choices for each symbol instance.

## Time, emotion and energy

Emotion shifts bounded production weights; energy controls allowed terminal density; derivation depth is fixed per planned section.

## Failure modes and practical limits

Structural randomness can erase the seed theme. A mutable random stream makes results depend on traversal order.

## Evaluation

Compare motif resemblance and derivation diversity across seeds, with exact duration normalization.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz and Lindenmayer: author publication archive](https://algorithmicbotany.org/papers/)
- [NumPy: categorical sampling](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
