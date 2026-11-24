# 04 — Music theory as executable decisions

This chapter proposes a tonal profile, not a universal grammar. [Tonal](https://github.com/tonaljs/tonal) supplies pitch, interval, scale and chord operations; [music21](https://github.com/cuthbertLab/music21) is useful for offline analysis. Neither library automatically supplies a composer. [MorpheuS](https://arxiv.org/abs/1812.04832) motivates separating structural constraints from preferences.

## Pitch representation

Retain three related values: scale degree with alteration, spelled pitch with octave, and delivery pitch. In C, degree 4 is F in a one-based degree system; in a zero-based array it is index 3. Make that convention explicit. Enharmonic MIDI equality does not erase harmonic spelling: F-sharp and G-flat can serve different functions.

For a seven-degree scale stored as semitone offsets `S`, a zero-based integer degree `d` becomes:

```text
pitch(d) = tonic + S[positiveModulo(d, 7)] + 12 * floor(d / 7)
```

This supports negative degrees correctly. Do not use JavaScript's signed remainder directly for array indexing. A semitone-only internal representation can serve an initial 12-tone equal-temperament prototype, but it should be identified as that limitation. Later tuning profiles need cents or a pitch ratio alongside degree meaning.

## Harmony as a path

For an initial common-practice-inspired profile, use harmonic regions such as tonic, predominant and dominant, with authored transitions. A phrase might follow `I → vi → ii6 → V7 → I`. A modal profile might remain on a drone, alternate two centres, or avoid functional dominant resolution altogether.

Choose chord identity separately from voicing. A C-major chord can be `[48,55,64]` or `[60,64,67]`; both use C, E and G but occupy different registers and permit different subsequent movements. Preserve harmonic rhythm: how often harmony changes is independent of note density.

Use a weighted candidate cost, with profile-defined weights:

```text
cost(voicing) = movement + registerPenalty + spacingPenalty
              + crossingPenalty + unwantedDoubling + melodyConflict
```

Enumerate only a bounded set of candidate inversions and octave placements. Prefer retaining common tones, small movement and clear bass function. Hard constraints protect range and maximum simultaneous notes; stylistic constraints such as avoiding parallel fifths should apply only to profiles that require them. A rock power-chord profile should not inherit chorale rules accidentally.

**Expected effect:** chord changes sound connected and deliberate instead of jumping to arbitrary root-position blocks. An inverted chord can change the bass contour and sense of direction even while chord identity stays constant.

## Melody: contour, anchors and decoration

Plan a short contour before exact pitches: rise, plateau, fall; a repeated tone; a single leap followed by stepwise recovery. Select anchor notes at salient metric and harmonic positions, then decorate between them. Chord tones are useful anchors in the initial tonal profile; scale tones can connect them.

| Device | Executable interpretation | Expected effect |
| --- | --- | --- |
| Passing note | Connect two anchors by an intermediate degree, usually at weaker weight | Movement without replacing the harmonic target |
| Neighbour note | Depart one degree and return | Local activity around a stable pitch |
| Suspension | Retain a previous harmony's note into a new chord, then resolve by profile rule | Delayed resolution and directed tension |
| Appoggiatura | Accented non-chord tone resolving to an anchor | A more foregrounded expressive disturbance |
| Anticipation | Introduce a next-chord pitch before the harmonic boundary | Forward pull |
| Sequence | Repeat an interval/rhythm shape at another degree | Recognizable development |
| Cadential target | Reserve a final target and approach before filling the phrase | An audible ending rather than an accidental stop |

These devices require context. “Snap every note to the nearest chord tone” destroys many of them. Instead annotate intended dissonances with their resolution obligation and deadline. If the harmony changes unexpectedly, re-evaluate the obligation rather than flattening the entire phrase.

## Counterpoint and arrangement

A counterline needs its own contour and rhythm, plus rules relating it to the lead. Begin with contrary or oblique motion, complementary attacks and separated tessituras. Limit simultaneous prominence: if the lead is dense, the answer may rest. Inspect the final lead before accepting the answer, as in [Inclusive City's form code](../../inclusive-city/source/src/art/MusicForm.ts).

Avoid conflating polyphony with many notes. Two independent lines can be richer than six voices moving in parallel. Conversely, homorhythmic chord blocks can be the desired texture. Make texture an arrangement decision.

## Modulation and modes

Changing tonic is a structural act. Schedule it at a phrase boundary, choose a pivot or explicit transition, and decide whether active sustained notes remain, resolve or release. Mode mixture can alter colour without moving the tonal centre. A borrowed iv in a major profile affects the harmonic route differently from simply lowering every third.

A profile should define pitch vocabulary, characteristic degrees, allowable chord constructions, cadence types, range, rhythmic practice and forbidden assumptions. For traditions outside the team's expertise, work with knowledgeable musicians; a scale array alone cannot encode a musical practice.

## Practical rule ordering

Resolve key/profile → harmonic path → bass/voicing → melodic anchors → motif transformation → ornaments → counterline → expressive timing. If a late stage fails, retry a bounded candidate set or remove the optional ornament. Preserve the phrase's important anchors and ending before preserving decorative density.
