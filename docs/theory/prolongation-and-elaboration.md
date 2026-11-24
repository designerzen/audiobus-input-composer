# M03 — Prolongation and reduction: composing top-down

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

Schenkerian analysis reduces tonal music to nested layers: a background line (e.g. 3–2–1 over I–V–I), a middleground and the surface. Each layer is an **elaboration** of the one above by a small set of operations. Lerdahl and Jackendoff's *A Generative Theory of Tonal Music* (GTTM, 1983) formalised related ideas as time-span and prolongational reduction trees with explicit preference rules.

Analysis runs surface → background. **Generation runs the same operations in reverse.**

## Elaboration operators

| Operator | Input | Output (example over C major) |
| --- | --- | --- |
| Passing tone | E → C (a third) | E–D–C |
| Neighbour | E held | E–F–E or E–D–E |
| Arpeggiation | C (as chord I) | C–E–G |
| Consonant skip | E | E–G (within the chord) |
| Suspension | E over a chord change | E held, resolves E→D late |
| Anticipation | D before chord V | early arrival of next note |
| Appoggiatura | D (on V) | E–D, dissonance on the beat |
| Register transfer | C | C5 for C4 |
| Unfolding | two voices | zig-zag between them in one line |

Each operator splits one time-span into two or more shorter spans while preserving the parent note's structural role.

## Proposed algorithm

```text
skeleton = choose background (e.g. 3–2–1 or 5–4–3–2–1) over a cadence plan (M06)
for depth in 1..D:
    for each span longer than minDuration:
        if gate(depth, energy): replace span by operator(span) chosen by weights(emotion)
emit leaves as notes; keep the tree for later variation
```

This is an [L-system](../techniques/parametric-l-systems.md) or [context-free grammar](../techniques/context-free-grammars.md) whose rewrite rules are musically meaningful, and it guarantees structural coherence because every leaf has an ancestor in the skeleton.

## Why this matters for an endless generator

Store the **tree**, not just the notes. On a repeat:

- *Exact repeat*: re-emit leaves.
- *Variation*: keep depth 0–1, re-sample deeper elaborations. The listener hears the same tune decorated differently — classic theme and variations.
- *Development*: transform the skeleton (transpose, invert, sequence via Monte, M01), then re-elaborate.
- *Liquidation* (M11): reduce depth towards the end of a section so the surface thins to the skeleton before a cadence.

## Time, emotion and energy (proposals)

- **Energy → depth and minimum span.** Low energy stops at depth 1 (long notes); high energy recurses to sixteenths.
- **Emotion → operator weights.** Sadness: appoggiaturas, suspensions, descending passing tones. Joy: arpeggiation, upward consonant skips. Fear: chromatic neighbours, unstable appoggiaturas. Trust: neighbours and repetition.
- **Time:** the skeleton is laid out against the phrase grid first, so cadences land exactly on time regardless of surface activity.

## Failure modes

Overly regular binary splitting sounds mechanical; vary split ratios (dotted, triplet). Dissonant operators must check the *current* harmony after reharmonisation (M08). Deep trees make edits expensive only if recomputed whole — cache per span.

## Sources

- Lerdahl, F., & Jackendoff, R. (1983). *A Generative Theory of Tonal Music*. MIT Press.
- Schenker, H. (1935). *Der freie Satz*; trans. Oster, *Free Composition* (Longman, 1979).
- Forte, A., & Gilbert, S. (1982). *Introduction to Schenkerian Analysis*. Norton.
