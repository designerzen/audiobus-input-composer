# M06 — Phrase functions: sentence, period and cadence

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

Caplin (*Classical Form*, 1998) describes themes as sequences of **formal functions** — what a passage *does* in time — rather than what it contains:

- **Sentence (8 bars):** presentation (basic idea 2 bars + repetition 2 bars) → continuation (fragmentation, faster harmonic rhythm, sequence) → cadence.
- **Period (8 bars):** antecedent (basic idea + contrasting idea, ending on a *weak* cadence, usually half) → consequent (same basic idea + contrasting idea ending on a *strong* cadence).
- **Hybrids:** antecedent + continuation; compound basic idea + continuation, etc.
- **Beginning / middle / end functions** at larger scale: introduction, main theme, transition, retransition, coda; post-cadential codettas (cf. Quiescenza, M01).

Formal functions are defined by **time position + behaviour**, which is exactly what a generator needs.

## Cadence strength ladder

From weakest to strongest closure (common-practice):

```text
none (elision) < imperfect authentic / half cadence (end on V) < Phrygian half (iv6–V in minor)
< deceptive (V–vi) [closure denied] < plagal (IV–I) < imperfect authentic (V–I, melody not on 1)
< perfect authentic (V–I root position, melody 2–1 or 7–1)
```

Deceptive cadences are listed by *function*: they set up an expectation of strong closure and deny it, extending the phrase.

## Proposed grammar

```text
Theme      → Sentence | Period | Hybrid
Sentence   → Presentation(BI, BI') Continuation(frag, seq?) Cadence(strong)
Period     → Antecedent(BI, CI, Cadence(weak)) Consequent(BI, CI', Cadence(strong))
BI         → motif from memory (chapter 07) | new motif
BI'        → transform(BI): exact | transposed | tonic→dominant version
Continuation → fragment(BI, 1 bar) × 2 → fragment(½ bar) × 2   // liquidation, M11
```

Expansions: an **expanded cadential progression** (stretch I6–IV–V over 4 bars), **one-more-time** repetition after a deceptive cadence, **extension** by repeated cadential approach. These are the natural places for Energy and Anticipation to lengthen music without adding density.

## Time, emotion and energy (proposals)

- **Time:** phrase length (4/8/16 bars) and position fix where functions begin; harmonic rhythm accelerates through continuation automatically.
- **Energy:** continuation fragmentation rate and sequence direction (rising = more energy). High energy may choose sentence (driving) over period (balanced).
- **Emotion:** cadence choice per phrase end. Trust/Joy → authentic; Anticipation → half and deceptive; Sadness → Phrygian half, plagal; Surprise → deceptive or chromatic-mediant arrival; Fear → evaded cadences (elision into new phrase).

## Integration

The phrase planner emits *slots* (`BI@bar1`, `cadence:PAC@bar8`) that downstream engines fill. Harmony is solved backwards from the cadence target ([dynamic programming](../techniques/dynamic-programming.md), [constrained Markov bridges](../techniques/constrained-markov-bridges.md)). The [autonomous conductor](../22-autonomous-conductor-and-dramaturgy.md) works above this, choosing which theme type comes next.

## Sources

- Caplin, W. E. (1998). *Classical Form*. Oxford University Press.
- Caplin, W. E. (2013). *Analyzing Classical Form*. Oxford University Press.
- Schoenberg, A. (1967). *Fundamentals of Musical Composition*. Faber.
