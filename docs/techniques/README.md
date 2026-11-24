# Individual generative-music techniques

There are **115 separate research documents** below, grouped into twelve families. The collection includes distinct methods and clearly named variants; it is not a claim that all 115 are unrelated algorithms or equally established musical practices. Every document has a mechanism, a concrete symbolic mapping, a worked setup, time/emotion/energy controls, failure modes, an evaluation proposal and sources. Markov chains, genetic algorithms and Game of Life have additional extended walkthroughs.

The focus is **music events and structure**, not waveform synthesis. Some sources are direct music research; others establish a general mathematical or computational method whose musical application here is explicitly proposed. None of the new mappings has been validated by a listening study.

## Start here

- [Markov chains](markov-chains.md): state, transition matrices, training counts, smoothing and phrase targets.
- [Genetic algorithms](genetic-algorithms.md): musical encoding, variation operators, evaluation and bounded online search.
- [Conway’s Game of Life](game-of-life.md): exact rules, readout choices, event lifetimes and complete small examples.
- [MAP-Elites](map-elites.md): a diverse library of useful variants rather than one optimized phrase.
- [L-systems](deterministic-l-systems.md): recursive material with explicit rhythm and pitch interpretation.
- [HarmonEasy research and reuse](../27-harmoneasy-research-and-reuse.md): pitch geometry, performance agency and lifecycle lessons.
- [Combining techniques](COMBINING.md): division of musical responsibilities, recipes and fair comparisons.

## Families and documents

### Probability and stochastic processes

| ID | Technique | Musical application |
| --- | --- | --- |
| T001 | [Weighted categorical choice](weighted-choice.md) | Use candidate motifs, chord functions or articulations as outcomes. Filter illegal candidates before normalization, so randomness selects a musically meaningful alternative. |
| T002 | [Bernoulli gates and stochastic masks](bernoulli-gates.md) | Apply gates to optional attacks while preserving motif anchors. Keep the mask keyed by bar, part and slot so overlapping queries agree. |
| T003 | [Poisson counts and event clouds](poisson-events.md) | Choose the number of ornamental events in a musical window, then map positions and pitches through the current profile. |
| T004 | [Renewal processes for rhythm](renewal-rhythm.md) | Use a rhythmic alphabet such as half, one and two beats instead of assuming every event occupies the same grid slot. |
| T005 | [Bounded random walks](bounded-random-walk.md) | Walk through scale degrees or voicing indices. Reflection keeps motion in a tessitura while preserving a sense of local movement. |
| T006 | [Mean-reverting stochastic control](mean-reverting-process.md) | Drive register centre, gate ratio or ornament preference toward a profile target while allowing temporary excursions. |
| T007 | [Coloured-noise control trajectories](coloured-noise-control.md) | Use slow correlated fluctuations for density or register instead of unrelated per-note random values. The output remains a symbolic control curve. |
| T008 | [Correlated multivariate sampling](correlated-multivariate-choice.md) | Couple gate, accent and leap preferences through a valid covariance structure, then project into allowable musical ranges. |
| T009 | [Low-discrepancy and quasi-random exploration](low-discrepancy-sequences.md) | Explore combinations of motif transformation, register and density when building an audition library. |
| T010 | [Bayesian preference updating](bayesian-preference-updating.md) | Learn session-local acceptance rates for optional motifs or actions from deliberate feedback, not from every Stop gesture. |

### Markov models and sequence memory

| ID | Technique | Musical application |
| --- | --- | --- |
| T011 | [First-order Markov chains](markov-chains.md) | Represent states as scale degrees, rhythmic cells or harmonic functions. Add metric and cadence constraints outside the chain. |
| T012 | [Higher-order Markov and n-gram models](higher-order-markov.md) | Use recent intervals and duration categories to preserve recognizable cells beyond one step. |
| T013 | [Variable-order Markov and prediction by partial matching](variable-order-markov.md) | Model intervals, rhythm and metrical viewpoints with explicit smoothing, borrowing the predictive framing of IDyOM. |
| T014 | [Hidden Markov models](hidden-markov-models.md) | Let hidden states represent phrase roles such as statement, response and closing, with separate note/rhythm emissions. |
| T015 | [Semi-Markov and explicit-duration models](semi-markov-models.md) | Represent section or phrase roles whose lengths matter musically, while a lower-level generator fills their material. |
| T016 | [Factorial and factored state models](factorial-state-models.md) | Separate harmonic region, texture and rhythmic activity, then constrain incompatible joint combinations. |
| T017 | [Constrained Markov generation and endpoint bridges](constrained-markov-bridges.md) | Choose a cadence target first, then favour transitions that can still reach it in the remaining slots. |
| T018 | [Time-inhomogeneous Markov chains](time-varying-markov.md) | Move from stable to exploratory harmonic preferences across a section without replacing the state vocabulary. |
| T019 | [Factor-oracle recombination](factor-oracles.md) | Store interval/rhythm tuples from authored or session motifs and jump between context-compatible continuations. |
| T020 | [Reinforced sampling and Polya-urn memory](polya-urn-memory.md) | Give a motif recurring presence within one session, while a decay or cap keeps one idea from taking over. |

### Evolution and quality-diversity

| ID | Technique | Musical application |
| --- | --- | --- |
| T021 | [Genetic algorithms for phrases](genetic-algorithms.md) | Encode a phrase as rhythmic cells, degree anchors and articulation genes. Decode and validate before calculating musical criteria. |
| T022 | [Typed genetic programming](genetic-programming.md) | Use typed operators such as sequence, rotate, mask and transpose; terminals are motifs or bounded patterns. |
| T023 | [Grammar-guided evolutionary encoding](grammatical-evolution.md) | Evolve phrase plans that can only produce legal sections, harmonic functions and motif transformations. |
| T024 | [Differential evolution of composer parameters](differential-evolution.md) | Search profile parameters such as contour bias, gate ratio and register spread; let a separate decoder realize notes. |
| T025 | [Covariance-matrix adaptation evolution strategy](cma-es.md) | Tune interacting symbolic preferences such as leap size, articulation and rhythmic contrast as a profile-level search. |
| T026 | [Pareto search with NSGA-II](nsga-ii.md) | Keep separate objectives for motif identity, target density and voice-leading instead of hiding their trade-offs in one score. |
| T027 | [Novelty search](novelty-search.md) | Define descriptors such as accent position, contour shape and rest distribution for phrase exploration. |
| T028 | [MAP-Elites and quality-diversity libraries](map-elites.md) | Build an auditionable motif library indexed by density and contour, while evaluating validity and identity within each cell. |
| T029 | [Interactive evolutionary selection](interactive-evolution.md) | Present a small, comparable set of motif variants and let the performer keep, reject or pin material. |
| T030 | [Co-evolution of musical parts](coevolution.md) | Evolve lead and answer candidates together, rewarding complementary rhythm and motif relations within shared budgets. |

### Cellular automata and spatial processes

| ID | Technique | Musical application |
| --- | --- | --- |
| T031 | [Conway’s Game of Life](game-of-life.md) | Treat rows as degrees and columns as rhythmic slots. Compare all-live-cell attacks, births-only attacks and persistent-cell sustains. |
| T032 | [Elementary cellular automata: Rules 30, 90 and 110](elementary-cellular-automata.md) | Read each generation as a rhythmic mask or use one column over time as a part trigger. Map rule outputs through a tonal vocabulary. |
| T033 | [Brian’s Brain](brians-brain.md) | Emit attacks only on entry to firing. Refractory states prevent an immediate retrigger at the same location. |
| T034 | [Cyclic cellular automata](cyclic-cellular-automata.md) | Map state to a motif family or harmonic colour and state changes to attacks, creating moving symbolic waves. |
| T035 | [Generations automata and cellular memory](generations-automata.md) | Use cell age to choose articulation or whether a motif is repeated, answered or allowed to fade. |
| T036 | [Reversible block cellular automata](reversible-block-automata.md) | Move a fixed population of rhythmic tokens between slots, conserving material while changing its arrangement. |
| T037 | [Probabilistic cellular automata](probabilistic-cellular-automata.md) | Introduce controlled uncertainty into a rhythmic mask while preserving deterministic anchors outside the grid. |
| T038 | [Lenia and continuous cellular automata](lenia.md) | Extract region mass, centroid and movement as slow symbolic register or texture controls, rather than emitting a note from every pixel. |
| T039 | [Gray–Scott reaction-diffusion](reaction-diffusion.md) | Use connected regions and threshold-crossing fronts to create phrase activity or spatially organized symbolic voices. |
| T040 | [Langton-style ant and mobile automata](langtons-ant.md) | Use turns as interval directions and visited cells as rhythm or motif-memory locations. |

### Grammars and rewriting

| ID | Technique | Musical application |
| --- | --- | --- |
| T041 | [Context-free musical grammars](context-free-grammars.md) | Let phrases expand into statement, response and cadence cells, each carrying a known duration and harmonic contract. |
| T042 | [Probabilistic context-free grammars](probabilistic-grammars.md) | Vary phrase structures while retaining the same hierarchical musical roles and terminal constraints. |
| T043 | [Deterministic L-systems](deterministic-l-systems.md) | Interpret the resulting string as interval moves, rests and rhythmic cells; keep the derivation separate from musical mapping. |
| T044 | [Stochastic L-systems](stochastic-l-systems.md) | Generate related phrase families whose branching structures vary without replacing the whole motif vocabulary. |
| T045 | [Context-sensitive rewriting](context-sensitive-l-systems.md) | Make a response depend on surrounding harmonic or phrase-role tokens, allowing locally aware development. |
| T046 | [Parametric L-systems](parametric-l-systems.md) | Attach degree offset, duration and accent to motif cells, enabling gradual growth or contraction. |
| T047 | [Graph grammars for form](graph-grammars.md) | Expand a section graph into statement, contrast and return structures with explicit incoming and outgoing harmonic conditions. |
| T048 | [Petri-net-inspired musical coordination](petri-nets.md) | Represent available musical roles or turn-taking permissions as tokens, so an answer begins only after its lead phrase has yielded. |
| T049 | [Finite-state arrangement machines](finite-state-machines.md) | Define sparse, moving, intense and closing textures, each with part permissions and minimum residence time. |
| T050 | [Behaviour trees for a musical conductor](behaviour-trees.md) | Prioritize Stop, cadence obligations, human turn-taking and optional development through a readable decision tree. |

### Dynamical systems and mathematical sequences

| ID | Technique | Musical application |
| --- | --- | --- |
| T051 | [Logistic-map control](logistic-map.md) | Map a bounded trajectory to phrase-level accent or motif-choice preferences, then apply musical constraints. |
| T052 | [Henon-map symbolic control](henon-map.md) | Map two related coordinates to contour centre and rhythmic-cell preference, using measured normalization bounds. |
| T053 | [Lorenz-system trajectories](lorenz-system.md) | Use changes between broad trajectory regions as section cues and one coordinate as a bounded register preference. |
| T054 | [Circle maps and modular phase processes](circle-maps.md) | Use phase crossing as an attack source and phase differences as rhythmic relationships between parts. |
| T055 | [Coupled phase oscillators and Kuramoto networks](coupled-phase-oscillators.md) | Assign parts to oscillators and trigger symbolic gestures at phase crossings, allowing alignment and divergence. |
| T056 | [Iterated function systems](iterated-function-systems.md) | Generate self-related register and duration preferences, then resolve them into a finite phrase vocabulary. |
| T057 | [Recursive and fractal rhythmic subdivision](recursive-rhythm-subdivision.md) | Create nested phrase rhythm while preserving total duration and selected anchor positions. |
| T058 | [Thue–Morse substitution sequences](thue-morse.md) | Use symbols to alternate two motif realizations, accent families or instrumental roles. |
| T059 | [Fibonacci words and unequal recurrence](fibonacci-words.md) | Assign A and B different rhythmic cells or section gestures to vary return intervals. |
| T060 | [De Bruijn sequences](de-bruijn-sequences.md) | Systematically audition local rhythmic or motif-choice combinations without independent random repetition. |

### Agents swarms and ecosystems

| ID | Technique | Musical application |
| --- | --- | --- |
| T061 | [Boids and flocking](boids.md) | Map agent height to register and group alignment to shared rhythmic direction; keep each agent assigned to a bounded musical role. |
| T062 | [Ant-colony-inspired phrase routing](ant-colony-optimization.md) | Let candidate agents explore chord or motif routes, depositing bounded preference on routes meeting phrase goals. |
| T063 | [Particle swarm optimization](particle-swarm-optimization.md) | Search a continuous composer-control space offline, with a fixed symbolic decoder and several evaluation scenarios. |
| T064 | [Predator–prey musical populations](predator-prey.md) | Map slowly changing populations to competing phrase textures, not individual animal-like notes. |
| T065 | [Replicator dynamics for strategy mixtures](replicator-dynamics.md) | Let repeat, answer and transform strategies compete for future phrase selection using explicit, inspectable payoffs. |
| T066 | [Sandpile and avalanche processes](sandpile-avalanche.md) | Use avalanches as candidates for short fills or orchestrational cascades, bounded by a phrase event budget. |
| T067 | [Diffusion-limited aggregation](diffusion-limited-aggregation.md) | Use a growing graph as a motif genealogy or source of branching phrase routes. |
| T068 | [Excitable and refractory networks](excitable-networks.md) | Model a network of answering motifs where one gesture can invite another after a known delay. |
| T069 | [Stigmergic shared musical memory](stigmergic-memory.md) | Let performed motifs leave tagged traces that bias later answers without a direct instruction from the original part. |
| T070 | [Resource auctions and role allocation](musical-auctions.md) | Treat foreground slots, register space and attack budgets as resources requested by musical parts. |

### Constraints graph search and optimization

| ID | Technique | Musical application |
| --- | --- | --- |
| T071 | [Constraint programming for musical events](constraint-programming.md) | Solve a short phrase with pitch ranges, chord anchors, duration totals and voice-separation requirements. |
| T072 | [SAT/SMT-style symbolic composition](sat-and-smt.md) | Represent whether a note occupies a slot, whether a voice crosses another and whether a prepared dissonance resolves. |
| T073 | [Mixed-integer and integer programming](mixed-integer-programming.md) | Allocate onsets, parts and register placements to meet a global density plan and minimize declared movement costs. |
| T074 | [Dynamic programming for phrase paths](dynamic-programming.md) | Select a sequence of voicings or melodic anchors with minimal declared transition cost over a fixed harmonic route. |
| T075 | [Shortest-path composition](shortest-path-composition.md) | Treat harmonic or pitch-set states as vertices and admissible transitions as edges. |
| T076 | [Beam search](beam-search.md) | Build phrases with several possible future continuations while limiting computation. |
| T077 | [A-star musical planning](a-star-search.md) | Plan a harmonic or motif-transformation route to a known future target. |
| T078 | [Monte Carlo tree search](monte-carlo-tree-search.md) | Explore a few phrase-level conductor actions by simulating their symbolic consequences over a short horizon. |
| T079 | [Wave Function Collapse for musical tiles](wave-function-collapse.md) | Use authored rhythmic/harmonic cells as tiles with entry, exit and voice-leading compatibility labels. |
| T080 | [Simulated annealing](simulated-annealing.md) | Refine a valid phrase by changing optional pitches, durations or voicings while protecting anchor obligations. |

### Musical transformations and combinatorics

| ID | Technique | Musical application |
| --- | --- | --- |
| T081 | [Euclidean and maximally even rhythms](euclidean-rhythms.md) | Build rhythm scaffolds, then separately choose rotation, accents, pitches and gates. |
| T082 | [Polymetric loop composition](polymetric-composition.md) | Use a short bass loop and a differently sized answer cycle to create changing alignments. |
| T083 | [Discrete and gradual phase shifting](phase-shifting.md) | Keep a motif recognizable while a second realization moves through new attack relationships. |
| T084 | [Isorhythmic pitch-duration pairing](isorhythmic-sequences.md) | Use a short pitch cell with a differently sized duration cell to generate limited-material variation. |
| T085 | [Canon and delayed imitation](canon-imitation.md) | Compose a source phrase with its answer in mind, retaining explicit provenance between voices. |
| T086 | [Serial rows and ordered pitch-class operations](serial-row-transformations.md) | Use a row as pitch-order structure while rhythm, register and articulation remain separate decisions. |
| T087 | [Constrained motif permutations](motif-permutation.md) | Keep first and last anchors and permute only interior cells, retaining a phrase’s entry and ending contracts. |
| T088 | [Tintinnabuli-inspired constrained pairing](tintinnabuli-inspired-pairing.md) | Create an experimental companion voice that chooses the nearest eligible triad tone above or below each melodic pitch. |
| T089 | [Voice-leading and voicing optimization](voice-leading-optimization.md) | Enumerate bounded voicing candidates and optimize across several chords, preserving a separate bass function. |
| T090 | [Transformational harmony graphs](transformational-harmony-graphs.md) | Traverse a graph of common-tone-preserving or profile-defined chord relationships while preserving a thematic rhythm. |

### Learned symbolic models and adaptation

| ID | Technique | Musical application |
| --- | --- | --- |
| T091 | [Recurrent and LSTM note models](recurrent-note-models.md) | Propose a melody continuation from recent resolved notes and the planned harmony, with a procedural fallback. |
| T092 | [Symbolic Transformer models](symbolic-transformers.md) | Propose longer motif-aware continuations while explicit plans retain section, harmony and ending authority. |
| T093 | [Variational autoencoders for motifs](music-vae.md) | Create related phrase variants for an authored theme, keeping selected rhythm or cadence anchors protected. |
| T094 | [Generative adversarial models for symbolic tracks](symbolic-gans.md) | Propose coordinated short textures or accompaniment candidates, then convert them into explicit note events. |
| T095 | [Diffusion models for symbolic scores](symbolic-diffusion.md) | Generate future phrases under form, harmony and texture conditions while preserving fixed regions. |
| T096 | [Retrieval-augmented symbolic composition](retrieval-and-recombination.md) | Search a provenance-preserving library by contour, rhythm, harmonic role and user-approved tags. |
| T097 | [Reservoir and echo-state sequence models](reservoir-computing.md) | Predict a small set of motif or rhythmic states rather than directly controlling every MIDI byte. |
| T098 | [Reinforcement learning for conductor actions](reinforcement-learning.md) | Choose bounded actions such as hold, answer, thin or return; keep event validation and transport ownership deterministic. |
| T099 | [Contextual bandits for musical action choice](contextual-bandits.md) | Select an optional transformation from a small library when explicit, appropriately labelled feedback exists. |
| T100 | [Bar-conditioned symbolic style transfer](bar-conditioned-style-transfer.md) | Use a theme as content and alter rhythmic intensity or polyphony in future bars, with explicit protected regions. |

### Pitch-set geometry and harmonic spaces

| ID | Technique | Musical application |
| --- | --- | --- |
| T101 | [Pitch-set bitmasks and exhaustive collection spaces](pitch-set-bitmasks.md) | Use complete set membership as a pitch vocabulary, including silent and sparse sets rather than only named scales. |
| T102 | [Transposition/inversion set-class orbits](set-class-orbits.md) | Browse related harmonic materials without confusing a class representative with its particular voiced realization. |
| T103 | [Modal rebasing and collection rotation](modal-rebasing.md) | Create related pitch vocabularies for contrast or return, preserving degree-aware motif information where possible. |
| T104 | [Complementary pitch collections](complementary-pitch-sets.md) | Use a complement as contrast material or a mutually exclusive answering vocabulary, then plan the join back. |
| T105 | [Affine pitch-class transformations](affine-pitch-transformations.md) | Explore related interval structures through reflection, transposition and coprime multiplication. |
| T106 | [Interval-class vectors and cyclic autocorrelation](interval-vectors-autocorrelation.md) | Use interval content as one descriptor when retrieving or contrasting collections, alongside root and functional information. |
| T107 | [Pitch-set proximity and mutation graphs](pitch-set-proximity-graphs.md) | Plan harmonic colour paths by adding, removing or moving one pitch class at a time. |
| T108 | [Musical torus and lattice walks](musical-torus-walks.md) | Move a symbolic cursor through chromatic and fourths-related directions, mapping the path into a melody or harmonic route. |
| T109 | [Symmetry and limited transposition](symmetry-limited-transposition.md) | Use symmetric collections as stable colour fields or as contrasting material with fewer distinct transpositions. |
| T110 | [Directional pitch-set quantization](directional-pitch-quantization.md) | Use quantization as a constrained decoder for stochastic/agent proposals, preserving original release addresses. |

### Interactive performance and adaptive timing

| ID | Technique | Musical application |
| --- | --- | --- |
| T111 | [Gesture-to-score chronologies](gesture-score-chronologies.md) | Let a person control when an authored or generated onset occurs while the composer supplies pitch and phrase context. |
| T112 | [Landmark and target synchronization](target-synchronization.md) | Let an answering phrase recover toward a future bar or cadence without bursting through all missed attacks. |
| T113 | [Phase-preserving groove launch](phase-preserving-launch.md) | Queue bass or percussion entrances at compatible boundaries while preserving the current arrangement position. |
| T114 | [Score-aware human tempo following](score-aware-tempo-following.md) | Follow a designated performer or confidence-weighted group while preserving a separate phase-correction policy. |
| T115 | [Mixed-initiative musical arrangement](mixed-initiative-arrangement.md) | Allow autonomous bounded development while the person controls targets, locks, recall and rejection. |

## Evidence and records

[catalogue.json](catalogue.json) records the per-technique fields and source keys. [sources.json](sources.json) records the selected primary/official and local research references. References were reviewed at overview, abstract, relevant documentation or selected local-code level; the collection is not a systematic full-paper review or an execution audit of those libraries. Detailed limitations and access failures are recorded in the broader research ledger.
