# M01 — Galant schemata and partimento

[Theory index](README.md). Reviewed 24 November 2026.

## Source idea

Gjerdingen (*Music in the Galant Style*, 2007) shows that eighteenth-century composers built music from a shared repertoire of **schemata**: short, named voice-leading patterns, each defined by a bass scale-degree line, a melody scale-degree line and typical metrical placement. Apprentices learned them through **partimento** (Sanguinetti, *The Art of Partimento*, 2012): unfigured or figured basses realised at the keyboard using rules such as the **rule of the octave**, which assigns a default chord to every bass degree in ascent and descent.

This is directly an algorithmic tradition: a vocabulary of units, rules for joining them and rules for realising them.

## Core vocabulary (degrees; bass / melody)

| Schema | Bass | Melody | Typical role |
| --- | --- | --- | --- |
| Romanesca | 1–7–6–3 (or stepwise 1–7–6–5) | 1–5–1–1 / 3–2–1–1 | Opening, presentation |
| Prinner | 4–3–2–1 | 6–5–4–3 | Answer / riposte to an opening |
| Do–Re–Mi | 1–7–1 | 1–2–3 | Opening gambit |
| Meyer | 1–7–…–1 | 1–7–4–3 | Opening |
| Monte | 4–5 / 5–6 (rising sequence) | rising by step | Intensification, sequence up |
| Fonte | 5♯–1 in ii, then 5–1 in I | falling | Relaxation, sequence down |
| Ponte | 5 pedal | elaborated dominant | Suspense, retransition |
| Quiescenza | 1 pedal | ♭7–6–7–1 | Post-cadential calm |
| Cadences | 4–5–1, (♯4)–5 half, 5–6 deceptive | 2–1, 7–1, 4–3 | Phrase endings |

## Rule of the octave (major, simplified)

| Bass degree | Ascending | Descending |
| --- | --- | --- |
| 1 | 5/3 | 5/3 |
| 2 | 6/4/3 | 6/4/3 |
| 3 | 6/3 | 6/3 |
| 4 | 6/5/3 | 6/4/2 (♯4: 6/♯4/2 toward 5) |
| 5 | 5/3 | 5/3 |
| 6 | 6/3 | ♯6/4/3 |
| 7 | 6/5/3 | 6/3 |

Given *any* stepwise bass, this table yields a stylistically coherent harmony without a search. It is a lookup function, cheap enough for the real-time path.

## Proposed symbolic use

- **Schema chain as macro-form.** Represent a phrase as a sequence of schema tokens: `Do-Re-Mi → Prinner → Monte → Ponte → Cadence`. Generate tokens with a [Markov chain](../techniques/markov-chains.md) or [probabilistic grammar](../techniques/probabilistic-grammars.md) whose transitions are taken from Gjerdingen's observed successions (openings → Prinner riposte; Monte/Fonte mid-phrase; Ponte before return).
- **Realisation.** Each token supplies bass and melody skeleton degrees with metrical slots. Fill inner voices via the rule of the octave and [voice-leading optimisation](../techniques/voice-leading-optimization.md). Decorate the melody skeleton with [M03 elaboration](prolongation-and-elaboration.md).
- **Style transfer.** The skeleton survives re-rhythmisation, so a Prinner can be a minuet, a four-on-the-floor loop or an ambient drone with slow harmonic rhythm.

## Time, emotion and energy (proposals)

- **Time:** schemata have intrinsic lengths (usually 2–4 events, one per bar or half-bar). Harmonic rhythm sets their duration; phrase plans place cadential schemata exactly at phrase ends.
- **Energy:** Monte (rising sequence) raises tension and register; Fonte and Quiescenza lower it. Energy biases the choice between them.
- **Emotion:** Joy/Anticipation favour Do-Re-Mi, Monte and authentic cadences; Sadness favours Fonte, descending Romanesca, Phrygian half cadence; Surprise uses deceptive cadences; Trust uses Quiescenza and pedal points.

## Failure modes

Schemata are a historical style; used raw they sound eighteenth-century. Abstract them to degree skeletons and re-voice them in the target idiom. Minor-mode variants need their own tables. The rule of the octave assumes stepwise basses; leaps need a fallback.

## Evaluation

Unit-test that every realised schema reproduces its bass/melody degree lines at the stated metrical positions. Compare listener ratings of phrase coherence for schema-chained versus chord-Markov progressions at equal note density.

## Sources

- Gjerdingen, R. (2007). *Music in the Galant Style*. Oxford University Press.
- Sanguinetti, G. (2012). *The Art of Partimento*. Oxford University Press.
- Related library pages: [context-free grammars](../techniques/context-free-grammars.md), [shortest-path composition](../techniques/shortest-path-composition.md).
