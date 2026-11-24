# T100 — Bar-conditioned symbolic style transfer

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Change declared attributes of existing music while retaining selected content relationships.

## Proposed symbolic-music use

Use a theme as content and alter rhythmic intensity or polyphony in future bars, with explicit protected regions.

## Worked example or experiment setup

Retain lead anchors while requesting a less dense accompaniment; compare decoded activity rather than trusting the requested attribute label.

## Time, emotion and energy

Energy controls validated density attributes; emotion requires an independently calibrated mapping; bar timing defines edit scope.

## Failure modes and practical limits

Style, emotion and density are not interchangeable. Transfer can rewrite identity-bearing details.

## Evaluation

Check content preservation and control response separately, comparing learned transfer with explicit symbolic edits.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Wu and Yang: MuseMorphose](https://arxiv.org/abs/2105.04090)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
