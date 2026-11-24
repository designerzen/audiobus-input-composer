# 15 — Implementation roadmap and unresolved decisions

This is a proposed sequence, not a claim that implementation has begun. Each phase has a reviewable musical outcome.

The expanded live-coding review refines this roadmap: establish [event and editing semantics](20-pattern-semantics-and-live-editing.md) before selecting an engine; evaluate a [player/conductor policy](22-autonomous-conductor-and-dramaturgy.md) independently from notation; and use the [gap-driven experiment sequence](26-research-gaps-and-experiment-programme.md) to resolve the remaining design hypotheses.

## Phase 1 — A trustworthy symbolic core

The primary interface is decided: adapt the [PhotoSYNTH Plutchik star](18-plutchik-interface.md), with separate Energy and explicit transport controls. Build its emotion-selection adapter alongside the symbolic core, retaining the original geometry and accessible alternatives.

Build a versioned score schema, rational beat representation, explicit seeded random keys and one authored motif. Generate melody and bass under a single tonal profile with a finite phrase ending. Save and replay the resolved score. Keep sound rendering external.

**Exit condition:** repeated and reordered composition requests agree; phrase targets survive; every note has a release. A saved score preserves the actual performance decisions without requiring generation again.

## Phase 2 — A playable AudioBus connection

Confirm the actual host Input interface and clock authority. Add a narrow protocol adapter, dedicated part/channel mapping and a lifecycle ledger. Measure dispatch lateness and interruption behaviour. The inspected protocol provides no future-note timestamp; resolve that constraint explicitly before claiming precise remote lookahead.

**Exit condition:** stop, disconnect, seek and output change leave no owned stuck notes. Background/resume follows a documented policy. The composer never silently overrides a host-owned tempo.

## Phase 3 — Energy as a useful musical gesture

Add density caps, accents, articulation and selective layer entrances. Smooth controls and show when queued changes take effect. Keep harmony and tempo lockable so energy mapping can be studied independently.

**Exit condition:** low/high energy settings produce explainable score changes; aggregate density stays within bounds; a musician can steer an arc without manually editing notes.

## Phase 4 — Form, memory and development

Introduce statement/development/contrast/return, motif transformations and bounded recall. Store transformation provenance and commit memory only when its defined boundary is reached. Add an explicit cadence request and finite-ending mode.

**Exit condition:** late passages can be traced to earlier motifs, optional notes yield to phrase goals, and contrast does not erase identity. Run the form and memory comparisons in [14](14-evaluation-and-experiments.md).

## Phase 5 — Calibrated affect and additional practices

Add valence/arousal/tension profiles with user-adjustable mappings. Evaluate the first profile before multiplying style presets. Expand through authored or collaboratively developed grammars, not just more scale names.

**Exit condition:** documented listener evidence supports specific mappings within stated conditions; uncertain mappings remain labelled as such. Different controls produce distinguishable changes.

## Phase 6 — Optional learned proposals

Only add a symbolic model to address an observed limitation, such as thin phrase vocabulary. Keep procedural fallback, deadlines, revision checks and score validation. Document checkpoint provenance and distinguish model license, training data and generated-output questions.

**Exit condition:** the added system improves an agreed musical criterion enough to justify its runtime and complexity, without weakening control or reliability.

## Decisions to settle before implementation

| Decision | Recommended initial assumption | What could change it |
| --- | --- | --- |
| AudioBus target | Local protocol ecosystem, verified against actual host | A different host or Input plugin contract |
| First profile | Clearly named 12-TET tonal profile | An explicitly chosen repertoire or collaborator |
| Tempo ownership | Host if available; otherwise explicit composer master | Required external hardware synchronization |
| Autonomy | Continuous performance with interruptible phrase plans | A primarily offline composition workflow |
| Duration | Endless mode plus explicit finite cadence | A fixed-length song requirement |
| Emotion input | User-supplied expressive intention | A separately validated inference source |
| Primary interface | PhotoSYNTH's Plutchik star for emotion/intensity, separate Energy | User-directed changes to this selected interface |
| Replay | Save actual score and control log | Stronger requirements for generative state seek |
| Models | Procedural baseline first | Measured vocabulary or continuation limitation |
| Microtonality | Preserve schema room; semitone output initially | A chosen tuning practice and compatible receiver |

## Research questions worth preserving

How much motif preservation is needed before a transformation is heard as related? Can accent and arrangement changes express energy while density stays constant? When does an adaptive harmonic transition feel responsive rather than disruptive? Which long-form decisions should be authored, learned or user-steered? How much explanation helps a performer without drawing attention away from listening?

The most useful next artifact is a small composer that makes a few choices well and records them transparently. Its limitations can then guide additional research more effectively than adding every available algorithm at once.
