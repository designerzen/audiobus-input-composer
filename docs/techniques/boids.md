# T061 — Boids and flocking

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Combine local separation, alignment and cohesion rules for moving agents.

## Proposed symbolic-music use

Map agent height to register and group alignment to shared rhythmic direction; keep each agent assigned to a bounded musical role.

## Worked example or experiment setup

Three agents converge in contour direction while separation prevents them all selecting the same register slot.

## Time, emotion and energy

Emotion chooses attraction targets and phrase vocabulary; energy controls accepted attacks; time schedules sampled states.

## Failure modes and practical limits

Physical closeness is not harmonic consonance. Mapping every simulation step to an attack creates overwhelming output.

## Evaluation

Compare collective motion features with actual interval and rhythm relationships at a fixed polyphony cap.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Craig Reynolds: Boids](https://www.red3d.com/cwr/boids/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
