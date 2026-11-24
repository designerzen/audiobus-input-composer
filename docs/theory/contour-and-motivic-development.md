# M11 — Melodic contour and motivic development

[Theory index](README.md). Reviewed 24 November 2026.

## Contour

**Contour theory** (Morris 1987; Marvin & Laprade 1987) abstracts a melody to the *rank order* of its pitches: `<0 2 1 3>` means lowest, highest-but-one, middle, highest. Contour survives transposition, scale change and interval stretching, and listeners recognise it well, which makes it a good identity carrier for a generator that changes keys, modes and harmonies.

Common phrase shapes: **arch** (rise to a single climax ~60–75% through, then fall), **inverted arch**, **descending** (typical of phrase endings and laments), **ascending** (intensification), **wave**.

**Gap-fill** (Meyer 1973; tested by von Hippel & Huron 2000): after a large leap, melodies tend to move back in the opposite direction. Von Hippel and Huron argue much of this follows from *regression to the mean* of the tessitura — so a [mean-reverting process](../techniques/mean-reverting-process.md) in pitch produces it naturally.

**Single climax rule:** the highest note of a phrase occurs once, usually late. Cheap to enforce, large perceived improvement.

## Developing variation

Schoenberg (*Fundamentals of Musical Composition*, 1967) describes how a basic motif generates a whole piece through progressive transformation, each step retaining some features and changing others:

| Operation | Keeps | Changes |
| --- | --- | --- |
| Repetition / sequence | all / intervals | pitch level |
| Rhythmic variation | pitches | durations |
| Interval change | contour, rhythm | interval sizes |
| Inversion / retrograde | interval set | direction / order |
| Augmentation / diminution | pitches | time scale |
| Fragmentation | head or tail | length |
| Embellishment | skeleton (M03) | surface |
| Liquidation | rhythm skeleton | motivic identity removed, leaving cadence formulas |

## Proposed use

- Store motifs as **(contour, interval vector, rhythm, harmonic context)** tuples in motif memory ([07](../07-form-memory-and-identity.md)).
- A development step chooses an operation that preserves at least one feature; similarity to the parent stays within a band. Low Trust/high Surprise → wider band.
- **Liquidation** before cadences: progressively strip features through the continuation (M06) so cadences sound like arrivals.
- Contour target per phrase chosen by Emotion: arch for Joy, descending for Sadness, ascending for Anticipation, jagged/wave with wide leaps for Fear and Anger.
- Energy sets range and leap probability; enforce gap-fill and single climax as constraints.

## Failure modes

Contour alone underdetermines melody; combine with harmony and key profiles. Too many simultaneous transformations destroy recognisability — limit to one or two per step. Related existing pages: [motif permutation](../techniques/motif-permutation.md), [serial row transformations](../techniques/serial-row-transformations.md), [affine pitch transformations](../techniques/affine-pitch-transformations.md).

## Sources

- Morris, R. D. (1987). *Composition with Pitch-Classes*. Yale University Press.
- Marvin, E. W., & Laprade, P. A. (1987). Relating musical contours: extensions of a theory for contour. *Journal of Music Theory* 31(2), 225–267.
- Meyer, L. B. (1973). *Explaining Music*. University of California Press.
- von Hippel, P., & Huron, D. (2000). Why do skips precede reversals? The effect of tessitura on melodic structure. *Music Perception* 18(1), 59–85.
- Schoenberg, A. (1967). *Fundamentals of Musical Composition*. Faber.
