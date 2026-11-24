# T097 — Reservoir and echo-state sequence models

Family: **Learned symbolic models and adaptation**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use a recurrent dynamical reservoir with a trained readout to model temporal relationships.

## Proposed symbolic-music use

Predict a small set of motif or rhythmic states rather than directly controlling every MIDI byte.

## Worked example or experiment setup

Feed recent interval/rhythm features into a fixed reservoir and train a bounded next-cell classifier, then let the conductor choose among proposals.

## Time, emotion and energy

Emotion and energy can be explicit input features with tested coverage; state resets occur at declared boundaries.

## Failure modes and practical limits

Reservoir stability and memory depend on design. Unseen control combinations may produce unreliable predictions.

## Evaluation

Compare with a small Markov baseline and test resets, long rests and held-out control trajectories.

## AudioBus integration

Keep learned output behind deadlines and the same score validator as procedural output. Document model/corpus provenance and retain a procedural fallback.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Jaeger: echo-state networks, corrected report](https://www.ai.rug.nl/minds/uploads/EchoStatesTechRep.pdf)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
