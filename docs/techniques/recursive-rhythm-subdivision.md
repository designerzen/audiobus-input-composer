# T057 — Recursive and fractal rhythmic subdivision

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Recursively replace a time span with smaller spans according to a fixed rule.

## Proposed symbolic-music use

Create nested phrase rhythm while preserving total duration and selected anchor positions.

## Worked example or experiment setup

Split four beats into [2,2], then split only the second half into [1,1], giving onset spans [0,2,3].

## Time, emotion and energy

Energy chooses maximum depth or eligible subdivisions; emotion chooses long-short organization; section position protects cadential space.

## Failure modes and practical limits

Deep recursion produces unplayably short gates and too many attacks. Fractal terminology does not itself explain a listening benefit.

## Evaluation

Check duration conservation and minimum event spacing; compare nested and flat patterns at equal density.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz: score generation with L-systems](https://algorithmicbotany.org/papers/score.icmc86.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
