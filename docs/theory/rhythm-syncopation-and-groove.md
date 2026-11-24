# M09 — Rhythm theory: syncopation, groove and metre play

[Theory index](README.md). Reviewed 24 November 2026. Extends chapter [05](../05-rhythm-and-time.md).

## Measuring syncopation

**Longuet-Higgins & Lee (1984)** assign each metrical position a weight from the metrical hierarchy (bar = 0, half = −1, beat = −2, eighth = −3, sixteenth = −4). A syncopation occurs when a note on a weaker position is followed by a rest or tie on a stronger one; its strength is the weight difference. Summing gives a per-bar **syncopation index** — a number the composer can target.

Toussaint (*The Geometry of Musical Rhythm*, 2013) surveys further measures (off-beatness, weighted note-to-beat distance) and rhythm similarity metrics (swap distance, chronotonic distance) useful for *controlled variation*: mutate a rhythm until its distance from the original reaches a target.

## Groove

Witek et al. (2014) found an **inverted-U**: listeners' desire to move and pleasure ratings peaked at *medium* syncopation in drum-breaks, falling for both low and high. Proposal: map Energy to syncopation along the rising side, but cap groove-oriented regions (Joy) near the peak and let Anger/Fear overshoot it deliberately.

## Metre play as composer actions

| Device | Definition | Use |
| --- | --- | --- |
| Hemiola | 3+3 felt as 2+2+2 (two bars of 3/4 as one of 3/2) | Cadential broadening, Anticipation |
| Polymetre | Parts with different bar lengths ([T-page](../techniques/polymetric-composition.md)) | Hypnotic texture |
| Metric modulation | New tempo where an old subdivision becomes the new beat (e.g. old triplet eighth = new eighth) | Section change without a jump |
| Additive metre | 3+3+2, 2+2+3 groupings | Asymmetric drive |
| Displacement | Shift a motif by a subdivision | Variation keeping content |
| Augmentation / diminution | Scale durations ×2 / ×½ | Slow-down / intensification |
| Non-retrogradable rhythm | Palindromic durations (Messiaen) | Static, timeless sections |
| Anacrusis | Pickup before a downbeat | Phrase propulsion |
| Fill / turnaround | Density burst in last beat(s) before a section | Form signposting |

## Symbolic micro-timing

Micro-timing is part of the score here, not audio rendering: per-subdivision offsets (swing ratio; "laid-back" or "pushed" upbeats) and per-role offsets (bass ahead, snare behind) are event-time parameters. Store them as a groove template — a 16- or 24-slot vector of offsets and velocity accents — applied at emission. Swing ratio can rise with Energy and fall to straight for Fear (tight, mechanical).

## Velocity and accent hierarchy

Derive default velocities from metrical weight, then override for syncopated accents. Accents on weak positions are what make syncopation audible when density is constant.

## Failure modes

Syncopation measures assume a single shared metre; polymetric layers need per-layer evaluation. Cultural groove practices (clave, samba, swing) are not just a syncopation number — prefer templates from the idiom.

## Sources

- Longuet-Higgins, H. C., & Lee, C. S. (1984). The rhythmic interpretation of monophonic music. *Music Perception* 1(4), 424–441. <https://doi.org/10.2307/40285271>
- Toussaint, G. T. (2013). *The Geometry of Musical Rhythm*. CRC Press.
- Witek, M. A. G., Clarke, E. F., Wallentin, M., Kringelbach, M. L., & Vuust, P. (2014). Syncopation, body-movement and pleasure in groove music. *PLoS ONE* 9(4), e94446. <https://doi.org/10.1371/journal.pone.0094446>
- London, J. (2004). *Hearing in Time*. Oxford University Press.
- Messiaen, O. (1944). *Technique de mon langage musical*. Leduc.
