# T080 — Simulated annealing

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Explore local changes while sometimes accepting worse objective values according to a cooling schedule.

## Proposed symbolic-music use

Refine a valid phrase by changing optional pitches, durations or voicings while protecting anchor obligations.

## Worked example or experiment setup

Try shifting one inner note by a degree; evaluate movement and contour costs before deciding whether to keep the change.

## Time, emotion and energy

Emotion defines the profile objective; energy remains a bound; cooling runs before playback or on future phrases.

## Failure modes and practical limits

A low objective is not artistic quality. Discrete moves and a continuous library implementation require a deliberate adapter.

## Evaluation

Compare with greedy local search at equal proposal counts and preserve the best feasible phrase as fallback.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: dual annealing](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.dual_annealing.html)
- [Herremans and Chew: MorpheuS](https://arxiv.org/abs/1812.04832)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
