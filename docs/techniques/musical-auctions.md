# T070 — Resource auctions and role allocation

Family: **Agents swarms and ecosystems**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Allocate limited resources among agents through an explicit bidding or priority mechanism.

## Proposed symbolic-music use

Treat foreground slots, register space and attack budgets as resources requested by musical parts.

## Worked example or experiment setup

The lead requests a phrase-ending slot and outranks an optional counterline; an aged unserved answer can gain priority later.

## Time, emotion and energy

Energy sets total resources; emotion affects eligible roles; allocation happens at phrase boundaries.

## Failure modes and practical limits

Poor priority rules can starve a part or always privilege dense generators. Winning is not an aesthetic proof.

## Evaluation

Inspect allocations, starvation and heard foreground clarity against an independent-part baseline.

## AudioBus integration

Use a shared coordinator to cap activity and preserve foreground roles. Simulation interaction is not automatically musical cooperation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Mesa: agent-based simulation framework](https://mesa.readthedocs.io/stable/)
- [OR-Tools: integer constraint solving](https://developers.google.com/optimization/cp/cp_solver)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
