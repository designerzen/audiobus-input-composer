# T059 — Fibonacci words and unequal recurrence

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use the substitution A->AB, B->A to create a structured symbol sequence.

## Proposed symbolic-music use

Assign A and B different rhythmic cells or section gestures to vary return intervals.

## Worked example or experiment setup

A, AB, ABA and ABAAB contain lengths 1,2,3,5. If cell durations differ, symbol count is not elapsed musical time.

## Time, emotion and energy

Energy selects cell realizations; emotion selects compatible colours; the conductor groups the sequence into phrase-sized windows.

## Failure modes and practical limits

Irrational limiting proportions do not ensure a useful groove. Window boundaries can cut cells or obscure cadences.

## Evaluation

Check symbol and duration growth separately and compare proportional versus metric grouping.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz: score generation with L-systems](https://algorithmicbotany.org/papers/score.icmc86.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
