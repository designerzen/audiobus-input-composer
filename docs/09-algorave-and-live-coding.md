# 09 — Algorave, live coding and autonomous performance

This chapter is the introductory overview. The expanded study is [19 — practice and lineages](19-algorave-history-practice-and-lineages.md), [20 — pattern semantics and live edits](20-pattern-semantics-and-live-editing.md), [21 — system comparison](21-system-comparison-and-adoption.md), [22 — autonomous conductor](22-autonomous-conductor-and-dramaturgy.md), [23 — collaboration and agency](23-collaboration-machine-agency-and-legibility.md), [24 — musical programs](24-symbolic-notation-and-emotion-programs.md), [25 — additional papers](25-additional-live-coding-papers.md) and [26 — remaining gaps and experiments](26-research-gaps-and-experiment-programme.md).

Algorave is a performance practice, not an API. The [2014 NIME paper](https://nime.org/proc/nime2014_ncollins/index.html) is the historical research anchor here. “Successors” is best understood as later developments and related tools, not a claim that every current system descends from one tool or replaces the community.

## The central lesson

A live coder manages repetition, tension, entrances, exits and transformation while listening. Code generates events, but performance decisions shape the piece. An autonomous Input must supply that higher-level decision process explicitly. Porting a pattern interpreter without a phrase and arrangement policy transfers only part of the practice.

Useful performance actions include introducing one layer at a time, muting a dominant layer, delaying a return, transforming a familiar cell and committing changes at a cycle boundary. These can become autonomous arrangement actions with preconditions, duration and an explanation.

## TidalCycles and Strudel

[Tidal](https://github.com/tidalcycles/Tidal) offers a rich functional pattern model. [Strudel's pattern manual](https://strudel.cc/technical-manual/patterns/) makes a related model available in a browser-oriented environment; its [MIDI/OSC documentation](https://strudel.cc/learn/input-output/) shows that patterns need not be tied to a particular sound engine.

**Borrow:** time queries, pattern transformation and composability. **Effect:** compact rules can generate complex interlocking events without abandoning a shared temporal reference. **Boundary:** a future adapter should translate resolved events to the Input's own score schema and lifecycle policy. A Strudel sound name or sample bank is not a portable symbolic instrument definition.

The old GitHub Strudel repository is a pointer, and the current Codeberg repository could not be fetched through the web tool during this review. Current official documentation was read; no current Strudel source checkout was inspected or integrated. Recheck licensing and package boundaries before adopting code.

## SuperCollider patterns

The [official Pattern Guide](https://doc.sccode.org/Tutorials/A-Practical-Guide/PG_01_Introduction.html) separates reusable patterns from streams that produce values. Event patterns combine related musical attributes. This offers an alternative to interval-query functions: an evolving event stream with explicit state.

**Borrow:** reusable event dictionaries and independent attribute streams, plus clear state ownership. **Effect:** duration, degree and dynamics can vary together through compositional rules. **Boundary:** stateful streams need snapshots or replay logs for deterministic seek. SuperCollider's synthesis server is outside this Input's scope.

## Sonic Pi

The [official tutorial](https://sonic-pi.net/tutorial.html) offers accessible live loops, coordinated timing and seeded randomness. **Borrow:** named concurrent musical processes and deliberate synchronization. **Effect:** parts can evolve independently while rejoining a common pulse. **Boundary:** a browser Input should own one authoritative scheduling model rather than copying multiple language runtimes.

## FoxDot, Gibber and Sardine

[FoxDot](https://github.com/Qirky/FoxDot) is useful for pattern arithmetic and player-level manipulation. [Gibber](https://github.com/gibber-cc/gibber) provides a browser live-coding reference. [Sardine's documentation](https://sardine.raphaelforment.fr/) illustrates a later Python environment with clocked players and multiple pattern languages.

**Borrow:** concise transformations, named parts and changeable control functions. **Effect:** a small musical idea can be modified continuously rather than regenerated wholesale. **Boundary:** these are related design references; their presence is not evidence of current compatibility or maintenance quality. Only selected FoxDot source was inspected at a pinned commit; Gibber and Sardine were reviewed through repository overview or official documentation.

## Autonomy should remain interruptible

Define a safe action vocabulary rather than allowing unrestricted generated code: rotate a rhythm, transpose a motif, open a new layer, reduce density, prolong a phrase, recall a theme, cadence. Validate each action against profile constraints and a transition budget.

Keep a visible upcoming-change queue, a lock for each musical dimension and an immediate Stop. An autonomous system can still be a performable instrument. Its explanation can be plain: “returning to the opening motif in two bars” or “removing the counterline to leave space.”

## A useful first experiment

Author one 8-step rhythm and a four-note motif. Over sixteen bars, apply only rotation, density masking and octave exchange. Keep harmony fixed. Compare a fixed schedule, weighted random actions and an energy-dependent policy under identical seeds. Ask whether development is audible, whether the motif survives and whether changes arrive at convincing moments.
