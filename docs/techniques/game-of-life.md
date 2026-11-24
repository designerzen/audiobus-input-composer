# T031 — Conway’s Game of Life

Family: **Cellular automata and spatial processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

On a binary grid, dead cells with three neighbours are born; live cells survive with two or three.

## Proposed symbolic-music use

Treat rows as degrees and columns as rhythmic slots. Compare all-live-cell attacks, births-only attacks and persistent-cell sustains.

## Worked example or experiment setup

A three-cell horizontal blinker becomes vertical after one synchronous step, then horizontal again. These give different rhythmic and harmonic readings.

## Time, emotion and energy

Advance generations on beats or bars. Energy changes the event-selection budget; emotion selects the pitch/articulation mapping, not an assumed biological feeling.

## Failure modes and practical limits

Life can freeze, oscillate or die. Torus and dead-edge boundaries behave differently; in-place updates implement a different process.

## Evaluation

Verify block, blinker and glider patterns, then compare mappings at equal attack budgets and record every reseed.

## AudioBus integration

Separate simulation generation, musical readout and output transport. Save boundary rules and explicit birth/survival/death or scan-to-event mappings.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Golly: Life and outer-totalistic rules](https://golly.sourceforge.io/Help/Algorithms/QuickLife.html)
- [Golly: rule implementations](https://golly.sourceforge.io/Help/Algorithms/RuleLoader.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.

## Exact state and update semantics

Store a binary board and compute every next cell from the same previous generation. Use the eight surrounding cells as neighbours, excluding the centre. State whether boundaries are dead, wrapped or unbounded. Updating the board in place makes later cells depend on earlier updates and changes the process.

The transition is `nextAlive = neighbours == 3 or (alive and neighbours == 2)`. In a dead-bordered five-by-five board, live cells `(1,2),(2,2),(3,2)` form a horizontal blinker. The next generation contains `(2,1),(2,2),(2,3)`, and the following generation restores the original. A two-by-two block is stable. These are useful algorithm checks before any music mapping.

## One board, several very different instruments

With x as an eighth-note slot and y as a C-major degree, the horizontal blinker becomes three repeated E4 attacks at beats .5, 1 and 1.5. The vertical generation becomes simultaneous D4, E4 and F4 at beat 1. Both contain three live cells, but one sounds as a line and the other as a cluster. Population size therefore fails to describe texture by itself.

An alternative scans one column per step. A third interpretation emits only births. A fourth sustains a note while its cell survives. Each needs different timing and release semantics. Choose deliberately and compare them rather than claiming a unique sound of Life.

## Translating persistence into a note lifecycle

For a sustain mapping, birth starts an owned note, survival retains it and death releases it. Multiple cells can map to the same channel/pitch, so define collision ownership. A cell that disappears after its note was sent must still produce a release even if the new mapping assigns that coordinate somewhere else.

For a scan mapping, the board is a phrase template rather than a set of held notes. Every emitted event gets a gate and its own identity. A live cell revisited on a later scan can trigger a new event; a scheduler querying the same scan window twice must not duplicate it.

## Repetition, extinction and reseeding

Still lifes give static templates, oscillators give cyclic alternation and moving patterns can create register/rhythm migration under a fixed coordinate mapping. A stable shape may remain musically useful when the conductor changes orchestration. It need not be destroyed merely because the simulation stopped changing.

If a board empties, allow silence, introduce an authored seed at a section boundary, or select a different saved seed. Log the action. Random resurrection, changing birth/survival rules and mutating cells are valid extensions, but they produce a modified automaton rather than untouched Conway Life.

## Emotion and energy control

Keep the star outside the simulation semantics initially. Fear might select short repeated-cell interpretations and sadness might select sparse sustained interpretations under a particular musical profile, but those are creative hypotheses. Life has no intrinsic emotion vocabulary. Energy should bound accepted attacks and simultaneous voices; increasing population or generation speed alone can create clutter without useful expression.

Separate simulation rate, scanning rate and master tempo. A board may evolve once per bar while its pattern is read on eighth notes. Changing one rate should not silently change all three. Protect the section's harmonic plan and ending even if the simulation proposes incompatible notes.

## A useful comparison

Use identical saved seeds and compare scan, births-only and sustain mappings at matched output budgets. Record generation, boundary policy, pitch mapper, event extraction and reseeds. Assess rhythmic identity, polyphony, long-term development and target expression separately. Include empty, frozen and exploding cases; a selected glider demo does not establish robust autonomous music.
