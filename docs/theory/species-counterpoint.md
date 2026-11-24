# M02 — Species counterpoint as a constraint program

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

Fux's *Gradus ad Parnassum* (1725) teaches two-voice writing in five **species** against a fixed *cantus firmus* (CF):

| Species | Rhythm against CF | New permission |
| --- | --- | --- |
| 1 | note against note | consonances only |
| 2 | two against one | passing dissonance on weak beats |
| 3 | four against one | neighbour notes, cambiata |
| 4 | syncopated (tied) | suspensions: prepared, dissonant on strong beat, resolved down by step |
| 5 | florid (mixed) | all of the above, plus decoration |

The rules are explicit: begin and end on perfect consonances; no parallel fifths or octaves; prefer contrary motion; limit leaps and recover them by step in the opposite direction; approach the final by step (7–1 / 2–1).

Computer realisations are old and well documented: Schottstaedt's *Automatic Species Counterpoint* (CCRMA report STAN-M-19, 1984) expressed Fux as weighted penalties searched by best-first search; Ebcioğlu's CHORAL (Computer Music Journal 12(3), 1988) extended the approach to Bach chorale harmonisation with a backtracking rule system.

## Proposed symbolic use

- **Hard rules** → constraints in [constraint programming](../techniques/constraint-programming.md) or [SAT/SMT](../techniques/sat-and-smt.md).
- **Preferences** (contrary motion, stepwise motion, range variety, climax once) → weighted costs searched with [beam search](../techniques/beam-search.md) or [dynamic programming](../techniques/dynamic-programming.md). A two-voice species-1 line over a 12-note CF with ~8 candidate pitches per step is trivially solvable per phrase.
- **The CF can be anything** the composer already has: a schema bass (M01), a motif, a user-played line, or a sustained note from another AudioBus input. The species engine adds an answering voice.

## A ladder for Energy (proposal)

Species order is a ready-made monotone scale of rhythmic activity *and* dissonance licence:

```text
energy 0.0–0.2 → species 1   (calm, consonant, homorhythmic)
energy 0.2–0.4 → species 2
energy 0.4–0.6 → species 4   (suspensions: expressive tension without speed)
energy 0.6–0.8 → species 3
energy 0.8–1.0 → species 5
```

Placing species 4 below 3 is deliberate: suspensions create emotional tension at low note rate, suiting Sadness and Anticipation. Emotion can override the order — for example Sadness at any energy weights species 4.

## Failure modes

Strict Fux is modal and vocal; in loop-based electronic contexts the "no parallel fifths" rule may be unwanted (power chords). Rule sets must be profile-scoped (see chapter [04](../04-music-theory-as-rules.md)). Over-constrained short phrases can be unsatisfiable; always keep a relaxation order.

## Evaluation

Rule-violation counts per phrase (should be zero for hard rules); distribution of motion types (contrary/oblique/similar/parallel); A/B listening against a random-consonant line.

## Sources

- Fux, J. J. (1725). *Gradus ad Parnassum*; trans. Mann, *The Study of Counterpoint* (Norton, 1965).
- Schottstaedt, W. (1984). *Automatic Species Counterpoint*. Stanford CCRMA report STAN-M-19.
- Ebcioğlu, K. (1988). An expert system for harmonizing four-part chorales. *Computer Music Journal* 12(3), 43–51. <https://doi.org/10.2307/3680335>
