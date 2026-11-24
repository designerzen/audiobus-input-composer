# T033 — Brian’s Brain

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Use off, firing and refractory states; off cells fire with two firing neighbours, and firing cells become refractory.

## Proposed symbolic-music use

Emit attacks only on entry to firing. Refractory states prevent an immediate retrigger at the same location.

## Worked example or experiment setup

A firing cell is refractory at the next generation and off at the following one; it cannot fire again during the refractory step.

## Time, emotion and energy

Energy controls accepted trigger count; emotion selects contour and gates; retain a generation clock independent from note releases.

## Failure modes and practical limits

A births-only rhythm may still become too dense. Treating refractory cells as active neighbours changes the rule.

## Evaluation

Verify the state cycle and neighbour counting; compare repeated-note spacing with binary Life at matched density.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: Generations and refractory states](https://golly.sourceforge.io/Help/Algorithms/Generations.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
