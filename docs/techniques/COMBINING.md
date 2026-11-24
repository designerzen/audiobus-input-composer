# Combining generative techniques into a musical instrument

The collection is a menu of mechanisms, variants and design hypotheses. It should not become an engine that runs every mechanism simultaneously. Select methods by musical responsibility: material, development, coordination, expression or delivery. The recipes below are original project proposals, not replications of the cited systems.

## A shared contract

Every generator receives a frozen profile, harmony/collection, phrase span, control snapshot, motif references and seed key. It returns candidate events or candidate musical actions, plus provenance and obligations. A coordinator resolves shared budgets before a scheduler delivers the accepted score.

Separate three clocks for simulations: numerical/simulation step, musical sampling/readout and output transport. A Life board can evolve once per bar while being scanned on eighth notes. An evolutionary process may run many generations while preparing one future phrase. Neither changes the master tempo implicitly.

Use the [Plutchik interface](../18-plutchik-interface.md) for family and intensity and preserve Energy independently. The mapping from those controls to any technique is a proposed musical profile that needs testing, not a universal statement that fear equals randomness or anger equals high mutation.

## Recipe 1 — A dependable small tonal composer

Combine [Markov degree proposals](markov-chains.md), [Euclidean rhythm](euclidean-rhythms.md), [voice-leading](voice-leading-optimization.md) and a [finite-state arrangement](finite-state-machines.md).

The rhythm supplies attack opportunities, the chain supplies candidate degrees, harmony rules protect anchors, and the arrangement chooses part entrances. Energy modifies optional attacks and orchestration. The emotion profile modifies contour, articulation and eligible harmony at appropriate boundaries. The ending is planned above the chain.

**Evaluate:** compare the same motif vocabulary with independent note choices, then remove the conductor in a separate comparison. Count rejected proposals and inspect whether rhythm and melody remain coordinated. This is a strong initial baseline because each decision can be explained.

## Recipe 2 — A Life-driven instrument with memory

Combine [Game of Life](game-of-life.md), a [pitch-set decoder](pitch-set-bitmasks.md), [motif recall](factor-oracles.md) and a strict shared note budget.

Life supplies activity patterns, not an automatic melody. Choose scan, birth or sustain readout explicitly. Resolve proposals into the current collection and register; remember selected successful cells as motifs with provenance. The conductor can retain a still-life pattern, allow silence or reseed at a section boundary.

**Evaluate:** identical boards under three readouts, at matched budgets. Compare a board-driven pattern with a saved authored mask of the same density. This tests whether the state evolution adds useful development beyond an attractive visual metaphor.

## Recipe 3 — Evolutionary motif development

Combine [genetic algorithms](genetic-algorithms.md), [constraint validation](constraint-programming.md) and [MAP-Elites](map-elites.md).

Evolve variants of a pinned theme, preserving its phrase contract. Archive useful candidates by density, contour and another explicitly chosen descriptor. Select compatible neighbours in the archive rather than jumping arbitrarily between extreme cells. A candidate carries the plan revision it was prepared for.

**Evaluate:** equal-budget random search using the same representation and objectives. Include repair rates, archive duplicates and listener preference. A large archive or higher internal score alone is insufficient evidence of better development.

## Recipe 4 — Recursive long form with local variation

Combine [a phrase grammar](context-free-grammars.md), [parametric rewriting](parametric-l-systems.md) and [variable-order continuation](variable-order-markov.md).

The grammar supplies sections and entry/exit contracts. Rewriting transforms the theme at planned points. The local predictor fills small gaps between anchors. Do not let local continuation rewrite the return's recognizable rhythm or the ending target.

**Evaluate:** remove one layer at a time. Ask whether listeners recognize form and theme; inspect whether the grammar merely forces repetitive cadences or whether local variation remains audible.

## Recipe 5 — Emergent ensemble behaviour

Combine [Boids](boids.md), [resource allocation](musical-auctions.md) and [excitable answer networks](excitable-networks.md).

The simulation proposes related movements, but musical roles arbitrate the result. The lead retains priority at phrase anchors, answers use eligible slots and no agent controls tempo without explicit authority. A bounded cascade can become a fill; an unbounded feedback loop is a failure.

**Evaluate:** compare emergent coordination with an authored ensemble using identical cells. Measure foreground collisions, silence, repeated unison convergence and listener clarity. Cooperative motion in a simulated space is not sufficient evidence of good counterpoint.

## Recipe 6 — Harmonic geometry with thematic continuity

Combine [torus walks](musical-torus-walks.md), [set proximity](pitch-set-proximity-graphs.md), [common-tone voicings](voice-leading-optimization.md) and a pinned rhythmic motif.

The lattice proposes interval paths. The set graph chooses a route between harmonic colours. A voicing planner supplies playable registers, while the theme's rhythm retains a reference through the change. Keep absolute pitch, pitch class and lattice coordinate distinct.

**Evaluate:** compare geometric routes with direct interval sequences and random one-pitch set mutations. Use the same voicing policy so geometry is not credited for a difference caused by register or orchestration.

## Recipe 7 — Human-led adaptive accompaniment

Combine [gesture chronologies](gesture-score-chronologies.md), [score-aware following](score-aware-tempo-following.md), [phase-preserving launch](phase-preserving-launch.md) and a [lead-aware answer generator](factor-oracles.md).

The person supplies gestures or a melody, while the system supplies material and appropriately bounded responses. Use confidence and role ownership to decide whether to follow, defer or yield. Keep manual note requests separate from autonomous phrase launching, following the lessons in [HarmonEasy](../27-harmoneasy-research-and-reuse.md).

**Evaluate:** late joins, long rests, continued human phrases, missed notes and interruption. Assess control and contribution recognition alongside timing. A lower beat-error metric can coexist with a less understandable instrument.

## Recipe 8 — Learned proposals with a procedural core

Combine [a symbolic Transformer](symbolic-transformers.md) or [diffusion model](symbolic-diffusion.md) with explicit form, [constraint checking](constraint-programming.md), persistent motif identity and deterministic fallback.

Request future material using the actual harmonic plan and recent resolved context. Reject obsolete or late responses. A model may propose notes or actions; it does not own output timing. Store resolved events so replay does not require inference.

**Evaluate:** procedural baseline versus validated model proposals, including failure and rejection rates. Check whether additional vocabulary justifies runtime and control costs. Do not compare different renderers and attribute the result entirely to the model.

## Avoid confounded combinations

Two novelty sources can erase identity faster than either does alone. Two independent density controls can overfill a texture. A pitch quantizer can erase the dissonances that an optimizer deliberately prepared. A probabilistic rhythm gate can remove the anchor a grammar needed for closure. Declare the order of operations and what each stage must preserve.

Use exact symbolic fixtures for invariants, then matched listening comparisons for musical value. Mathematical complexity, artificial-life imagery and the number of algorithms involved are not musical objectives. Select the smallest combination that supports the intended behaviour, and add mechanisms when a specific limitation justifies them.
