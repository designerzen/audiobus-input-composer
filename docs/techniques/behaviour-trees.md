# T050 — Behaviour trees for a musical conductor

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Compose conditions and actions through success, failure and running states.

## Proposed symbolic-music use

Prioritize Stop, cadence obligations, human turn-taking and optional development through a readable decision tree.

## Worked example or experiment setup

Try satisfy-ending first; otherwise preserve-human-lead; otherwise choose one developmental action. Running actions retain their state.

## Time, emotion and energy

Emotion affects action preferences; energy affects budgets; the tree ticks at planning boundaries, not for every audio sample.

## Failure modes and practical limits

A tree can repeatedly restart an action or starve lower priorities. Running-state cancellation must release owned notes.

## Evaluation

Log branches and cancellation paths; compare decisions against a fixed scenario set and musician annotations.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [BehaviorTree.CPP: behaviour-tree framework](https://www.behaviortree.dev/docs/intro/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
