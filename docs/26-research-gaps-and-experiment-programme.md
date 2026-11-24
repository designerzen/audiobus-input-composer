# 26 — What is still missing, and how to investigate it

Expanding a reference list is not enough. The first research pass left decisions under-specified, and even the expanded library cannot substitute for implementation experiments and listening. This is a prioritized gap analysis for the symbolic composer, not a declaration that all algorithmic-music research is incomplete.

## Gap 1 — The exact musical practice

“Programmatic music” spans many grammars; “Algorave” does not specify harmony, metre or phrase form. Choose a first repertoire/profile and state its assumptions. Develop one groove-centred tonal profile and one nonfunctional/cyclic profile to reveal architectural assumptions that a single style would hide.

**Experiment:** keep motif size and event budgets comparable across profiles. Check whether cadence rules, degree mappings and arrangement roles remain meaningful. Do not judge a drone profile by dominant-tonic resolution frequency.

## Gap 2 — What density means

Attacks per beat, active subdivisions, simultaneous notes and sustained occupancy are different. Twelve attacks can be evenly distributed, clustered at a phrase ending or divided among competing voices.

**Experiment:** author matched-density phrases with different distributions and role assignments. Measure attacks, overlap and rests separately; ask perceived energy and clarity. This tests whether Energy can be calibrated beyond counting notes. The density/player lineage in [21](21-system-comparison-and-adoption.md) is a useful precedent, not the answer itself.

## Gap 3 — A semantics-preserving adapter

A library can generate events successfully while its adapter alters articulation, harmony boundaries or note identity. The [fixtures in 20](20-pattern-semantics-and-live-editing.md) should precede any integration choice.

**Experiment:** implement the same short event specification natively and through one candidate pattern adapter. Compare exact rational onsets, original spans, gates and attack identities. For differences, decide which interpretation is musically intended rather than forcing string-level compatibility.

## Gap 4 — The conductor's objective

Coherence, target expression, surprise and controllability can conflict. A scalar aesthetic reward can encourage an engine to repeat a safe pattern indefinitely or overproduce conspicuous changes.

**Experiment:** compare fixed form, random eligible actions and the bounded conductor from [22](22-autonomous-conductor-and-dramaturgy.md). Preserve the same material vocabulary and seed family. Use full arcs and later excerpts. Report separate criteria rather than declaring one global winner from a single rating.

## Gap 5 — The Plutchik mapping

The diagram defines selectable labels; it does not establish how those labels should sound. The explicit path aliases solve interface identity, not musical calibration. Family, strength and Energy must remain distinguishable.

**Experiment:** within each family, vary intensity at fixed energy; then vary energy at fixed family/intensity. Use matched seeds, profile and renderer. Ask perceived expression, perceived activity and personal feeling separately. Include an “unclear/other” response so participants are not forced into the interface's vocabulary.

## Gap 6 — Continuous movement between categorical choices

Dragging from Joy to Anger can cross several regions quickly. Applying every intermediate target creates obsolete musical transitions. Jumping directly can feel unresponsive if the last target waits a whole section.

**Experiment:** compare latest-target-at-boundary, smoothed family preference weights and explicit two-family blending. Log requested, pending and effective states. Measure perceived responsiveness and continuity as different outcomes. Retain the family identities in blended states; opposed selections need not mean a neutral intention.

## Gap 7 — Expressivity after symbolic delivery

Velocity and gate patterns change meaning across receiving instruments. The composer has no basis for claiming actual dynamic balance merely from normalized velocity.

**Experiment:** replay the same score through a small declared set of receivers. Examine whether intended accents, legato and register roles remain intelligible. Separate renderer sensitivity from composition errors. Do not repair the score globally to compensate for one unusually responsive patch without recording that choice.

## Gap 8 — The symbolic equivalent of sample structure

A live-coded sample trigger can contain an entire rhythm, gesture or harmonic texture. Replacing it with one note may remove the very structure that made the source pattern effective.

**Experiment:** represent a musical cell as a bounded multi-event motif with its own entry/exit conditions. Compare whole-cell transformations with independent note generation. Record whether the useful effect came from the pattern operation, the authored cell or their interaction.

## Gap 9 — Cooperation with a person

An autonomous solo generator and a good accompanist solve different problems. A response slot can vanish when a person continues their phrase. The system needs role ownership and a policy for yielding.

**Experiment:** use recorded symbolic input with predictable pauses, then with extended phrases and interruptions. Compare fixed answers with defer/shorten/yield policies. Ask dialogue quality and control, while measuring overlaps and late responses. Move to live duet trials only after the lifecycle behaviour is reliable.

## Gap 10 — Local versus long-term learning

Session memory, explicit preference storage and a trained stylistic model are distinct. An engine should not treat every Stop or Undo as a negative example of the played notes.

**Experiment:** first use explicit session-only feedback categories: wrong timing, too dense, lost theme, unwanted harmony or dislike. Investigate whether those signals support useful corrections before adding durable learning. Test forgetting and reset as actual user tasks.

## Gap 11 — Network and output authority

Shared state, shared beat position and shared receiver control need separate contracts. AudioBus's present immediate-message protocol cannot be treated as a timestamped event queue.

**Experiment:** instrument dispatch and receiver behaviour where possible. Test delayed messages, reconnects and cancelled revisions. Record which claims concern symbolic time, sender dispatch or actual audible response. Add a scheduling capability only if target measurements justify it.

## Gap 12 — A useful evaluation corpus

Short attractive demos hide failures. Save successful and unsuccessful sessions with their control traces, active program revisions, resolved events, action reasons and listener annotations.

**Experiment:** create a fixed scenario set: stable target; gradual energy arc; abrupt emotion change; repeated rapid selections; long-held target; requested ending; interrupted answer; and reconnect. Include multiple seeds and both initial profiles. Keep scenario IDs stable so changes can be compared over time.

## A compact sequence of investigations

| Order | Investigation | Evidence produced | Decision it enables |
| --- | --- | --- | --- |
| 1 | Event semantics and lifecycle | Exact trace comparisons | Choose a native core or pattern adapter |
| 2 | Density/role vocabulary | Symbolic diagnostics and listening pilot | Define meaningful Energy controls |
| 3 | Conductor comparison | Whole-arc ratings and action logs | Decide which structural autonomy helps |
| 4 | Plutchik calibration | Family/intensity/energy judgments | Revise mapping profiles |
| 5 | Human duet and interruption | Turn-taking and recovery evidence | Define accompaniment authority |
| 6 | Cross-receiver and network trials | Delivery and expression limits | Define supported integrations |

These are proposed experiments; none has been run for this Input. The architecture should make their results observable. Until then, terms such as coherent, expressive, responsive and accessible are design aims whose evidence must be stated specifically.
