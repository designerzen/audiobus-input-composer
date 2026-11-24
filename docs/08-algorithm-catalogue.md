# 08 — Generative methods and their musical consequences

This chapter is the overview. The [individual technique library](techniques/README.md) expands it into 115 studies, including Markov variants, evolutionary methods, Game of Life and other automata. Read [combination recipes](techniques/COMBINING.md) for ways to connect them to harmony, form and the Plutchik controls, and [HarmonEasy's contribution](27-harmoneasy-research-and-reuse.md) for pitch-set and ensemble evidence.

The table is an original engineering comparison, informed by [Tidal](https://github.com/tidalcycles/Tidal), [MorpheuS](https://arxiv.org/abs/1812.04832), [Pearce and Wiggins](https://www.marcus-pearce.com/assets/papers/PearceWiggins2012.pdf), [MusicVAE](https://arxiv.org/abs/1803.05428), and [OMax's official tutorial](https://forum.ircam.fr/article/omax5-tutorials/). Ratings are qualitative expectations, not benchmarks.

| Method | Best initial musical job | Expected result | Main failure | Live suitability |
| --- | --- | --- | --- | --- |
| Authored templates plus transformation | Motif, cadence, groove vocabulary | Clear style and recognizable recurrence | Obvious formula if vocabulary is narrow | Excellent with bounded templates |
| Pattern algebra | Rhythmic layering and time transformations | Coherent cycles and emergent alignment | Complexity without phrase direction | Excellent if queries are bounded |
| Weighted random choice | Select among musically valid alternatives | Controlled diversity | Independent choices have weak memory | Excellent |
| Random walk | Melodic contour or register movement | Locally connected lines | Drifts or meanders | Excellent with reflecting bounds and targets |
| Markov chain | Local pitch/rhythm continuation | Learned or authored local habits | Loops, dead ends, weak long form | Good with explicit fallback |
| Variable-order context model | Continuation and surprise scoring | Context-sensitive likelihood | Sparse contexts and corpus dependence | Good with bounded context |
| Grammar or L-system | Phrase expansion and formal recurrence | Hierarchical, self-related material | Mechanical expansion and event explosion | Good with depth/length limits |
| Constraint satisfaction | Voicing, counterpoint, cadences | Valid combinations with deliberate targets | Search blow-up or no solution | Good with bounded search and relaxation |
| Optimization / beam search | Best phrase from a small candidate set | Balances several competing criteria | Cost function becomes the aesthetic | Good at phrase lookahead |
| Evolutionary search | Offline style exploration | Unusual combinations of motifs and rules | Expensive, unstable, reward loopholes | Prefer offline or worker proposals |
| Cellular automaton | Rhythmic masks, phrase activity | Evolving repetition and texture | Chaotic or frozen states | Good with bounded grids |
| Coupled oscillators | Phase and pulse relationships | Gradual alignment and divergence | No built-in harmony or ending | Good with explicit musical anchors |
| Factor oracle | Recombine previously observed phrases | Familiar local transitions in new orders | Inappropriate jumps or over-repetition | Useful for symbolic improvisation |
| Symbolic neural model | Optional phrase proposals and interpolation | Rich learned vocabulary | Latency, control drift, provenance uncertainty | Only behind deadlines and fallback |

## Seeded stochastic choice

Choose from a constrained set rather than sample the whole pitch space and repair everything later. If a candidate has nonnegative cost `C`, a common soft selection is `p ∝ exp(-C/T)`. Lower temperature favours low-cost choices; higher temperature broadens selection. Temperature changes sampling, not musical quality or emotional arousal directly.

For reproducibility across scheduler query orders, derive random values from semantic coordinates: session seed, section ID, bar index, part, rule ID and candidate slot. A single mutable random stream means merely auditioning a bar can change the next performance. Specify the hash and random algorithm; implementation versions can change results.

## Markov and factor-oracle approaches

Model intervals and duration categories alongside metrical and harmonic context. Absolute pitches alone can trap a learned chain in its source key. Give a Markov generator backoff behaviour when a context has no continuation. Keep phrase and cadence obligations above the chain.

OMax's official material identifies factor-oracle-based stylistic recombination. For this project, a symbolic version could store tuples such as interval, rhythm and harmonic role. A suffix transition can preserve a shared context while jumping to another continuation. Filter against current meter and harmony. This would be a new implementation, not an integration of the legacy OMax repository.

## Constraints and graceful relaxation

Separate hard constraints (valid range, finite values, bounded polyphony, legal event lifetime) from soft ones (small leaps, preferred consonance, motif resemblance). If no candidate satisfies the profile, relax decoration preferences first, then substitute an authored cadence or rest. Never relax event validity to satisfy density.

Candidate scoring can combine harmonic fit, voice-leading, contour continuity, motif relation, controlled surprise and arrangement space. Report each component. A single scalar score hides why a candidate won and encourages reward loopholes such as repeating a safe tonic forever.

## Cellular automata, chaos and fractals

These are useful generators of activity patterns or control trajectories. A cellular automaton can mask attacks; a bounded chaotic sequence can choose among transformations; recursive subdivision can create self-similar rhythm. The mapping is where composition happens. Sending arbitrary numerical values straight to MIDI pitches rarely supplies harmonic direction or memorable form.

Use a scale/profile mapper, rhythm grammar, density cap and phrase plan after such processes. Compare against simple seeded randomness; mathematical sophistication is not evidence of greater musical interest.

## Recommended hybrid

Use deterministic form and motif selection, pattern-based rhythm, bounded voice-leading search, and weighted choice among valid ornaments. Add memory-based recombination next. Add learned proposals only when experiments show a specific musical limitation that the procedural system cannot address well.
