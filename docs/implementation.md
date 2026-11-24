# Library, web component and deployment

Version 0.1.0 implements a focused, runnable symbolic composer. The numbered research chapters retain their original research scope; this document is the implementation contract. The source exports in `src/` and generated declarations in `dist/` define the exact API.

## Package layout and builds

`pnpm build:lib` compiles TypeScript to dependency-free ESM with declarations and source maps in `dist/`. The core entry has no DOM or audio initialization and can be imported in Node. The component entry requires a browser and registers `<audiobus-composer>` once. Importing the core never registers an element or requests audio/MIDI permissions.

`pnpm build` also creates a Vite demo in `site/`, with a standalone copy of the library in `site/library/`. Serve these modules over HTTP(S); direct `file:` module loading is not supported. Vite uses a relative base so repository Pages paths work. `pnpm pack` builds a local package archive for consumers; no registry publication is configured. SVG provenance is retained in [the third-party notice](../THIRD_PARTY_NOTICES.md).

## Pure composition

```js
import { compose, composePhrase, scoreToMidi } from './dist/index.js';

const options = {
  seed: 'my-theme', emotion: 'sadness', intensity: 0.8, energy: 0.6,
  algorithm: 'life', tempo: 110, root: 2, mode: 'auto', bars: 16,
  swing: 0.1, parts: ['melody', 'bass', 'harmony', 'percussion'],
};
const score = compose(options);
const secondPhrase = composePhrase(options, 1); // Starts at beat 32 by default
const midiBytes = scoreToMidi(score);
```

All options are optional. `normalizeOptions` supplies defaults and rejects malformed inputs. Composition is synchronous and bounded, with no model downloads, network calls or application-global random stream. Algorithm/version/seed and controls must match for regeneration; save the resolved score when the actual result matters.

| Option | Values / default |
| --- | --- |
| `seed` | Nonblank string of 1–128 characters; `first-light` |
| `emotion` | `joy`, `trust`, `fear`, `surprise`, `sadness`, `disgust`, `anger`, `anticipation`; `joy` |
| `intensity` | 0–1; 2/3 |
| `energy` | 0–1; 0.5 |
| `algorithm` | `motif`, `markov`, `life`, `evolution`, `grammar`, `euclidean`, `torus`; `motif` |
| `tempo` | 30–240 BPM; 104 |
| `root` | Integer pitch class 0–11, C=0; 0 |
| `mode` | `auto`, `major`, `minor`, `dorian`, `mixolydian`; `auto` follows the emotion profile |
| `bars` | Multiple of eight from 8–128; 16, for finite `compose` scores |
| `swing` | Delay of odd eighth-note slots in beats, 0–0.45; 0 |
| `parts` | Unique subset of `melody`, `bass`, `harmony`, `percussion`; all four. Empty means silence. |

Time is measured in quarter-note beats. Current phrases are eight bars of 4/4. MIDI channels are 1 melody, 2 bass, 3 harmony and 10 percussion. Melody events carry degree annotations; other events preserve musical reasons. IDs combine phrase, part and serial identity. Bars annotate chord, phrase function and a simple harmonic-tension heuristic.

### Implemented generators and theory

| Engine | Actual mechanism | Shared musical constraints |
| --- | --- | --- |
| Motif | Seeded four-degree theme; answering bars modify interior material | Chord-tone anchors, contour, cadence and note budget |
| Markov | Additively smoothed degree-transition model from the theme and a short authored continuation | Same phrase planner; no external training corpus |
| Game of Life | Wrapped 7×8 B3/S23 board, one synchronous generation per bar; columns suggest activity and degree | Anchor preservation deliberately means the musical readout may continue after board extinction |
| Evolution | Population 16, 12 generations; tournament selection, crossover, interior mutation and two elites | Fixed anchors; theme-distance, leap and diversity objective, not listener-rated fitness |
| Grammar | Five bounded Fibonacci rewrites A→AB/B→A select theme/neighbor alternatives | An operator sequence, not a trained phrase grammar |
| Euclidean | Even circular distribution of 2–7 eligible attacks, rotating motif readout | Strong-beat anchors and cadence can override the raw mask |
| Torus | Walk in `p=(x+5y) mod 12`, compressed to seven-degree proposals | The decoder changes raw lattice intervals; this is not an unaltered torus performance |

The conductor cycles Establish → Develop → Contrast → Return across phrases. Harmony is an authored tonal/modal degree plan, with a dominant half cadence at bar four and a tonic arrival at bar eight. Minor profiles raise the dominant chord's third. Three-voice voicings minimize total movement in a bounded register. Bass and percussion have distinct roles. Optional attacks scale with Energy; the emotion profile influences mode, contour, gates and accents. Harmony can be held in a chosen collection by setting `mode` explicitly.

These are engineering rules for a first musical profile. The bar tension value is a degree-based descriptive heuristic, not the composite perceptual tension model proposed in the theory research, and it does not run candidate scoring. There is no general species-counterpoint solver, formal Galant schema realizer, modulation planner, learned model, automatic score follower or non-Western style model. The research folder's 115 methods and thirteen theory studies are not all implemented APIs.

### Standalone theory tools

Core exports also include `random` (FNV-1a/Mulberry32), `weighted`, `degreePitch`, `euclidean`, `lifeStep`, `trainMarkov`, `evolveMotif`, `voiceLead`, `pitchMask`, `quantize` and `intervalVector`. `voiceLead` accepts exactly three distinct pitch classes and three previous voices. Quantization works on MIDI 0–127, resolves nearest ties downward and returns `undefined` for an empty collection. The Life function supports dead or wrapped boundaries, independently of its musical readout.

## AudioBus and playback

```js
import { compose, Transport, audioBusOutput } from './dist/index.js';

const player = new Transport(audioBusOutput(connectedPeer), {
  onEvent: record => console.log(record),
  onStop: reason => console.log(reason),
  onError: error => console.error(error),
});
player.start(compose({ bars: 8 }));
// Later:
player.stop();
```

`connectedPeer` is an already connected `audiobus-protocol` Peer, or a compatible object with `sendMidi(bytes)`. Connection establishment, pairing, authorization and host discovery remain the host application's responsibility. No dependency on a sibling checkout or guessed cross-window MIDI wire format is introduced.

The adapter dispatches immediately when the local scheduler says a message is due. Future events stay local. The scheduler uses monotonic `performance.now()` and a 10ms polling timer; this is a best-effort browser clock, not sample-accurate or synchronized remote scheduling. A wake gap over 300ms stops playback and releases owned notes instead of replaying a backlog. Hosts can inject `now`, call `start(score, false)` and drive `tick()` themselves.

Overlapping same-channel/same-pitch events use explicit release/retrigger. An old event's pending release cannot stop the newer owner. Stop and output replacement cancel queued attacks and release every owned address without channel-wide panic. Use dedicated channels when sharing an instrument. An output that is already disconnected may not receive releases; the host must implement receiver-side recovery. Core consumers must stop on their own disconnect, hidden-tab and lifecycle signals. The web component already handles page hiding, removal and MIDI disconnect.

`webMidiOutput(midiOutput)` adapts a browser MIDIOutput. Permission is requested only through the component's Connect MIDI option or an explicit host request. The first version uses MIDI 1.0 semitones, with no pitch-bend allocation, UMP negotiation, external MIDI clock or tempo-following capability.

### Continuous sessions

```js
import { ComposerSession, audioBusOutput } from './dist/index.js';

const session = new ComposerSession({ seed: 'my-theme' }, audioBusOutput(peer), {
  onPhrase: phrase => console.log(phrase.section),
  onStop: reason => console.log(reason),
});
session.start();
session.update({ emotion: 'fear', energy: 0.25 }); // Next eight-bar boundary
session.finish(); // Current phrase reaches its tonic cadence, then stops
// session.stop(); // Immediate cancellation and owned-note release
```

`session.options` is the selected target, `session.applied` the current snapshot, and `session.beat` the position within the current phrase. Tempo changes are also applied at the next phrase. Each new phrase uses a snapshot of the selected controls; already scheduled notes remain unchanged. The finite `bars` option does not limit continuous sessions.

`session.recording` returns a cloned performance record: resolved phrase snapshots with monotonic start observations and actual MIDI dispatch records. Capture is bounded to 1,024 phrases / 100,000 dispatches; `truncated` flags an exceeded bound. Dispatch time measures the sender, not the receiver's acoustic onset. Phrase snapshots include planned events even if playback stopped early; dispatches identify messages actually sent. Fixed-tempo score replay uses `Transport.start(savedScore)`. Variable-tempo live recordings are logs, not a file the current transport automatically replays.

## Web-component contract

```html
<script type="module" src="./library/component/index.js"></script>
<audiobus-composer seed="first-light" emotion="anticipation"
  intensity="0.7" energy="0.5" algorithm="markov" tempo="104">
</audiobus-composer>
```

Importing the component entry registers it idempotently. `defineComposer()` is also available to ensure registration of the default tag. To register an additional tag, subclass the exported `AudioBusComposer` class and register that subclass, because the custom-element registry requires a distinct constructor per tag. Create instances through the DOM after registration. Shadow DOM isolates styles and controls. The component is browser-only; SSR consumers should import the core and load the component on the client.

Attributes: `seed`, `emotion`, `intensity`, `energy`, `algorithm`, `tempo`, `root`, `mode`, `swing`. Numeric attributes use the same ranges as the library. The `options` property accepts a partial update including `parts` or `bars`; `configure(patch)` does the same. Property changes do not reflect back into HTML attributes. `score` returns a clone of the displayed resolved plan, `recording` returns the performance log, and `playing` reports transport state.

Methods: `start()` (async; browser audition needs a user gesture), `stop()`, `finish()`, `configure(patch)`, `connectPeer(peer)`, `setOutput(adapter)` and `connectMidi()` (async). Assigning `element.peer = peer` attaches an existing AudioBus Peer and selects that output; clearing it returns to browser audition. Custom output adapters implement `send(bytes)` and optionally `label`. Output changes stop the current performance.

| Bubbling, composed event | `detail` |
| --- | --- |
| `composer-control-change` | `{selected, applied, pending}`; selected options and current snapshot, or null applied when stopped |
| `composer-phrase` | Resolved `Phrase` at the start of each live phrase |
| `composer-note` | `DispatchRecord`, including both note-ons and note-offs |
| `composer-state-change` | `{playing, phrase? , reason?}` |
| `composer-error` | `{message}` |

The star preserves all source regions; aliases select the same named emotion. Click/tap latches a selection. Pointer dragging updates it. Enter/Space selects; Left/Right changes family and Up/Down intensity. Equivalent labelled family and intensity inputs are always available. Selection never triggers immediate notes. Start/Stop are independent. A visible status distinguishes selected and applied controls. Reduced-motion preferences disable transitions.

Browser audition is a small optional Web Audio renderer for checking musical output; it is separate from the composition library. The volume control affects only that renderer. MIDI and AudioBus receivers supply their own instruments and level controls. Browser tests exercise audition lifecycle and output dispatch; they do not establish subjective sound quality or measured acoustic latency.

Score JSON/MIDI exports contain the current plan (the first 16-bar preview initially, or the current eight-bar phrase while/after live playback). MIDI export is format 0, 480 PPQ with fixed tempo, 4/4 and explicit note-offs. It supplies notes/channels, not instrument patches. Save performance log exports phrase snapshots and dispatches, not a recording of audio.

## Deployment and checks

The [CI workflow](../.github/workflows/ci.yml) checks types, runs library tests, builds and runs Playwright on desktop Chromium and a mobile viewport. The [Pages workflow](../.github/workflows/deploy.yml) repeats those checks before publishing `site/`. Enable the repository's Pages source as **GitHub Actions**, then push to `main` or manually dispatch the deployment workflow. The workflow uses Node 24, the package-manager pin and frozen-lockfile installs. No npm token or custom deployment secret is required. Repository/environment restrictions still apply.

The deployment includes `library/index.js` and `library/component/index.js` with their relative module trees, enabling direct browser imports and embedding. Build products are ignored by Git; source and the lockfile are the deployment inputs. A successful local build does not mean the repository has been pushed or a live Pages deployment has completed.

Tooling follows [Vite's static deployment guide](https://vite.dev/guide/static-deploy.html), [GitHub's Pages custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [custom-element lifecycle guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). These are implementation references, separate from the music research evidence ledger.
