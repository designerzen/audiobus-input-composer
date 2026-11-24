# AudioBus Input Composer

An autonomous composer that creates musical events from rules, musical memory, time, emotion and energy, then sends them into AudioBus for connected instruments to perform.

The aim is to let a person establish a musical identity, steer its expression and hear it develop without entering every note. The composer should remember themes, coordinate parts, create contrast, leave space and bring phrases to meaningful endings. Its decisions should be understandable, reproducible and open to adjustment.

**Current status:** version 0.1 includes a working TypeScript composition library, an `<audiobus-composer>` web component, a browser demo, AudioBus/MIDI output adapters, automated tests and GitHub Pages deployment workflows. The research library describes a broader programme than the current implementation.

## Run it

Use Node.js 24 and pnpm 10.28.2 (the pinned package manager).

```sh
pnpm install
pnpm dev
```

Open the local address printed by Vite. Choose an emotion, set Energy and press **Start composing**. The instrument develops successive eight-bar phrases until Stop or Finish phrase. Control changes apply to the next phrase; Stop immediately releases owned notes. Browser audition requires the Start gesture. You can also choose a MIDI output or attach an existing AudioBus Peer.

```sh
pnpm check          # Type checking
pnpm test           # Library, musical invariants and transport tests
pnpm build          # ESM library + declarations in dist/, deployable demo in site/
pnpm exec playwright install chromium
pnpm test:browser   # Desktop and mobile component tests against the built site
```

## Use the library or component

After building, import the library directly from `dist/index.js` in Node or a browser. The package exports also support `audiobus-input-composer` and `audiobus-input-composer/component` when installed from a local package archive. No npm publication is assumed.

```js
import { compose, scoreToMidi } from './dist/index.js';

const score = compose({
  seed: 'first-light', algorithm: 'markov', emotion: 'anticipation',
  intensity: 0.7, energy: 0.5, tempo: 104, bars: 16,
});
const midiFile = scoreToMidi(score);
```

```html
<script type="module" src="./dist/component/index.js"></script>
<audiobus-composer emotion="joy" energy="0.5"></audiobus-composer>
```

```js
const composer = document.querySelector('audiobus-composer');
composer.peer = existingAudioBusPeer; // A connected audiobus-protocol Peer with sendMidi(bytes)
composer.addEventListener('composer-phrase', event => console.log(event.detail));
```

See the [API and integration guide](docs/implementation.md) for options, events, host-owned playback, recording, deployment and implementation limits.

## Deploy the demo

[The deployment workflow](.github/workflows/deploy.yml) builds and tests the library and web component, then publishes `site/` to GitHub Pages on pushes to `main` or manual dispatch. Enable **Settings → Pages → Source → GitHub Actions** in the repository, then push the files to `main`. The workflow's deployment environment reports the resulting URL. Its relative asset paths support repository subdirectories and custom domains.

The deployed site includes standalone ESM modules under `library/` for embedding. [Continuous integration](.github/workflows/ci.yml) runs type checks, unit tests, production builds and desktop/mobile browser tests on pull requests. The workflows do not publish a package to npm.

## Implemented musical foundation

Seven material engines—motif development, Markov memory, Game of Life, evolutionary search, Fibonacci rewriting, Euclidean patterns and torus walks—feed one theory-guided planner. It provides an eight-bar presentation/answer structure, dominant preparation and tonic cadence, major/minor/modal collections, chord-tone anchors, motif elaboration, bounded contour, three-voice inversion search, bass roles, percussion activity and swing.

The Plutchik interface retains PhotoSYNTH's original 32 SVG paths and maps them to 24 named selections. Energy remains independent of intensity. Scores preserve part, degree, motif and decision provenance; exports provide MIDI and JSON. Live performance logs preserve phrase snapshots and actual MIDI dispatches.

This version implements a focused subset of the research. Full species-counterpoint solving, formal schemata/partimento realization, calibrated tension models, reharmonisation grammars, learned models, microtonal transport and the wider 115-method catalogue remain research topics. Emotion mappings are creative profiles awaiting listening evaluation.

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
