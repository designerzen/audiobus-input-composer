# M13 — A theory-first pipeline

[Theory index](README.md). Reviewed 24 November 2026. Complements [combining techniques](../techniques/COMBINING.md) and the [proposed architecture](../11-composer-architecture.md).

## Principle

Let **theory decide structure and meaning**; let **engines supply variety** inside the slots theory defines. Every layer below hands the next a smaller, already-coherent problem.

```text
Plutchik region + intensity + Energy
            │
            ▼
1. Dramaturgy / form          (22 conductor; M10 layering; M05 key regions)
            │  sections, key regions, active roles
            ▼
2. Phrase functions           (M06 sentence/period; cadence ladder)
            │  slots: BI@1, CI@5, cadence:HC@4, PAC@8
            ▼
3. Schema chain               (M01 Markov/grammar over schemata)
            │  bass + melody skeleton degrees per bar
            ▼
4. Harmony                    (rule of the octave → M08 rewrites → M07 voice leading)
            │  chords, voicings
            ▼
5. Melody surface             (M03 elaboration of skeleton; M11 contour/motif memory)
            │  notes + durations
            ▼
6. Counter / bass / textures  (M02 species; M10 roles, bass rules, hocket)
            ▼
7. Rhythm & feel              (M09 syncopation target, groove template, accents)
            ▼
8. Tension check & select     (M04 composite T vs target curve; pick best of N)
            ▼
   resolved symbolic events → scheduler (chapter 12)
```

Steps 3–7 can each be filled by existing engines: Markov chains choose schema tokens and elaboration operators; [MAP-Elites](../techniques/map-elites.md) keeps a library of elaborations differing in syncopation and contour; [constraint programming](../techniques/constraint-programming.md) realises species rules; [cellular automata](../techniques/elementary-cellular-automata.md) can drive hocket masks or ornament gates within role constraints.

## Control routing summary (proposal)

| Decision | Emotion picks… | Energy sets… |
| --- | --- | --- |
| Mode / tonal clarity (M05) | brightness position | walk width; key-profile γ |
| Phrase type & cadence (M06) | cadence type | phrase extension, fragmentation rate |
| Schema choice (M01) | opening/answer families | Monte vs Fonte bias |
| Harmony (M07, M08) | functional vs parsimonious; rewrite types | rewrite depth; harmonic rhythm |
| Surface (M03, M11) | operator weights; contour shape | elaboration depth; range; leap rate |
| Counterpoint (M02) | species override (e.g. suspensions) | species level |
| Texture (M10) | call/response style | number of roles; register spread |
| Rhythm (M09) | swing/feel template | syncopation index |
| Tension target (M04) | curve shape | curve amplitude/baseline |

## Worked sketch — "Anticipation, intensity 0.7, Energy 0.5"

1. Form: build section; three roles active (pulse, bass, pad) with melody entering at bar 5.
2. Phrase: sentence; first cadence half (HC), second phrase extended by a deceptive cadence and one-more-time.
3. Schemata: Do-Re-Mi → Monte → Ponte (dominant pedal, 2 bars) → cadence.
4. Harmony: rule of the octave; rewrite depth 1 → secondary dominant before the Monte's second step.
5. Surface: elaboration depth 2; operators favour appoggiatura and anticipation; ascending contour.
6. Counter: species 4 (suspensions) above the Ponte pedal.
7. Rhythm: syncopation index mid; anacrusis into bar 9; fill in bar 8 beat 4.
8. Tension: target rises across bars 1–8, dips slightly at the deceptive cadence, peaks at bar 10, resolves at bar 12; choose best of 8 candidates per bar.

## What to build first

1. Phrase-slot planner + cadence ladder (M06) — small, deterministic, immediately improves endings.
2. Rule-of-the-octave harmoniser + schema table (M01) — lookup-based, real-time safe.
3. Elaboration tree (M03) with motif memory — gives variation-with-identity.
4. Composite tension scorer (M04) — makes every later engine steerable by the interface.

Each step is testable in isolation with fixed seeds, following [evaluation and experiments](../14-evaluation-and-experiments.md).

## Evidence boundary

This pipeline is a design proposal. It has not been implemented or listened to. Its layers are grounded in the cited theory, but the control routing is original and should be tested against simpler baselines.
