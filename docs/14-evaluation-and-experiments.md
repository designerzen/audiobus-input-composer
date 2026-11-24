# 14 — Evaluation: correct events, coherent music, useful control

No implementation benchmark or listening study has been run for this Input. The following is a proposed validation programme. Inclusive City's [evaluation discussion](../../inclusive-city/docs/generative-music-research.md) provides a useful distinction between regression checks and perceived musical improvement.

The expanded review adds [specific open gaps and ordered experiments](26-research-gaps-and-experiment-programme.md), [semantic adapter fixtures](20-pattern-semantics-and-live-editing.md) and [authority-mode comparisons](23-collaboration-machine-agency-and-legibility.md). These refine the general programme below without claiming that the studies have been run.

## Event correctness

For the eventual engine, establish deterministic composition under reordered bar queries, stable event IDs across overlapping queries, finite values, positive gates, bounded ranges and correct meter handling. Verify note release on stop, output change, seek, disconnect and suspension. Test same-pitch overlap explicitly under the chosen delivery policy.

Test tempo-map conversion over segment boundaries and ramps; triplets; odd meters; control changes exactly on a boundary; and a late asynchronous result from an obsolete revision. A two-minute test on the main development machine is insufficient evidence of long-session reliability.

These are meaningful future engine tests. This documentation task only validates files, links and source manifests; it does not invent application test results.

## Symbolic musical diagnostics

| Measure | What it can reveal | What it cannot prove |
| --- | --- | --- |
| Attacks per beat, per part and aggregate | Whether density controls work and budgets hold | Perceived energy or quality |
| Simultaneous-note distribution | Texture and polyphony changes | Whether voices sound distinct |
| Interval and contour distribution | Identity tendencies and excessive leaps | A memorable melody |
| Voice-leading movement and crossings | Discontinuity or range problems | Stylistic correctness in every practice |
| Cadence completion / resolution obligations | Whether planned endings and dissonances resolve | That every ending is satisfying |
| Motif recurrence and transformation distance | Whether material returns and changes | Listener recognition |
| Harmonic vocabulary and duration | Stagnation or uncontrolled harmonic turnover | Emotional meaning |
| Silence and part occupancy | Whether arrangement leaves space | Whether silence is placed convincingly |
| Context-model surprise | Predictability relative to one model | Universal novelty, pleasure or emotion |

Record distributions and section-conditioned values, not just a single session average. A good contrast section can be deliberately sparse. A cadence can be deliberately predictable. Optimizing every bar toward the same average would defeat form.

## Controlled listening comparisons

Use a stable external renderer, matched level handling and fixed score seeds. Randomize and blind presentation order. Evaluate several complete arcs and later excerpts; opening-only comparisons miss identity drift and exhausted variation. Recruit varied musical backgrounds and document familiarity with each profile.

Ask separate questions: coherence, motif recognition, appropriate variation, perceived energy, intended expression, control responsiveness and personal preference. Ask felt emotion separately from perceived expression. Do not define a participant's disagreement as a failed listener.

Use repeated participants and pieces, plan analysis and sample size before collection, and report uncertainty and individual variation. Short exploratory pilots can identify poor mappings but should not be reported as definitive validation.

## Ablation experiments

1. **Form:** same note vocabulary and seed family, explicit sections versus local generation alone. Test long-range continuity and return recognition.
2. **Memory:** bounded recall versus newly sampled material at every section. Test theme recognition and fatigue.
3. **Identity:** persistent contour/articulation profile versus independent phrase profiles. Include early and late excerpts.
4. **Energy:** density-only versus coordinated accents/articulation/arrangement, with tempo fixed. Test controllability and clutter.
5. **Affect:** valence and arousal varied independently, with matched instrumentation. Compare profile-specific mappings.
6. **Arrangement:** independent parts versus a shared budget and lead-aware answering. Test foreground clarity and dialogue.
7. **Models:** procedural baseline versus optional validated model proposals. Count deadlines, rejection rate and musical preference.

Vary one architectural mechanism at a time. Match candidate-generation budgets where possible. A model with more compute, more training data and different sound rendering cannot isolate the effect of its architecture.

## Responsiveness measurements

Record observation time, accepted control time, effective musical boundary, composition completion, enqueue time and dispatch time. Throughput is how much future music can be generated per second; responsiveness is how soon an accepted change affects output. Both matter, but they are different measurements.

Without receiver acknowledgements or recorded output, protocol dispatch time is not audible-onset time. Report the boundary of measurement honestly. A future timing extension should include a strategy for measuring receiver behaviour and clock offset.

## Long-session and musician review

Run sessions across seeds, control trajectories and device conditions. Review recurring failure patterns: tonic fixation, all-parts density rises, lost motifs, unresolved endings and repeated fallback cadences. Invite musicians to annotate why a passage works or fails, then translate recurring observations into testable rule changes.

Preserve successful seeds and rejected examples together. A collection containing only attractive demos hides the generator's actual reliability.
