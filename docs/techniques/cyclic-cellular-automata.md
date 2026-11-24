# T034 — Cyclic cellular automata

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Cells advance through an ordered set of states when neighbourhood conditions favour the next state.

## Proposed symbolic-music use

Map state to a motif family or harmonic colour and state changes to attacks, creating moving symbolic waves.

## Worked example or experiment setup

With states 0,1,2, a cell may advance 2 to 0 when the required neighbouring zeros are present. Specify the threshold and neighbourhood.

## Time, emotion and energy

Energy limits extracted events; emotion selects the state-to-music palette; section time controls when the palette may change.

## Failure modes and practical limits

The spatial wave does not supply a cadence. Similar state counts can conceal very different wave geometry.

## Evaluation

Compare state occupancy and transition counts with the actual phrase trace; test fixed and wrapped boundaries.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: rule implementations](https://golly.sourceforge.io/Help/Algorithms/RuleLoader.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
