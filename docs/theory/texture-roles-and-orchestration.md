# M10 — Texture, roles and orchestration logic

[Theory index](README.md). Reviewed 24 November 2026.

## Why roles

Most generators produce "notes". Musicians produce **parts with jobs**. AudioBus can route events to several instruments, so the composer should own a role model that decides which jobs exist at each moment.

| Role | Job | Typical constraints |
| --- | --- | --- |
| Bass | Define harmony root/inversion and pulse | Low register; chord tone on strong beats; approach tones |
| Melody | Carry identity (motif memory) | Highest or most salient; contour (M11) |
| Countermelody | Answer melody in its gaps | Contrary motion; rhythmically complementary |
| Pad / harmony | Sustain chord colour | Smooth voice leading (M07); mid register |
| Pulse / ostinato | Mark time | Repeating; low pitch variety |
| Colour | Rare ornaments, sparkle | Sparse; high register |

**Texture types** describe how roles combine: monophony, homophony (melody + accompaniment), homorhythm (chordal), polyphony (independent lines, M02), heterophony (simultaneous variants of one line).

## Perceptual rules for separable parts

Huron (2001) derived voice-leading conventions from auditory scene analysis: keep parts **within a register** and **toward the middle of their range**, prefer **pitch proximity** (small steps keep a stream fused), **avoid crossing**, avoid **semblant (parallel) motion** that fuses parts, prefer **onset asynchrony** between parts to keep them distinct, and use **limited density** (listeners track about three concurrent lines comfortably). These are actionable costs for a multi-part generator, independent of style.

## Composing devices

- **Call and response:** melody phrase → pause → response in another role, often transformed (inverted, sequenced). Make the response length and transformation an Emotion choice.
- **Hocket:** distribute one line across parts so they alternate notes; creates interlocking rhythm from a single source line ([Euclidean](../techniques/euclidean-rhythms.md) complements make good hocket masks).
- **Layering / additive form:** introduce roles one at a time (pulse → bass → pad → melody); remove them for breakdowns. Energy controls the number of active roles; this is the dominant form device in electronic music and is driven well by the [conductor](../22-autonomous-conductor-and-dramaturgy.md).
- **Doubling:** octave or third doubling for emphasis at climaxes.
- **Register spread:** total span between bass and top voice widens with Energy and intensity.

## Bass-line construction (example rule set)

```text
beat 1        : chord root (or inversion bass from the plan)
beats 2–3     : chord tones or scale steps; prefer stepwise
last beat     : approach tone to next root — chromatic (±1), scale step, or dominant (5th above)
energy ↑      : subdivide (walking quarters → eighths), add octave leaps, syncopate (M09)
sadness/trust : pedal tones, long durations
```

## Failure modes

Too many active roles mask each other (Huron's density limit). Roles must follow the *same* harmony and phrase plan; independent generators per role drift apart. Register collisions between roles need a shared allocator.

## Sources

- Huron, D. (2001). Tone and voice: a derivation of the rules of voice-leading from perceptual principles. *Music Perception* 19(1), 1–64. <https://doi.org/10.1525/mp.2001.19.1.1>
- Bregman, A. S. (1990). *Auditory Scene Analysis*. MIT Press.
- Related: [musical auctions](../techniques/musical-auctions.md) (role allocation), [behaviour trees](../techniques/behaviour-trees.md).
