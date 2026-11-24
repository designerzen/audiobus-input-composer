# 07 — Form, memory and identity

## Three different kinds of continuity

**Form** determines when a role such as statement or return occurs. **Memory** determines which material returns. **Identity** constrains how the performer tends to realize material. Their separation is supported by the local [form](../../inclusive-city/source/src/art/MusicForm.ts), [memory](../../inclusive-city/source/src/art/MusicMemory.ts), and [identity](../../inclusive-city/source/src/audio/robotMusicalIdentity.ts) implementations. The proposals below extend that separation.

## A section graph

Begin with `A(statement) → A'(development) → B(contrast) → A''(return) → cadence`. Give each node a duration, harmonic region, arrangement, allowed transitions and motif references. A transition may depend on energy, elapsed sections and a minimum residence time. Ensure a cadence remains reachable; avoid a random graph that can remain trapped in perpetual development.

For an endless mode, use larger arcs with periodic rests and resets. Endless does not have to mean continuously active. For a finite mode, reserve final bars and weaken conflicting novelty rules as the ending approaches.

[MusicLayout](https://arxiv.org/abs/2608.09035v2) and [MusicWeaver v3](https://arxiv.org/abs/2509.21714v3) motivate explicit inspectable structure. Stable section IDs and bounded edit scope are proposals for this project, not imported formal guarantees.

## A motif record

Store relative pitches, onset ratios, durations, accent positions, source context and tags. Keep both an original and a realized version; transposing into a new scale may alter the shape. Store origin and transformation history separately from subjective quality ratings.

```text
motif: m1
degrees: [0, 2, 1, 4]
onsetsInBeats: [0, 1, 1.5, 3]
lengthsInBeats: [0.75, 0.375, 0.75, 0.75]
accentIndices: [0, 3]
source: authored-session-theme
```

In a C-major profile beginning at C4, this gives C4–E4–D4–G4. Repetition establishes its identity before transformation asks a listener to recognize it.

## Transformation grammar

| Transformation | Preserve | Change | Expected effect |
| --- | --- | --- | --- |
| Diatonic transposition | Rhythm and degree intervals | Starting degree | Same gesture in another tonal position |
| Inversion about a degree | Rhythm and relative distances in degree space | Direction | A recognizable contour reversal, though tonal intervals may differ |
| Retrograde | Event ordering rule | Temporal direction | A related but sometimes less recognizable phrase |
| Augmentation | Relative rhythm | Overall duration | More spacious statement |
| Diminution | Relative rhythm | Overall duration | Greater activity |
| Fragmentation | Selected cell | Phrase completeness | Concentrated development and forward drive |
| Rhythmic displacement | Pitch order and spacing | Metric placement | New accent relationships |
| Reharmonization | Lead identity | Supporting harmony | A changed expressive reading of familiar material |
| Register exchange | Part material | Which voice carries it | Contrast without discarding the theme |

Apply one important transformation at a time initially. If pitch, rhythm, harmony and register all change together, the declared motif relationship may exist only in metadata.

## Bounded recall

Keep a small library, perhaps eight active motifs for a first experiment. Track recent use, structural importance and explicit user preference. Do not equate recurrence frequency with quality. A section theme may deserve retention despite infrequent use, while an incidental flourish can expire.

Inspired by the Creative Memory Engine's inspectable memory and agency principles, expose motif origins, allow forgetting, and let a person pin or reject material. The source prototype helps people connect fragments; applying it to autonomous motif recall is our design inference. See [P17](03-annotated-papers.md).

## Persistent identity

Choose stable ranges for typical interval size, preferred contour, rhythmic cells, articulation and transformation vocabulary. Current expression can modulate those preferences within bounds. The identity should survive quieter and louder sections without forcing every note back to the opening theme.

The [pianist-conditioning paper](https://arxiv.org/abs/2610.02918) suggests testing persistent conditioning later in a continuation. Here that means evaluating excerpts several sections apart, not claiming that handcrafted rules implement its model.

## Preventing exhausted variation

Track transform history and recent realized phrases. Repetition is permitted when structurally meaningful; novelty is not a universal objective. If all low-cost candidates are too similar, choose a deliberate rest, return or texture change before inventing an unrelated melody. Evaluate phrase endings and large-scale contrast separately from raw uniqueness.
