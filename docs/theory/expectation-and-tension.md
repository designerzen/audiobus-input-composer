# M04 — Expectation and tension models

[Theory index](README.md). Reviewed 24 November 2026.

## Why a tension signal

The Plutchik interface ([18](../18-plutchik-interface.md)) and Energy are *listener-facing* quantities; notes are *composer-facing*. A computable tension estimate bridges them: each region and intensity defines a **target tension curve** over the phrase, and candidates are scored by how well their predicted tension follows it.

## Source models

**Narmour — Implication–Realization (1990).** After a melodic interval, listeners expect continuation by two principles: small intervals imply continuation in the same direction with a similar size; large intervals imply reversal and a smaller following interval (cf. *gap-fill*). Schellenberg (1997) reduced the model to two factors — pitch proximity and pitch reversal — that predict expectancy ratings about as well.

**Huron — ITPRA (*Sweet Anticipation*, 2006).** Expectation produces five responses: Imagination, Tension, Prediction, Reaction, Appraisal. Predictable events feel pleasant (prediction reward); surprise produces arousal that can be appraised positively. Statistical learning of the idiom drives prediction. Compare [IDyOM-style variable-order Markov models](../techniques/variable-order-markov.md), which compute information content (surprisal) per note.

**Lerdahl — Tonal Pitch Space (2001); Lerdahl & Krumhansl (2007).** Chord distance `δ(x→y) = i + j + k` combines region distance on the circle of fifths, chord distance within the region, and the number of non-common pitch classes in a basic-space hierarchy. Tension combines hierarchical (prolongational, M03) distance, surface dissonance, melodic attraction and voice-leading attraction. Their listener study found these predictions fitted continuous tension ratings well for the tested pieces.

**Farbood (2012).** A parametric model combining harmony, melodic expectation, loudness, pitch height, onset frequency and tempo trends; feature changes integrate over time with memory decay. Useful because several of its inputs (onset frequency, pitch height) are directly under the composer's Energy control.

**Herremans & Chew (2016), "tension ribbons".** Spiral-array based measures — cloud diameter (dissonance spread), cloud momentum (tonal movement) and tensile strain (distance from key) — computed per window. Chew's spiral array (2014) places pitches, chords and keys in one 3D helix so all three are numeric.

## Proposed composite tension

```text
T(event window) =
    wH * harmonicDistance(chord, tonic)          // Lerdahl δ or spiral tensile strain
  + wD * surfaceDissonance(simultaneities)       // interval roughness classes
  + wS * surprisal(note | context)               // variable-order Markov / IDyOM
  + wR * registerHeight(melody) normalised
  + wO * onsetRate normalised
  + wC * unresolvedLeadingTones / suspensions
```

Weights are profile values. Smooth T with a leaky integrator (memory decay, as in Farbood) so the curve reflects build-up rather than single notes.

## Using it

- **Generate-then-select:** each engine proposes N candidate bars; keep the candidate minimising `|T(candidate) − Ttarget(t)|` plus other costs. Works with any engine in the library.
- **Target curves (proposals):** Anticipation — monotone rise to the phrase end then deferred resolution (deceptive cadence, M06). Joy — moderate oscillation with full resolutions. Sadness — low surprisal, slow decay, suspensions. Fear — high surprisal and harmonic distance with weak resolution. Surprise — low baseline with isolated spikes. Trust — low, stable. Anger — high onset rate and dissonance with strong arrivals.
- **Energy** scales the curve's amplitude and baseline; **Emotion** chooses its shape.

## Failure modes

Tension is not valence: the same curve can be thrilling or distressing depending on timbre and context outside this Input. Surprisal depends on training data; a model trained on one style misjudges another. Avoid monotone curves over long spans — listeners habituate.

## Evaluation

Correlate T with continuous listener tension ratings (slider study, cf. Lerdahl & Krumhansl). Ablate each term. Check that target-tracking error is low without collapsing variety (pair with [novelty search](../techniques/novelty-search.md)).

## Sources

- Narmour, E. (1990). *The Analysis and Cognition of Basic Melodic Structures*. University of Chicago Press.
- Schellenberg, E. G. (1997). Simplifying the implication-realization model of melodic expectancy. *Music Perception* 14(3), 295–318.
- Huron, D. (2006). *Sweet Anticipation*. MIT Press.
- Lerdahl, F. (2001). *Tonal Pitch Space*. Oxford University Press.
- Lerdahl, F., & Krumhansl, C. L. (2007). Modeling tonal tension. *Music Perception* 24(4), 329–366. <https://doi.org/10.1525/mp.2007.24.4.329>
- Farbood, M. M. (2012). A parametric, temporal model of musical tension. *Music Perception* 29(4), 387–428. <https://doi.org/10.1525/mp.2012.29.4.387>
- Herremans, D., & Chew, E. (2016). Tension ribbons: quantifying and visualising tonal tension. *TENOR 2016*.
- Chew, E. (2014). *Mathematical and Computational Modeling of Tonality*. Springer. <https://doi.org/10.1007/978-1-4614-9475-1>
