# T064 — Predator–prey musical populations

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Couple populations through growth, resource use and predation or an analogous interaction.

## Proposed symbolic-music use

Map slowly changing populations to competing phrase textures, not individual animal-like notes.

## Worked example or experiment setup

A rising ornament population increases activity while a suppressor population later thins it, producing an experimental long arc.

## Time, emotion and energy

Energy caps realized notes independently of population; emotion changes mapping; freeze the simulation-to-bar time scale.

## Failure modes and practical limits

Extinction, runaway growth and numerical oscillation may dominate. An ecological metaphor does not supply harmonic meaning.

## Evaluation

Check positivity and boundedness, then compare the activity arc with a deliberately authored rise-and-fall envelope.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Wilensky: Wolf Sheep Predation model](https://ccl.northwestern.edu/netlogo/models/WolfSheepPredation)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
