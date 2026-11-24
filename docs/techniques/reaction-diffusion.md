# T039 — Gray–Scott reaction-diffusion

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Couple local reaction and spatial diffusion of two concentration fields.

## Proposed symbolic-music use

Use connected regions and threshold-crossing fronts to create phrase activity or spatially organized symbolic voices.

## Worked example or experiment setup

Sample four fixed regions at phrase boundaries and assign each an activity rank. Avoid turning thousands of simulation cells into simultaneous notes.

## Time, emotion and energy

Energy bounds active musical regions; emotion selects register and articulation; feed/kill changes are slow experimental controls.

## Failure modes and practical limits

Simulation parameters have nonlinear regime changes. A stable visual pattern may produce static musical output.

## Evaluation

Test numerical stability, region extraction and density caps before comparing musical trajectories with simple envelopes.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Karl Sims: Gray–Scott reaction diffusion](https://www.karlsims.com/rd.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
