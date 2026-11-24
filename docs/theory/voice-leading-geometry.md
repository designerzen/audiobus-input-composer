# M07 — Voice-leading geometry and neo-Riemannian moves

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

**Tymoczko (2006; 2011).** An *n*-note chord, ignoring octave and order, is a point in an orbifold `Tⁿ/Sₙ`. Voice leadings are paths; their size (e.g. total semitone displacement, a taxicab norm) is a distance. Near-evenly-spaced chords (major/minor triads, dominant sevenths) cluster near the centre of the space, which is why they admit many small voice leadings to one another. This explains *why* common-practice harmony is efficient, and gives a metric to steer by.

**Neo-Riemannian theory (Cohn 1998, 2012).** Three parsimonious transformations on triads, each moving a single voice by one or two semitones:

| Move | Example | Voice change |
| --- | --- | --- |
| P (parallel) | C → Cm | E → E♭ |
| L (leading-tone exchange) | C → Em | C → B |
| R (relative) | C → Am | G → A |

Compositions (`PL`, `LP`, `PRL`…) reach every triad. Hexatonic cycles (alternating P and L) and octatonic cycles (P and R) give the "film-score" chromatic progressions associated with wonder and uncanniness. Cohn also distinguished *Weitzmann regions* around augmented triads.

The library already has [transformational harmony graphs](../techniques/transformational-harmony-graphs.md) and [voice-leading optimisation](../techniques/voice-leading-optimization.md); this page adds the **metric** and the **chromatic, non-functional idiom**.

## Proposed uses

1. **Distance as a control.** `d(chord_t, chord_t+1)` in semitone displacement is a continuous property. Low Energy/Trust → small mean distance (smooth pads). Surprise → occasional large distance after a run of small ones.
2. **Functional vs parsimonious mode.** Let Emotion choose the harmonic logic: functional (circle-of-fifths, cadences, M06) for Joy/Trust; neo-Riemannian walks for Surprise, Fear and awe; hexatonic poles (C → A♭m) for uncanny climaxes.
3. **Voice-leading-first generation.** Instead of choosing a chord then voicing it, choose a *voice motion vector* (e.g. one voice moves −1) and accept whatever chord results if it is in the allowed set. This yields fluid, idiomatic pads.
4. **Path planning.** With chords as nodes and voice-leading size as edge weight, run [A\*](../techniques/a-star-search.md) or [shortest-path composition](../techniques/shortest-path-composition.md) to reach a modulation target with the smoothest route.

## Failure modes

Pure parsimony drifts tonally with no centre; anchor it with periodic returns or a pedal. Orbifold distance ignores register and spacing — combine with voicing cost (chapter [04](../04-music-theory-as-rules.md)). Neo-Riemannian moves are defined on consonant triads; sevenths need extended transformation sets.

## Sources

- Tymoczko, D. (2006). The geometry of musical chords. *Science* 313(5783), 72–74. <https://doi.org/10.1126/science.1126287>
- Tymoczko, D. (2011). *A Geometry of Music*. Oxford University Press.
- Cohn, R. (1998). Introduction to neo-Riemannian theory: a survey and a historical perspective. *Journal of Music Theory* 42(2), 167–180. <https://doi.org/10.2307/843871>
- Cohn, R. (2012). *Audacious Euphony*. Oxford University Press.
