# T058 — Thue–Morse substitution sequences

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Apply 0->01 and 1->10 repeatedly to construct a structured nonperiodic infinite word.

## Proposed symbolic-music use

Use symbols to alternate two motif realizations, accent families or instrumental roles.

## Worked example or experiment setup

The first eight symbols are 01101001. Map 0 to an original cell and 1 to a bounded inversion.

## Time, emotion and energy

Energy changes realization, not the sequence identity; emotion chooses the paired cells; group symbols into explicit phrases.

## Failure modes and practical limits

Nonperiodicity is not randomness or endless novelty. A two-cell vocabulary can remain perceptually repetitive.

## Evaluation

Verify prefixes and compare heard motif development against ordinary alternating and random binary schedules.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz and Lindenmayer: author publication archive](https://algorithmicbotany.org/papers/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
