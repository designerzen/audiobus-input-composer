# T037 — Probabilistic cellular automata

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use a conditional probability for a cell transition instead of a wholly deterministic rule.

## Proposed symbolic-music use

Introduce controlled uncertainty into a rhythmic mask while preserving deterministic anchors outside the grid.

## Worked example or experiment setup

A candidate birth is accepted with .7 probability keyed by generation and coordinate. Re-querying the same generation must agree.

## Time, emotion and energy

Energy controls the cap independently from birth probability; emotion can choose a validated transition regime.

## Failure modes and practical limits

Small probability changes can cause global extinction or explosion. Unkeyed randomness breaks reproducible querying.

## Evaluation

Measure survival, density and periodicity over many seeds; label stochastic reseeding separately from ordinary evolution.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: Life and outer-totalistic rules](https://golly.sourceforge.io/Help/Algorithms/QuickLife.html)
- [NumPy: categorical sampling](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
