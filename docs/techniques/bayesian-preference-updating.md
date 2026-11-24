# T010 — Bayesian preference updating

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Update a prior belief with explicit observations, retaining uncertainty.

## Proposed symbolic-music use

Learn session-local acceptance rates for optional motifs or actions from deliberate feedback, not from every Stop gesture.

## Worked example or experiment setup

A Beta(1,1) prior plus three accepts and one reject becomes Beta(4,2), with mean 2/3. Feedback quality still determines meaning.

## Time, emotion and energy

Keep separate contexts for profile, emotion and energy; use session time for optional forgetting rather than treating old judgments as permanent.

## Failure modes and practical limits

Acceptance can reflect timing or usability rather than musical taste. Sparse contexts can encourage overconfident personalization.

## Evaluation

Compare calibrated predictive uncertainty and useful recommendations against a fixed-preference baseline.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
