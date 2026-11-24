# T072 — SAT/SMT-style symbolic composition

Family: **Constraints graph search and optimization**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Express decisions through logical variables and satisfiability constraints.

## Proposed symbolic-music use

Represent whether a note occupies a slot, whether a voice crosses another and whether a prepared dissonance resolves.

## Worked example or experiment setup

An implication can state that an accented non-chord event requires a suitable resolution in one of the next two slots.

## Time, emotion and energy

Emotion selects permitted obligations; energy bounds active slots; use a finite phrase horizon.

## Failure modes and practical limits

Boolean encoding can become large. A satisfiable assignment can remain musically dull; SMT and SAT solver contracts differ.

## Evaluation

Use hand-checkable miniature scores and contrast satisfiability with independent musical-quality evaluation.

## AudioBus integration

Run within a finite horizon and computation budget. Keep a feasible fallback and distinguish a mathematical objective from listener preference.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [OR-Tools: integer constraint solving](https://developers.google.com/optimization/cp/cp_solver)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
