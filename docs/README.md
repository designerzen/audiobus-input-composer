# Research for an autonomous AudioBus composer Input

Research date: 24 November 2026. This is a design and research library, not an implemented Input. Research documents live in `docs/`; individual algorithm studies are in `docs/techniques/`.

The proposed instrument composes **musical events**: pitches, rhythms, rests, harmony, phrases, articulation, part entrances and expressive controls. AudioBus or connected instruments render them. Its central question is: **what musical decision should happen next, why, and how does it belong to what has already happened?**

The strongest starting point is a hybrid: explicit form and harmonic planning, reusable time-queryable patterns, seeded variation, motif memory, bounded constraint solving, and an independent output scheduler. Learned symbolic models can later propose phrases. They should not own the transport or erase compositional identity.

**Chosen interface:** the Plutchik emotion star from PhotoSYNTH.lol, adapted as a latched emotion/intensity selector with a separate Energy control. See [the interface specification](18-plutchik-interface.md) for the source component, region mapping and composer event contract.

## Reading routes

| Document | What it answers |
| --- | --- |
| [01 — Concept and boundaries](01-concept-and-boundaries.md) | What should an autonomous musical Input produce? |
| [02 — Inclusive City evidence](02-inclusive-city-lineage.md) | What existing research and code should inform it? |
| [03 — Annotated papers](03-annotated-papers.md) | What does each paper contribute, and what does it not establish? |
| [04 — Theory as executable rules](04-music-theory-as-rules.md) | How do scales, harmony, melody and counterpoint become decisions? |
| [05 — Rhythm and time](05-rhythm-and-time.md) | How do meter, Euclidean patterns, swing, phase and tempo work? |
| [06 — Emotion and energy](06-emotion-and-energy.md) | How can continuous controls steer expression without simplistic labels? |
| [07 — Form, memory and identity](07-form-memory-and-identity.md) | How does an endless generator develop rather than merely continue? |
| [08 — Algorithm catalogue](08-algorithm-catalogue.md) | Which generative methods suit which musical tasks? |
| [09 — Algorave and live coding](09-algorave-and-live-coding.md) | What can autonomous composition learn from live performance systems? |
| [10 — Open-source code reading](10-open-source-code-reading.md) | Which implementations are useful, and where should one inspect them? |
| [11 — Proposed architecture](11-composer-architecture.md) | How should the musical decision pipeline fit together? |
| [12 — AudioBus integration](12-audiobus-events-and-scheduling.md) | What does the local protocol support and what still needs design? |
| [13 — Worked compositions](13-worked-compositions.md) | How do the controls change actual note choices? |
| [14 — Evaluation and experiments](14-evaluation-and-experiments.md) | How will musical usefulness and correct behaviour be assessed? |
| [15 — Roadmap and decisions](15-roadmap-and-open-questions.md) | What should be built first, and which questions remain open? |
| [16 — Glossary](16-glossary.md) | What do the musical and computational terms mean? |
| [17 — Process composition and other grammars](17-process-composition-and-other-grammars.md) | How can phase, stochastic textures, serialism, canons and modular rules generate music? |
| [18 — Plutchik interface](18-plutchik-interface.md) | How does PhotoSYNTH's emotion star become the composer's main interface? |
| [19 — Algorave practice and lineages](19-algorave-history-practice-and-lineages.md) | What is inherited from the practice, and which systems are actual successors? |
| [20 — Pattern semantics and live edits](20-pattern-semantics-and-live-editing.md) | Why can similar pattern expressions produce different attacks and transitions? |
| [21 — System comparison and adoption](21-system-comparison-and-adoption.md) | What do the main environments contribute and leave unresolved? |
| [22 — Autonomous conductor](22-autonomous-conductor-and-dramaturgy.md) | How does software choose meaningful entrances, development, contrast and endings? |
| [23 — Collaboration and machine agency](23-collaboration-machine-agency-and-legibility.md) | Who proposes, commits, evaluates and corrects autonomous actions? |
| [24 — Symbolic notation and emotion programs](24-symbolic-notation-and-emotion-programs.md) | What sits between a wheel selection and resolved note events? |
| [25 — Additional live-coding papers](25-additional-live-coding-papers.md) | What do eight further papers establish, and how strong is the evidence? |
| [26 — Research gaps and experiments](26-research-gaps-and-experiment-programme.md) | What remains missing, and which experiments would resolve it? |
| [27 — HarmonEasy research and reuse](27-harmoneasy-research-and-reuse.md) | What do its pitch geometry, ensemble research and inspected code contribute? |
| [115 individual technique studies](techniques/README.md) | How does each algorithm work, affect symbolic output and respond to the controls? |
| [Combining techniques](techniques/COMBINING.md) | How can the methods form coherent, testable composition pipelines? |
| [Music theory as generative machinery](theory/README.md) | Which theory (schemata, counterpoint, tension, cadences, reharmonisation, groove, texture) was missing, and how does it drive generation? |
| [References and evidence ledger](references/README.md) | What was read, verified, inherited or unavailable? |

For a first implementation, read 01 → 06 → 11 → 12 → 15. For musical understanding, read 04 → 05 → 07 → 08 → 13. For checking the research, read 02 → 03 → references → 10.

For the deeper Algorave study, read 19 → 20 → 21 → 22 → 23. For the path from the Plutchik interface to a composer, read 18 → 24 → 22 → 26. The expansion treats browser ports, notations, collaborative editors, successor libraries and machine-agent research as different contributions rather than a single replacement timeline.

## Evidence conventions

The technique library groups 115 methods into twelve families, including probability, Markov memory, evolutionary search, cellular automata, grammars, dynamics, agents, constraints, musical transformations, learned models, pitch geometry and performance control. Start with [Markov chains](techniques/markov-chains.md), [genetic algorithms](techniques/genetic-algorithms.md), or [Game of Life](techniques/game-of-life.md), then use the combination recipes to give local generators phrase direction. Each study identifies mechanism, proposed use, output effects, control mapping, limitations, evaluation and sources. The [63 method-source records](techniques/sources.json) complement the 25 annotated paper cards; these are different counts, not 88 independently reviewed papers.

**Source finding** describes a paper, official manual or inspected implementation. **Proposal** is a design inference for this project. **Expected effect** is a musical prediction to test, not a proven listener outcome. All numeric mappings and example compositions in this library are original design sketches unless explicitly attributed.

The paper cards are deliberately selective. Inclusive City's imported tutorial bibliography contains hundreds of entries; its presence is not evidence that all those papers were read. Audio-generation papers appear only where their planning, context or evaluation ideas transfer to symbolic composition. No waveform-generation or synthesis implementation is proposed here.

All chapters link their principal evidence. Repository inspection metadata records exact commits and successful file reads. No dependency has been installed, no third-party code vendored and no musical effectiveness claimed from software inspection alone.
