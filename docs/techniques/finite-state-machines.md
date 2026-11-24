# T049 — Finite-state arrangement machines

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use explicit states and guarded transitions to control behaviour.

## Proposed symbolic-music use

Define sparse, moving, intense and closing textures, each with part permissions and minimum residence time.

## Worked example or experiment setup

Enter intense above energy .7 and leave below .5; a separate finish request moves toward closing at the next valid boundary.

## Time, emotion and energy

Energy drives guarded transitions; emotion changes state realization; elapsed bars enforce residence and ending reachability.

## Failure modes and practical limits

Threshold flicker and unreachable states create unstable arrangements. State names should not claim measured human emotions.

## Evaluation

Exercise threshold crossings, rapid controls and finish requests; compare against an unguarded threshold controller.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [BehaviorTree.CPP: behaviour-tree framework](https://www.behaviortree.dev/docs/intro/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
