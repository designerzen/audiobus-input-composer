# T088 — Tintinnabuli-inspired constrained pairing

Family: **Musical transformations and combinatorics**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Pair a melodic line with pitches selected by a declared triadic relationship.

## Proposed symbolic-music use

Create an experimental companion voice that chooses the nearest eligible triad tone above or below each melodic pitch.

## Worked example or experiment setup

Against C-major triad classes, D4 can pair with E4 under an above-nearest rule or C4 under a below-nearest rule.

## Time, emotion and energy

Emotion chooses the companion rule and triad vocabulary; energy controls entry and gate; harmony remains explicit.

## Failure modes and practical limits

This simplified proposal does not reproduce a composer’s full practice. Constant pairing can create excessive homorhythm.

## Evaluation

Check directional selection and compare paired voices with independent counterlines at equal polyphony.

## AudioBus integration

Preserve the source motif and transformation history. Recheck harmony, meter and note ownership after every transformation.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Arvo Pärt Centre: formal tintinnabuli algorithms](https://www.arvopart.ee/en/arvo-part/article/formal-algorithms-of-tintinnabuli-in-arvo-parts-music/)
- [Tonal: music-theory implementation](https://github.com/tonaljs/tonal)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
