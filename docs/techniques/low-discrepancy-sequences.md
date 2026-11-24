# T009 — Low-discrepancy and quasi-random exploration

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Generate deterministic points that cover a parameter space more evenly than ordinary independent sampling in a specified sense.

## Proposed symbolic-music use

Explore combinations of motif transformation, register and density when building an audition library.

## Worked example or experiment setup

Use a two-dimensional Sobol design to audition register spread and gate ratio, then compare coverage with the same number of random proposals.

## Time, emotion and energy

Emotion selects a region of the library; energy selects its density coordinate; time orders the selected transitions musically.

## Failure modes and practical limits

Coverage is not musical variety. Sobol balance properties require attention to sample counts and sampling method.

## Evaluation

Measure parameter coverage and duplicate realized scores; listen after arranging candidates into phrases.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: Sobol sequences](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.qmc.Sobol.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
