# 05 — Rhythm, clocks and functions of time

## Several times coexist

Musical position is measured in beats or rational cycle positions. Performance time is measured on a monotonic clock. Phrase position describes structure. Control time describes when an emotion or energy value was observed. Wall-clock time is optional external input; it must not quietly replace musical time.

Define a cycle's musical length. If one cycle is a 4/4 bar at 120 quarter-note beats per minute, a cycle lasts two seconds. For 7/8, explicitly state whether BPM counts eighth notes or dotted-quarter groupings. A beat-unit field prevents many hidden timing errors.

Rational positions such as `1/3` preserve triplets without repeated rounding. Quantize only at an intentional boundary. Convert an absolute beat `b` to seconds through the tempo map:

```text
t(b) = t0 + integral from b0 to b of 60 / BPM(u) du
```

A constant-tempo segment reduces to `(b-b0)*60/BPM`. A tempo ramp requires integration or a controlled approximation. Recomputing each note from its beat avoids accumulated timer drift.

## Pattern algebra

The [Strudel pattern manual](https://strudel.cc/technical-manual/patterns/) and [Tidal source](https://github.com/tidalcycles/Tidal) support thinking of patterns as interval queries. Proposed operations include sequence, stack, speed scaling, rotation, masking, alternation and conditional transformation.

**Expected effects:** stacking creates simultaneity; sequencing creates a larger phrase; rotation shifts accent relationships; faster playback compresses durations and attack spacing; masking removes attacks while retaining the underlying reference structure. Applying each to the same motif makes their differences audible.

An event spanning a query boundary needs both its original span and its overlap with the query. Otherwise every scheduler query can retrigger a sustained note. Use stable event identity and emit a note-on only when its actual onset becomes due. A seek into a sustained note requires an explicit resume policy.

## Euclidean onset scaffolds

[Toussaint's paper](https://ehess.modelisationsavoirs.fr/atiam/biblio/Toussaint-BRIDGES2005.pdf) motivates distributing `k` attacks across `n` slots. A simple maximally even construction is:

```text
hit(i) = floor((i+1)*k/n) != floor(i*k/n), for 0 <= i < n
```

This is an onset-distribution sketch, not a claim to reproduce a specific implementation's canonical rotation. For `k=3,n=8`, one orientation is `..x..x.x`; rotate it to `x..x..x.` to place an attack first. Always specify rotation convention: positive rotation here means moving attacks later modulo the cycle.

Keep the scaffold separate from accents, note choices and durations. Increasing `k` changes density; changing rotation can change syncopation without changing density. Use `0 <= k <= n`, treat `k=0` as silence and reject `n<=0`.

## Meter and groove

Represent meter as both total length and grouping: 7/8 grouped `2+2+3` differs perceptually from `3+2+2`. Assign metric weights and distinguish the main pulse from subdivisions. Syncopation concerns attacks and continuation relative to this hierarchy, not merely the presence of offbeats.

Swing delays selected subdivisions while preserving the containing beat. If a pair of eighth notes has long-short ratio `r:1`, the second onset occurs at `r/(r+1)` of the beat. At `r=1`, the pair is straight; at `r=2`, the second onset is at two-thirds. This is a simple ratio model, not a complete model of jazz performance. Do not indiscriminately swing triplets, tuplets or every voice.

Microtiming is a smaller expressive displacement. Apply it after structural rhythm is resolved, bound it against neighbouring notes, and retain shared groove relationships between parts. Independent random jitter can dissolve the groove. Articulation ratio changes sounding length without moving the next onset.

## Phase, polymeter and polyrhythm

Two loops of 3 and 4 steps have a 12-step alignment cycle if their step durations match. Three evenly spaced notes against four within one shared duration instead form a polyrhythm. Different bar lengths are polymeter. A gradual relative tempo change creates phase drift. Keep these distinct because they require different clocks or cycle relationships.

**Expected effect:** phase and polymeter can create evolution from a tiny amount of material. **Risk:** coincidental alignments do not themselves create phrase direction. Give the arrangement a longer form plan and decide whether reunification is a structural event.

## Time functions and change boundaries

Use periodic functions for cyclic development, envelopes for arcs, piecewise curves for sections and deterministic noise for bounded variation. A density envelope can rise over sixteen bars while the motif remains fixed. Avoid reading current wall-clock time inside a supposedly reproducible bar generator.

Define separate application times for controls: next note, next beat, next bar, next phrase and next section. Publish both requested and effective values. A person moving energy upward should receive immediate visible feedback even if the bass entrance waits for the next bar. [Scheduling implications](12-audiobus-events-and-scheduling.md) are separate from the musical pattern representation.
