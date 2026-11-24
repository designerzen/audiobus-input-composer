# T043 — Deterministic L-systems

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Rewrite all symbols in parallel using fixed productions.

## Proposed symbolic-music use

Interpret the resulting string as interval moves, rests and rhythmic cells; keep the derivation separate from musical mapping.

## Worked example or experiment setup

With A->AB and B->A, successive strings are A, AB, ABA, ABAAB. Map A and B to distinct authored cells.

## Time, emotion and energy

Generation controls structural scale; energy controls selected realizations; emotion selects the A/B musical vocabulary.

## Failure modes and practical limits

String length can grow rapidly. Plant-like or fractal structure does not automatically become recognizable musical form.

## Evaluation

Verify derivation lengths and token mapping; compare repeated generations at constant total duration.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz: score generation with L-systems](https://algorithmicbotany.org/papers/score.icmc86.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
