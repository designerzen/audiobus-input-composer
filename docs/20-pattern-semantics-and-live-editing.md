# 20 — The missing technical core: pattern semantics and live edits

Two systems can display similar pattern syntax and produce different attacks. That difference is musical, not merely an implementation detail. This chapter specifies the choices a composer adapter must make.

## Four representations of musical process

| Representation | Natural operation | What must be stored for replay/seek |
| --- | --- | --- |
| Time query | Ask for events intersecting a span | Pattern program, version and frozen contextual inputs |
| Stateful stream | Ask for the next value/event | Iterator state, random state and position |
| Scheduled callback | Execute a musical action at a future position | Callback identity, arguments, deadline and revision |
| Clocked grid | Advance operators and state on a tick | Grid, frame position, operator state and external inputs |

Tidal/Strudel, SuperCollider streams, Extempore temporal recursion and Orca are useful reference cases, respectively. This is a comparison of representative mechanisms, not an assertion that each system has only one mechanism.

## Query fragments are not new note attacks

The [Strudel alignment documentation](https://strudel.cc/technical-manual/alignment/) distinguishes event fragments from events whose starts are present. A transformation can split an event's active span without creating a fresh attack at every fragment. Alignment policies also determine whose temporal structure is retained.

**Original example:** a note occupies cycle `[0,1/2)`. Scheduler queries `[0,1/4)` and `[1/4,1/2)` each see an overlap. Both fragments refer to one musical event. Emit one attack at 0 and its release at 1/2, not two quarter-cycle attacks. Preserve original span, overlap span and stable identity separately.

Seeking directly to 1/4 is a different operation. Decide whether to resume the held note, begin only at future attacks or replay from an earlier boundary. Do not accidentally use ordinary query-fragment handling as a seek policy.

## Joining patterns is a compositional decision

Suppose melody has three equal events in a cycle and a harmony-control pattern has two equal values. The harmonic boundary at 1/2 falls inside the middle melody event. At least three policies are reasonable:

1. **Sample at attack:** the middle note keeps the harmonic interpretation sampled at 1/3.
2. **Continuous reinterpretation:** the held event's control changes at 1/2 without a new attack, where delivery supports it.
3. **Rearticulate at intersection:** split the middle note and attack a new event at 1/2.

These produce different phrasing. A generic array `zip` chooses none of them clearly. A cycle-time intersection can create fragments; an explicitly rearticulating join creates new events. The [Tidal pattern-structure reference](https://tidalcycles.org/docs/reference/pattern_structure/) documents combination semantics that must be checked for the selected version. Do not assume historical Tidal and current Strudel defaults are interchangeable.

**Composer rule:** harmony-derived pitch selection samples at an attack unless a note has an explicit suspension/resolution plan. Continuous expressive controls have their own policy. A structural mask should say whether it gates new attacks, cuts held notes or both.

## Three lengths that must not be confused

An event may have a notated duration, an articulated gate and a period until the next attack. They can differ. A staccato note can end early while the next onset stays fixed; a legato gate can overlap the following onset. Sound tails belong to rendering, but note release belongs to the symbolic lifecycle.

Similarly, a rhythm cycle's length and the length of a pitch list can differ. A six-note motif placed into four equal beat cells requires an explicit distribution or wrapping rule. “Loop the arrays” is insufficient to establish a common phrase boundary.

## Temporal recursion and drift

Extempore's [time overview](https://extemporelang.github.io/docs/overview/time/) explains callbacks that schedule future callbacks and the need to carry intended time forward. The project lesson is to derive a new deadline from the previous intended deadline, rather than callback completion time. Its runtime's timing model does not transfer automatically to browser timers.

**Original example:** intended events occur every 1 beat. If each wake is 5 ms late and the next event is scheduled one beat after actual wake, lateness accumulates. If the next deadline is anchored to the intended beat, wake lateness remains a delivery error rather than silently altering the composition's tempo.

If a callback updates the harmony and another updates tempo, define an ordering for coincident deadlines. Make conductor decisions first, freeze the new plan, then resolve part events. Otherwise musical results depend on callback registration order.

## Strong time is not a transferable browser promise

[ChucK's time specification](https://chuck.stanford.edu/doc/language/time.html) treats time advancement explicitly in the language. It is useful as a model for coordinating concurrent musical processes. A JavaScript adapter sending through the current AudioBus protocol does not acquire that runtime's timing guarantees by adopting its syntax.

Keep separate claims for compositional precision, local scheduling precision and receiver onset precision. A rational timestamp establishes what should happen; it does not establish when a remote instrument actually acts.

## Live editing needs a transaction boundary

The [SuperCollider `Pdef` reference](https://doc.sccode.org/Classes/Pdef.html) provides a precedent for named, replaceable pattern definitions with quantization controls. For this project, treat a change as a candidate transaction with validation, an effective boundary and a revision.

```text
draft → parse/type-check → bounded event expansion → musical validation
      → choose effective boundary → commit revision → deliver future events
```

A failed candidate must leave the active revision intact. Validation should not emit notes as a side effect. The change record includes which parts are replaced, which sustained notes remain, how phase is handled and what happens to obsolete pending releases.

## Five distinct replacement policies

| Policy | Musical consequence | Appropriate use |
| --- | --- | --- |
| Preserve phase | New pattern joins the existing cycle position | A rhythmic variation within a groove |
| Restart locally | New phrase begins at its own zero | An intentional pickup or clearly marked new section |
| Quantized replacement | Wait for a declared beat/bar/phrase boundary | Harmony and arrangement changes |
| Overlap transition | Old and new symbolic parts coexist temporarily | Entrances/exits with a shared polyphony budget |
| Morph parameters | Interpolate supported parameters while preserving structure | Velocity, gate or selected numeric preferences |

An audio crossfade is not a general symbolic morph. Averaging MIDI pitches can produce chromatic notes outside both intended harmonies. Crossfading velocities can leave the old part sounding unless its notes are explicitly released. Prefer role-aware transformations and a clear lifecycle for each event.

## Error handling changes the music

Selected [Estuary source](https://github.com/dktr0/estuary/blob/717ca84b53d296519154e2aa5e60405aba071262/client/src/Estuary/Types/ParamPatternable.hs) converts a particular parser failure into silence. That is a local implementation fact, not a description of all Estuary error handling. For the Input, choosing silence versus retaining a previous part is an explicit musical policy. Failure silence should not be mistaken for an intended rest.

Selected [Topos evaluator source](https://github.com/Bubobubobubobubo/topos/blob/aa2eb0651d68df2df081397f3a41a58cc15c0d4a/src/Evaluator.ts) separates candidate and committed code, but executes code via `new Function` and races evaluation against a timer. A promise timeout alone does not preempt synchronous JavaScript execution. This is an architectural inference from the inspected file, not a complete runtime audit. Our bounded action language should avoid needing unrestricted evaluation at a musical deadline.

## Required semantic fixtures

Before adopting a pattern engine, test sustained events across query boundaries; 3-versus-2 pattern alignment; masks during held notes; speed changes mid-cycle; deterministic random queries in different orders; live replacement at a chord boundary; failed edits; and note releases after revision cancellation.

Store expected symbolic event traces for these cases. A manual and a passing syntax example are insufficient evidence that an adapter preserves musical meaning. [12](12-audiobus-events-and-scheduling.md) supplies the separate transport constraints.
