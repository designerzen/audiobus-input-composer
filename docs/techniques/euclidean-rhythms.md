# T081 — Euclidean and maximally even rhythms

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Distribute a selected number of onsets as evenly as possible around a cycle.

## Proposed symbolic-music use

Build rhythm scaffolds, then separately choose rotation, accents, pitches and gates.

## Worked example or experiment setup

Three attacks in eight slots can be x..x..x.; rotating by one slot gives .x..x..x, changing metric placement without changing count.

## Time, emotion and energy

Energy selects onset count; emotion selects accent and contour; preserve phrase-scale changes above the rhythmic cycle.

## Failure modes and practical limits

Binary evenness does not reproduce a cultural performance practice. Different rotation conventions can cause unexpected alignment.

## Evaluation

Check attack counts and cyclic gaps, then compare accents and rotations at constant density.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Toussaint: Euclidean rhythms](https://ehess.modelisationsavoirs.fr/atiam/biblio/Toussaint-BRIDGES2005.pdf)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
