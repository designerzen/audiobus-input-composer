# M08 — Reharmonisation and jazz substitution

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

Jazz practice treats a progression as a **base sequence plus optional rewrites**. Steedman (1984) formalised this as a generative grammar: twelve-bar blues variants are derived from a simple I–IV–I–V–I skeleton by rewrite rules such as:

```text
x        → x  x                       (repetition / subdivision)
x        → V/x  x                     (insert secondary dominant)
V/x  x   → ii/x  V/x  x               (expand to ii–V)
V7/x     → ♭II7/x                     (tritone substitution)
```

Rohrmeier (2011) generalised the idea to a recursive generative syntax of tonal harmony (functional regions TR, DR, SR with prolongation and preparation rules). Both are generative, not only analytical.

## Substitution vocabulary

| Rewrite | C-major example | Character |
| --- | --- | --- |
| Diatonic substitute | I → iii or vi | Softer, same function |
| Secondary dominant | → A7 → Dm | Forward pull |
| ii–V expansion | G7 → Dm7 G7 | More motion |
| Tritone sub | G7 → D♭7 | Chromatic bass slide |
| Backdoor | ♭VII7 → I (B♭7 → C) | Warm, plagal-like |
| Modal interchange | F → Fm | Shading (M05) |
| Diminished passing | C → C♯°7 → Dm | Chromatic bass connective |
| Pedal / ostinato | hold bass, move upper chords | Suspense |
| Extensions | C → Cmaj9, G7 → G7♭9 | Colour, dissonance |

## Proposed use: depth as a dial

Keep the plan's base progression (from M01/M06). Apply rewrites up to a **depth** `k`:

- Energy → `k` and harmonic rhythm (more rewrites = more chords per bar).
- Emotion → which rewrites are weighted: Joy = secondary dominants and extensions (9, 13); Sadness = modal interchange, minor iv, ♭9; Fear = tritone subs, diminished passing, altered dominants; Trust = diatonic substitutes, pedal; Surprise = backdoor, chromatic mediant.
- **Melody check:** each rewrite is accepted only if the melody note at that time is a chord tone or allowed tension of the new chord (avoid-note rules). This preserves the tune while recolouring it — the central value of reharmonisation for repeats.

Because rewrites are local and reversible, store the base and the rewrite list; a repeat can choose a different list over the same base (variation without losing identity, cf. M03).

## Failure modes

Stacking tritone subs and ii–Vs quickly exceeds a style's tolerance; cap per bar. Extensions must agree with melody and bass across all voices. Rewrites change bass motion, so recheck [voice leading](voice-leading-geometry.md).

## Sources

- Steedman, M. J. (1984). A generative grammar for jazz chord sequences. *Music Perception* 2(1), 52–77. <https://doi.org/10.2307/40285282>
- Rohrmeier, M. (2011). Towards a generative syntax of tonal harmony. *Journal of Mathematics and Music* 5(1), 35–53. <https://doi.org/10.1080/17459737.2011.573676>
- Levine, M. (1995). *The Jazz Theory Book*. Sher Music.
- Related: [probabilistic grammars](../techniques/probabilistic-grammars.md), [graph grammars](../techniques/graph-grammars.md).
