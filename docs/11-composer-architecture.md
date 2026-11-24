# 11 — Proposed composer architecture

Everything in this chapter is a project design proposal. Its main precedents are [Inclusive City's separation of plan and score](02-inclusive-city-lineage.md), [time-query patterns](https://strudel.cc/technical-manual/patterns/), and [constraint-based tension planning](https://arxiv.org/abs/1812.04832).

## Pipeline and ownership

The control interpreter receives emotion/intensity selections from the [Plutchik interface](18-plutchik-interface.md) and Energy independently. Adapt PhotoSYNTH's artwork and interaction patterns to composer-control events; do not route its default chord-pad note events into the autonomous generation pipeline.

1. **Control interpreter:** validate inputs, confidence and timestamps; smooth continuous values; respect locks.
2. **Conductor:** choose sections, phrase goals, density budgets and transition boundaries.
3. **Harmony planner:** choose harmonic path, chord timing, cadence targets and permitted pitch vocabulary.
4. **Motif memory:** select themes and allowed transformations with provenance.
5. **Part composers:** generate melody, bass, harmony, percussion and optional answers.
6. **Arrangement coordinator:** resolve conflicts, allocate silence and enforce shared budgets.
7. **Performance shaper:** apply articulation, accents and bounded groove offsets.
8. **Score validator:** enforce event validity and profile constraints; record relaxations.
9. **Transport adapter:** schedule resolved events and manage note lifecycles.
10. **Recorder/explainer:** save actual decisions, applied controls, score revisions and reasons.

No step should read an unrelated global random stream or advance transport as a side effect of previewing a phrase. The conductor owns compositional decisions; the scheduler owns delivery.

## Internal score sketch

```ts
type Beat = { numerator: number; denominator: number };
type NoteEvent = {
  id: string; sectionId: string; phraseId: string; partId: string;
  start: Beat; duration: Beat;
  pitch: { midi: number; degree?: number; alteration?: number; cents?: number };
  velocity: number; // normalized 0..1; not measured loudness
  articulation: string;
  provenance: { motifId?: string; ruleId: string; transform?: string };
};
```

This is illustrative TypeScript, not an exported API. Add explicit control, rest, harmony and boundary event types rather than putting everything into note records. Decide whether duration is pre- or post-articulation; the recommendation is to store both notated length and final gate length. A score snapshot should carry schema version, generator version, tuning profile and tempo map.

## Planning horizon versus commitment horizon

Plan several bars ahead to give form and accompaniment context. Commit only a short delivery window. A control change may invalidate uncommitted bars but should not rewrite already-performed events. Give each plan a revision, and each asynchronous request a revision token. Discard a late candidate if its harmonic context or revision no longer matches.

Freezing a bar means more than caching notes: freeze the relevant control snapshot, motif selection, harmony and random keys. Otherwise re-querying overlapping windows can produce inconsistent events.

## Pure generation and stateful memory

A useful contract is `composeBar(plan, memorySnapshot, controlSnapshot, seedKey) -> events + proposedMemoryUpdate`. Composition itself is pure. Commit the memory update once at the defined musical boundary. This prevents cache fills, speculation and auditions from teaching the performer things it has not actually played.

For seek, choose between replaying a saved score and resuming generative state from a checkpoint. These are different operations. The initial implementation should prioritize saved-score replay; generative seek can be added only when conductor and memory state are serializable.

## Conflict resolution

Give phrase anchors and cadence obligations higher priority than optional ornaments. Voice ranges are profile-specific. Shared attack budgets prevent five independently “reasonable” generators from creating unreasonable aggregate density. Overlap can be intentional, so a blanket no-overlap rule is too restrictive.

At each conflict, attempt a bounded sequence: alternate voicing → shift optional attack within its allowed slot → shorten an optional gate → remove optional note → use an authored fallback. Record which relaxation occurred.

## Optional models

A worker may propose a continuation from recent resolved notes and planned harmony. It must return before the phrase deadline, pass the same validation, and preserve locked motifs or cadence regions. If it fails, the procedural path remains available. Do not wait for a model inside a timing callback.

## Operational observability

Expose current section, next transition, harmonic region, effective controls, queue horizon, late-event count, active-note count, fallback use and last candidate reasons. These diagnostics help distinguish a poor musical decision from late delivery or a renderer limitation. Keep developer diagnostics separate from simple performer-facing explanations.
