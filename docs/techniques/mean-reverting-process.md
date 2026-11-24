# T006 — Mean-reverting stochastic control

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Combine random perturbation with attraction toward a reference value.

## Proposed symbolic-music use

Drive register centre, gate ratio or ornament preference toward a profile target while allowing temporary excursions.

## Worked example or experiment setup

Use x_next=x+theta*(mu-x)*dt+sigma*sqrt(dt)*z, then map x to a bounded control. This is a numerical proposal, not an exact continuous-time simulator.

## Time, emotion and energy

The emotion selects mu; energy selects a bounded fluctuation range; time determines dt and target transitions.

## Failure modes and practical limits

Large integration steps can destabilize the process. Rounding continuously to a pitch can create repetitive threshold chatter.

## Evaluation

Check time-step sensitivity, recovery after perturbation and whether continuous variation survives musical quantization.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [SciPy: probability distributions](https://docs.scipy.org/doc/scipy/reference/stats.html)
- [SciPy: filtering sequences](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.lfilter.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
