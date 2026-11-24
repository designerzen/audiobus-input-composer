# AudioBus Input Composer

An autonomous composer that creates musical events from rules, musical memory, time, emotion and energy, then sends them into AudioBus for connected instruments to perform.

The aim is to let a person establish a musical identity, steer its expression and hear it develop without entering every note. The composer should remember themes, coordinate parts, create contrast, leave space and bring phrases to meaningful endings. Its decisions should be understandable, reproducible and open to adjustment.

**Current status:** this repository contains research and design documents. The composer, interface and AudioBus integration have not yet been implemented.

## What we are trying to achieve

Build an Input that supplies its own musical activity: melody, bass, harmony, percussion, rests, articulation and expressive controls. It should work across several timescales, from the next attack to a phrase, section and complete performance.

A small motif should be able to become a recognizable musical identity. The system can repeat it, answer it, transform it, move it between parts and return to it after contrasting material. Harmony, rhythm and arrangement should support that development rather than emerge from unrelated generators competing for attention.

The output is symbolic music: pitches, onsets, durations, velocities, note releases and supported control events. AudioBus and the receiving instruments turn those decisions into sound. Musical meaning such as scale degree, harmonic role, phrase position and motif origin belongs in the internal score, beyond the information carried by an individual MIDI message.

## How a person steers it

The primary interface will adapt the **Plutchik emotion diagram from PhotoSYNTH.lol**. Selecting an emotion and its intensity expresses an intended character. A separate **Energy** control steers activity and arrangement. Musical profiles define how those intentions affect contour, harmony, rhythm, articulation and development.

These mappings are creative hypotheses to evaluate with listeners. They need to preserve differences between emotional families and allow several musical interpretations of the same selection. Changes should take effect at suitable musical boundaries, with clear feedback about the selected and currently applied state.

See the [Plutchik interface specification](docs/18-plutchik-interface.md).

## How the composer could work

The proposed engine combines a conductor for form and phrase goals, a harmony planner, motif memory and generators for individual parts. An arrangement stage coordinates their proposals. A validator and scheduler deliver the accepted score and manage note lifetimes. A performance record preserves the resolved events and the reasons behind important choices.

The research explores Markov chains, evolutionary search, Game of Life and other automata, grammars, pattern algebra, constraints, agents, pitch geometry and learned symbolic models. Each method has a musical responsibility and explicit limits. The goal is to choose useful combinations and test their contribution to coherence, expression and control.

Algorave and live-coding systems inform pattern structure, musical time, variation and live transitions. Inclusive City informs planning, identity and memory. HarmonEasy contributes pitch-set exploration, harmonic geometry, ensemble agency, synchronization and practical AudioBus note handling.

## What a successful first version looks like

- Develop a small authored motif over several minutes while retaining a recognizable identity.
- Coordinate melody, bass and accompaniment around shared phrase and harmonic goals.
- Respond audibly to emotion and Energy changes while preserving committed musical events.
- Handle silence, transitions, timing interruptions and stopping with correct note releases.
- Save and replay the actual performed score, with inspectable decisions and control history.

## Explore the research

- [Research index](docs/README.md): the complete reading guide and evidence conventions.
- [Concept and boundaries](docs/01-concept-and-boundaries.md): intended behaviour and success criteria.
- [Composer architecture](docs/11-composer-architecture.md): musical planning, ownership and event delivery.
- [115 individual technique studies](docs/techniques/README.md): mechanisms, examples, output effects, control mappings, limitations and sources.
- [Combining techniques](docs/techniques/COMBINING.md): eight proposed composition pipelines and ways to evaluate them.
- [Algorave practice and lineages](docs/19-algorave-history-practice-and-lineages.md): the practice, related systems and successor relationships.
- [HarmonEasy research and reuse](docs/27-harmoneasy-research-and-reuse.md): findings from its research and selected implementation paths.
- [Roadmap](docs/15-roadmap-and-open-questions.md) and [research gaps](docs/26-research-gaps-and-experiment-programme.md): implementation priorities and unresolved questions.

The documents distinguish source findings, inspected code, inherited interpretations and project proposals. Documentation and mathematical checks establish consistency; musical usefulness still requires a working instrument and listening evaluation.
