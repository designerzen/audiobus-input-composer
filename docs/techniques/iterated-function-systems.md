# T056 — Iterated function systems

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Repeatedly apply selected transformations to a state, often using contractive maps.

## Proposed symbolic-music use

Generate self-related register and duration preferences, then resolve them into a finite phrase vocabulary.

## Worked example or experiment setup

Select between two bounded affine transformations and map the resulting coordinate to one of seven degree regions.

## Time, emotion and energy

Emotion selects transform weights; energy controls attack budgets; iteration depth and musical sampling are independent.

## Failure modes and practical limits

Visually self-similar structure may disappear after quantization. Non-contractive choices can diverge.

## Evaluation

Compare latent and realized recurrence, verify boundedness and audition against simple recursive motif transformations.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz and Lindenmayer: author publication archive](https://algorithmicbotany.org/papers/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
