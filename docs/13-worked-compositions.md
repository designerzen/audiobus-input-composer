# 13 — Worked symbolic composition sketches

These are original examples, not source transcriptions or evaluated outputs. Pitches use MIDI numbers with C4 = 60. Onsets and lengths use quarter-note beats; a 4/4 bar occupies `[0,4)`. Velocity is normalized. Rendering is deliberately unspecified.

## A — One motif, two energy settings

Hold C major, 100 BPM and valence fixed. Begin with a theme C4–E4–D4–G4. Its zero-based scale degrees are `[0,2,1,4]`. The four original attacks are identity anchors.

| Onset | Low-energy pitch | Gate | Velocity | Higher-energy pitch | Gate | Velocity |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | C4 / 60 | .75 | .48 | C4 / 60 | .65 | .72 |
| .5 | rest | — | — | D4 / 62 | .25 | .52 |
| 1 | E4 / 64 | .375 | .40 | E4 / 64 | .30 | .61 |
| 1.5 | D4 / 62 | .75 | .42 | D4 / 62 | .40 | .64 |
| 2.5 | rest | — | — | F4 / 65 | .25 | .55 |
| 3 | G4 / 67 | .75 | .52 | G4 / 67 | .65 | .78 |

The higher-energy version adds two connecting attacks, shortens some gates and strengthens accents. It preserves anchor pitch order, onset and tempo. The F at 2.5 connects D toward G through the scale; it is not a new harmonic root. A busier version need not add a counterline too: the global budget may already be consumed.

**Expected effect:** more surface activity while the theme remains recognizable. **Alternative test:** retain only the four attacks and vary accents/articulation. This separates energy conveyed by density from other channels.

## B — Same contour, different harmonic colour

Use the same degree pattern in C natural minor: C4–E-flat4–D4–G4, MIDI `[60,63,62,67]`. Keep timing identical. For a four-bar phrase, compare a major profile's `I–vi–ii–V` with a minor profile's `i–VI–iv–V`, explicitly raising the leading tone where the minor dominant requires it.

This illustrates why a scale array is insufficient: the chosen minor dominant introduces B-natural even though the natural-minor collection has B-flat. Store the harmonic exception and ensure it resolves appropriately. The minor version is a different expressive hypothesis; do not label it as guaranteed sadness.

**Expected effect:** changed tonal colour and approach to cadence with preserved motif rhythm. **Confound to avoid:** changing tempo, register, dynamics and renderer simultaneously would make the harmonic effect difficult to assess.

## C — Minimal voicing movement

For a two-chord `C → Am` change, compare:

```text
Root-position blocks: [60,64,67] -> [69,72,76]
Common-tone voicing:  [60,64,67] -> [60,64,69]
```

The first moves all voices upward; the second retains C and E and moves G to A. Both realize the same chord identities. If the bass must state A, let a separate bass play A2 / 45 while the upper chord keeps its common tones.

**Expected effect:** smoother upper movement with a clear bass change. This is a local illustration; a whole phrase optimizer must consider the next chords, voice ranges and intended direction too.

## D — Euclidean rhythm and changing accent

Use eight eighth-note slots in one 4/4 bar:

```text
slots:       0 1 2 3 4 5 6 7
base hits:   x . . x . . x .
late rotate: . x . . x . . x
beat:        0 .5 1 1.5 2 2.5 3 3.5
```

The base attacks occur at beats `[0,1.5,3]`. Rotating every attack one slot later gives `[.5,2,3.5]`. Both have three attacks, but their relation to strong beats changes. Keep bass on beats 0 and 2 to make the relationship audible. Assign accent deliberately rather than accenting every hit equally.

**Expected effect:** density stays constant while metric tension changes. This is a numerical onset example, not a claim to reproduce a named traditional rhythm.

## E — A thirty-two-bar autonomous arc

| Bars | Form | Motif action | Harmony/texture decision |
| --- | --- | --- | --- |
| 1–8 | Statement | Repeat original; vary the ending once | Stable centre; bass and lead only initially |
| 9–16 | Development | Sequence a two-note fragment | Add harmonic motion and one complementary layer |
| 17–24 | Contrast | Augment fragment; exchange register | Reduce attacks, prolong unresolved harmony |
| 25–30 | Return | Restore original rhythm and register | Recall opening support with a small voicing change |
| 31–32 | Cadence | Remove ornaments; reserve final target | Resolve and release optional voices |

An energy rise during contrast need not immediately destroy contrast. Increase accent weight on the sparse line, then queue a layer entrance for bar 25. Publish the effective timing so the delay feels intentional.

**Expected effect:** development, space and return can be heard over a larger span. Test against a generator with the same local vocabulary but no section plan.

## F — Lead-aware answer

If the lead occupies beats `[0,.5,1,1.5,2,2.5,3,3.5]`, a counterline may have no useful attack gap. The correct output can be silence. In the next bar, if the lead plays only at 0 and 1, place a brief answering cell around 2.25 and 3, ending before the next phrase.

Choose register after the actual lead is known. A fixed five-semitone separation is an initial conflict heuristic, not a law of counterpoint or auditory masking. Listen for whether the answer is intelligible and whether it changes the sense of dialogue.

## G — A dissonance with a reason

Over `C → G7`, retain C5 across the chord boundary as a suspension, then resolve to B4. Record an obligation: “C5 resolves down one semitone to B4 before beat 2.” If the next harmonic plan changes, reconsider that resolution. A blanket chord-tone snap would remove the suspension and erase the intended tension-release gesture.

This is a useful unit of explainable composition: the same pitch can be purposeful or awkward depending on preparation, placement, duration and resolution.
