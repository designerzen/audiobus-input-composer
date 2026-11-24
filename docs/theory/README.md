# Music theory as generative machinery

Reviewed 24 November 2026. [Research index](../README.md) · [Technique index](../techniques/README.md).

## Why this folder exists

The 115 technique studies are mostly **engines**: Markov chains, evolution, automata, grammars and solvers. Chapter [04](../04-music-theory-as-rules.md) turns basic scales, harmony and voicing into decisions. A gap audit of the library found almost no coverage of the theory that musicians themselves use to *make* music, rather than to analyse it:

| Searched for | Hits before this folder |
| --- | --- |
| Galant schemata, partimento, rule of the octave | 0 |
| Species counterpoint (Fux) | 0 |
| Schenkerian prolongation, GTTM reductions | 0 |
| Narmour, Huron, expectation (ITPRA) | 0 |
| Lerdahl tonal pitch space, tonal tension models | 0 |
| Krumhansl key profiles, modulation, modal interchange | 0 |
| Caplin phrase functions (sentence, period) | 0 |
| Tymoczko voice-leading geometry, neo-Riemannian theory | 0 (graph walks exist, the geometry does not) |
| Jazz reharmonisation, tritone substitution | 0 |
| Syncopation measures, groove, hemiola, metric modulation | 3 passing mentions |
| Texture roles, hocket, call and response, bass-line construction | 0 |
| Raga, maqam, colotomic cycles | 0 |

The argument of this folder: **theory is a compressed library of generative rules that already encode time, emotion and energy.** A cadence is a time-structure. A deceptive cadence is a planned emotional event. Syncopation and harmonic rhythm are energy controls. An algorithm that ignores this must rediscover it, usually badly, through filtering random output.

## Documents

| ID | Document | What it adds to the composer |
| --- | --- | --- |
| M01 | [Galant schemata and partimento](galant-schemata-and-partimento.md) | Phrase-sized stock patterns (Romanesca, Prinner, Monte, Fonte…) that a composer strings together; the rule of the octave as a complete bass-harmonisation function. |
| M02 | [Species counterpoint as a constraint program](species-counterpoint.md) | Five graded rule sets for adding a line against a given line; a ready-made difficulty/energy ladder. |
| M03 | [Prolongation and reduction: composing top-down](prolongation-and-elaboration.md) | Generate a skeleton, then elaborate with passing, neighbour, arpeggiation and suspension. Variation by re-elaborating the same skeleton. |
| M04 | [Expectation and tension models](expectation-and-tension.md) | Narmour, Huron's ITPRA, Lerdahl's tonal pitch space and tension curves; a computable "tension" signal that Emotion and Energy can target. |
| M05 | [Key, modulation and modal colour](key-modulation-and-modal-colour.md) | Key profiles, pivot modulation, tonicisation, modal interchange and brightness ordering of modes as emotional levers. |
| M06 | [Phrase functions: sentence, period, cadence](phrase-functions-and-cadences.md) | Caplin's formal functions as a grammar for 4–16 bar units; cadence strength as an ending dial. |
| M07 | [Voice-leading geometry and neo-Riemannian moves](voice-leading-geometry.md) | Chords as points in orbifolds; parsimonious P/L/R moves; "distance" as an emotional and energetic quantity. |
| M08 | [Reharmonisation and jazz substitution](reharmonisation-and-substitution.md) | Rewriting a progression without changing its melody: tritone subs, secondary dominants, ii–V expansion, backdoor; Steedman's grammar. |
| M09 | [Rhythm theory: syncopation, groove and metre play](rhythm-syncopation-and-groove.md) | Measurable syncopation, the groove inverted-U, hemiola, metric modulation, non-retrogradable rhythms, symbolic micro-timing. |
| M10 | [Texture, roles and orchestration logic](texture-roles-and-orchestration.md) | Melody/bass/pad/counter/pulse roles, Huron's voice-leading perception rules, hocket, call and response, bass-line construction. |
| M11 | [Melodic contour and motivic development](contour-and-motivic-development.md) | Contour classes, Schoenberg's developing variation and liquidation, gap-fill and arch shapes. |
| M12 | [Modal systems beyond common practice](raga-maqam-and-cyclic-systems.md) | Raga ascent/descent rules and characteristic phrases, maqam jins and seyir, gamelan colotomy — as constraint shapes, handled with care. |
| M13 | [A theory-first pipeline](theory-first-pipeline.md) | How M01–M12 combine with the existing engines, and which control each one listens to. |

## Ideas that are new to the library

1. **Schema-chaining as the backbone of form.** Instead of a Markov chain over chords, use a Markov chain or grammar over *galant schemata* (M01). Each step emits four to eight bars of already-coherent bass, melody skeleton and cadence. Local engines (Markov, automata) then only decorate.
2. **Tension as the shared currency.** Emotion and Energy both map to a *target tension curve* (M04). Every module proposes candidates; a scorer picks those whose predicted tension tracks the target. This gives one honest, testable link between interface and notes.
3. **Skeleton/surface split for variation.** Repeats re-elaborate the same reduction (M03), so the listener hears identity in the skeleton and novelty in the surface — the old theme-and-variations principle made computational.
4. **Difficulty ladders as energy ladders.** Species 1→5 (M02), elaboration depth (M03), syncopation index (M09) and reharmonisation depth (M08) are ordered scales. Energy can walk them monotonically, which is more musical than scaling note density.
5. **Cadence planning backwards from time.** Because phrase ends are known in advance (M06), the composer can solve harmony backwards from a cadence target, the way partimento players and Schenkerian reductions imply. This is a natural fit for [dynamic programming](../techniques/dynamic-programming.md) and [constrained Markov bridges](../techniques/constrained-markov-bridges.md).
6. **Mode brightness as a continuous emotional axis.** Lydian→Ionian→Mixolydian→Dorian→Aeolian→Phrygian→Locrian differ by one altered degree each (M05); the axis is ordered, reversible and easy to interpolate per phrase.

## Evidence boundary

Sources are theory texts and perception studies cited from bibliographic knowledge; this pass did not re-read them and has not run listening tests. The perception literature (Krumhansl, Huron, Lerdahl & Krumhansl, Witek) is largely Western-listener, common-practice or groove-based research. All mappings from theory to Plutchik regions and to Energy are **proposals**. Each document separates source claims from design inference, following the [evidence conventions](../README.md#evidence-conventions).
