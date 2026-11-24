# M12 — Modal systems beyond common practice

[Theory index](README.md). Reviewed 24 November 2026.

## Why include them

Most of this library assumes Western tonal or loop-based practice. Several other traditions are *already* rule systems for generating melody over time, and they suggest constraint shapes that a scale alone cannot express. This page treats them as structural inspiration, not as authentic performance: a generator that follows a few rules of a raga is not performing that raga, and output should not be labelled as such.

## Raga (Hindustani and Carnatic)

A raga is more than a scale. Relevant structural features (Jairazbhoy 1971; Powers & Widdess, *Grove*):

- **Aroha / avaroha:** different permitted ascending and descending note sets and orders (e.g. some notes only on the way down; zig-zag *vakra* movement).
- **Vadi / samvadi:** principal and secondary emphasised notes.
- **Pakad / chalan:** characteristic phrases that identify the raga.
- **Time and rasa associations:** traditional performance times and emotional characters.
- **Form:** unmetered *alap* exploration rising through registers, then metred sections over a *tala* cycle.

Generative takeaways: (1) **direction-dependent transition tables** — a [Markov](../techniques/markov-chains.md) model where `P(next | current, direction)` differs for ascent and descent; (2) **phrase libraries as identity** ([retrieval and recombination](../techniques/retrieval-and-recombination.md)); (3) **register unfolding** as a slow form device; (4) **emphasis weights** as a non-tonic gravitational centre. The library's [directional pitch quantisation](../techniques/directional-pitch-quantization.md) is a first step toward (1).

## Maqam (Arabic, Turkish, Persian related systems)

- **Ajnas (jins):** 3–5-note building blocks; a maqam is a lower jins plus upper jins joined at a pivot note, and modulation often swaps one jins.
- **Seyir:** characteristic melodic path — where to start, which register to dwell in, how to descend to the final.
- Intervals include steps outside 12-TET (e.g. neutral seconds), which need the cents representation noted in chapter [04](../04-music-theory-as-rules.md) and the tuning work in [HarmonEasy research](../27-harmoneasy-research-and-reuse.md).

Generative takeaways: **modular scales** (compose scales from tetrachord modules; modulate by swapping one module — a smoother modulation than whole-key change) and **path-shaped melodic plans** (seyir as a target register trajectory).

## Colotomic and cyclic structure (gamelan)

In Javanese and Balinese gamelan, gong-cycle instruments mark nested subdivisions of a cycle (gong, kenong, kempul, ketuk), and elaborating instruments subdivide a core melody (*balungan*) at density levels (*irama*) that change by factors of two (Tenzer 2000; Sumarsam 1995).

Generative takeaways: **nested punctuation layers** independent of melody; **density levels as discrete Energy states** that double or halve elaboration while tempo moves the other way; and **interlocking parts** (*kotekan*) — two parts that combine into one fast line, a hocket (M10).

## Care and limits

These summaries are thin, written from secondary literature. Tuning, ornamentation (gamaka, microtonal inflection) and performance context are central to these practices and largely beyond a MIDI-event generator. Prefer describing generated material by its rule (e.g. "direction-dependent pitch set") over borrowing names of specific ragas or maqamat; consult practitioners before any profile claims a tradition.

## Sources

- Jairazbhoy, N. A. (1971). *The Rāgs of North Indian Music*. Faber.
- Touma, H. H. (1996). *The Music of the Arabs*. Amadeus Press.
- Tenzer, M. (2000). *Gamelan Gong Kebyar*. University of Chicago Press.
- Sumarsam (1995). *Gamelan: Cultural Interaction and Musical Development in Central Java*. University of Chicago Press.
