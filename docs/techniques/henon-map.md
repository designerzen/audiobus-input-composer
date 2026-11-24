# T052 — Henon-map symbolic control

Family: **Dynamical systems and mathematical sequences**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Iterate a two-dimensional nonlinear map, conventionally x_next=1-a*x*x+y and y_next=b*x.

## Proposed symbolic-music use

Map two related coordinates to contour centre and rhythmic-cell preference, using measured normalization bounds.

## Worked example or experiment setup

Compute both next coordinates from the old state. Updating y from the new x changes the map.

## Time, emotion and energy

Energy bounds emitted activity; emotion selects allowed cells; sample at declared beat or bar intervals.

## Failure modes and practical limits

Some parameters diverge; attractor shape does not establish musical form. Fixed min-max assumptions can clip rare excursions.

## Evaluation

Check finite bounded trajectories and coordinate-update order before testing heard correlation between musical dimensions.

## AudioBus integration

Retain the numerical state, precision and sampling policy. Treat trajectories as proposed musical controls, with a separate harmonic and phrase model.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [JuliaDynamics: defined maps and flows](https://juliadynamics.github.io/PredefinedDynamicalSystems.jl/stable/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
