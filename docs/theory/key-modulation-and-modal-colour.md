# M05 — Key, modulation and modal colour

[Theory index](README.md). Reviewed 24 November 2026.

## Key profiles

Krumhansl and Kessler (1982) measured how well each chromatic pitch "fits" a major or minor context. The resulting 12-value **key profiles** let a composer (a) estimate the current key of recent output by correlation (Krumhansl–Schmuckler), and (b) *generate* pitches weighted by stability. Temperley (2007) recast key-finding as Bayesian inference with profiles as likelihoods.

Generative use: a pitch distribution `P(pc) ∝ profile(pc − tonic)^γ`. `γ > 1` sharpens towards tonic-triad tones (stable, Trust); `γ < 1` flattens towards chromatic colour (Fear, Surprise). This is a single continuous dial for *tonal clarity*.

## Mode brightness

The seven diatonic modes, ordered by sharpness, each differ from the next by one lowered degree:

```text
Lydian (♯4) > Ionian > Mixolydian (♭7) > Dorian (♭3) > Aeolian (♭6) > Phrygian (♭2) > Locrian (♭5)
```

This "brightness" ordering is a common teaching device rather than a measured perceptual scale, but it is ordered, reversible and changes one pitch per step — so walking it is smooth. Proposal: Joy and Anticipation sit at Lydian/Ionian/Mixolydian; Trust at Ionian/Mixolydian; Sadness at Dorian/Aeolian; Fear and Disgust at Phrygian/Locrian. Intensity widens the walk. See also [modal rebasing](../techniques/modal-rebasing.md) and [pitch-set proximity graphs](../techniques/pitch-set-proximity-graphs.md).

## Modulation techniques (as composer actions)

| Technique | Mechanism | Effect / when |
| --- | --- | --- |
| Tonicisation | Secondary dominant (V/x) for one chord | Momentary colour; no key change |
| Pivot-chord | A chord common to both keys, reinterpreted | Smooth; section transitions |
| Common-tone | Hold one pitch, change the harmony around it | Dreamlike; Surprise at low energy |
| Direct (phrase) modulation | New key at phrase start | Clear section boundary |
| Truck-driver (+1/+2 semitones) | Repeat material higher | Energy lift for final chorus |
| Chromatic mediant | I → ♭VI or III (shared tone) | Cinematic wonder, Surprise |
| Enharmonic | e.g. dim7 or Ger+6 reinterpreted | Dramatic, distant keys |

Plan modulations on the **form** level (chapter [07](../07-form-memory-and-identity.md)): key regions per section, with the modulation type chosen by Emotion and the distance (circle-of-fifths steps or Lerdahl region distance, M04) by Energy.

## Modal interchange (borrowed chords)

Borrow chords from the parallel mode: in C major, ♭VI (A♭), ♭VII (B♭), iv (Fm), ♭III (E♭). Each borrowed chord introduces the lowered degree of a darker mode, so borrowing is a *local*, one-chord step on the brightness axis — ideal for brief shading of Sadness or nostalgia inside a bright key (e.g. the "minor iv" before I).

## Failure modes

Frequent modulation erodes the tonal anchor that makes resolution satisfying. Key profiles are Western common-practice measurements; they do not describe modal or non-tonal idioms (see M12). Spelling matters: track letter names, not just MIDI numbers ([04](../04-music-theory-as-rules.md)).

## Sources

- Krumhansl, C. L., & Kessler, E. J. (1982). Tracing the dynamic changes in perceived tonal organization in a spatial representation of musical keys. *Psychological Review* 89(4), 334–368. <https://doi.org/10.1037/0033-295X.89.4.334>
- Krumhansl, C. L. (1990). *Cognitive Foundations of Musical Pitch*. Oxford University Press.
- Temperley, D. (2007). *Music and Probability*. MIT Press.
