# T013 — Variable-order Markov and prediction by partial matching

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use longer contexts when supported and shorter ones when data are sparse.

## Proposed symbolic-music use

Model intervals, rhythm and metrical viewpoints with explicit smoothing, borrowing the predictive framing of IDyOM.

## Worked example or experiment setup

If a three-event history is unseen, consult its two-event suffix and shorter contexts; specify interpolation rather than inventing probability mass.

## Time, emotion and energy

Energy can steer rhythmic candidates after prediction; emotion can choose a corpus/profile; freeze context at the composition boundary.

## Failure modes and practical limits

Backoff design affects surprise estimates. A predictive model is not automatically a generative aesthetic policy.

## Evaluation

Evaluate held-out prediction and generated phrase structure separately; record which context lengths contributed.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IDyOM: variable-order and multiple-viewpoint prediction](https://www.marcus-pearce.com/idyom/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
