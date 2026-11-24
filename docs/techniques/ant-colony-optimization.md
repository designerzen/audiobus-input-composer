# T062 — Ant-colony-inspired phrase routing

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Reinforce promising graph routes with a decaying shared trail.

## Proposed symbolic-music use

Let candidate agents explore chord or motif routes, depositing bounded preference on routes meeting phrase goals.

## Worked example or experiment setup

A route resolving a cadence receives trail reinforcement, while evaporation prevents its edges from permanently dominating.

## Time, emotion and energy

Energy changes rhythm realization; emotion changes route desirability; exploration runs before phrase commitment.

## Failure modes and practical limits

Early random advantages can become lock-in. Trail strength is an internal search signal, not a judgment of artistic value.

## Evaluation

Compare route diversity and target attainment with ordinary weighted graph walks at the same evaluation budget.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Dorigo: Ant Colony Optimization](https://iridia.ulb.ac.be/dorigo/ACO/about.html)
- [NetworkX: shortest-path algorithms](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
