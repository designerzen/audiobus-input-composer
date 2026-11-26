# Library, web component and deployment

Version 0.2.0 implements a focused, runnable symbolic composer with thirteen genre idioms. The numbered research chapters retain their original research scope; this document is the implementation contract. The source exports in `src/` and generated declarations in `dist/` define the exact API.

## Package layout and builds

`pnpm build:lib` compiles TypeScript to dependency-free ESM with declarations and source maps in `dist/`. The core entry has no DOM or audio initialization and can be imported in Node. The component entry requires a browser and registers `<audiobus-composer>` once. Importing the core never registers an element or requests audio/MIDI permissions.

`pnpm build` also creates a Vite demo in `site/`, with a standalone copy of the library in `site/library/`. Serve these modules over HTTP(S); direct `file:` module loading is not supported. Vite uses a relative base so repository Pages paths work. `pnpm pack` builds a local package archive for consumers; no registry publication is configured. SVG provenance is retained in [the third-party notice](../THIRD_PARTY_NOTICES.md).

## Pure composition

```js
import { compose, composePhrase, scoreToMidi } from './dist/index.js';

const options = {
  seed: 'my-theme', emotion: 'sadness', intensity: 0.8, energy: 0.6,
  algorithm: 'life', genre: 'bossa', tempo: 110, root: 2, mode: 'auto', bars: 16,
  swing: 0.1, parts: ['melody', 'bass', 'harmony', 'percussion'], programs: false,
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
| `genre` | `pop`, `house`, `techno`, `boom-bap`, `trap`, `jazz`, `bossa`, `reggae`, `rock`, `galant`, `minimal`, `ambient`, `chiptune`; `pop` |
| `tempo` | 30–240 BPM; 104 |
| `root` | Integer pitch class 0–11, C=0; 0 |
| `mode` | `auto`, `major`, `minor`, `dorian`, `mixolydian`, `lydian`, `phrygian`, `harmonic-minor`, `locrian`; `auto` follows the emotion and intensity within the modes the genre allows |
| `bars` | Multiple of eight from 8–128; 16, for finite `compose` scores |
| `swing` | Delay of odd eighth-note slots in beats, 0–0.45, added to the genre's own swing; 0 |
| `parts` | Unique subset of `melody`, `bass`, `harmony`, `percussion`; all four. Empty means silence. Genre sections may rest some of them. |
| `programs` | Send General MIDI Program Change hints for the genre's instruments; `false` |
| `motif` | Optional theme of 2–8 scale degrees (0–6), such as a played line; otherwise the seed invents one |

Time is measured in quarter-note beats. Current phrases are eight bars of 4/4. MIDI channels are 1 melody, 2 bass, 3 harmony and 10 percussion. Melody events carry degree annotations; other events preserve musical reasons. IDs combine phrase, part and serial identity. Bars annotate chord, Roman numeral, phrase function, the chosen bar's estimated tension and the target tension. Phrases record genre, section, tonic (after any key lift), mode, cadence and whether it closes.

### Implemented generators and theory

| Engine | Actual mechanism | Shared musical constraints |
| --- | --- | --- |
| Motif | Seeded four-degree theme; answering bars modify interior material | Chord-tone anchors, contour, cadence and note budget |
| Markov | Additively smoothed degree-transition model from the theme and a short authored continuation | Same phrase planner; no external training corpus |
| Game of Life | Wrapped 7×8 B3/S23 board, one synchronous generation per bar; columns suggest activity and degree | Anchor preservation deliberately means the musical readout may continue after board extinction |
| Evolution | Population 16, 12 generations; tournament selection, crossover, interior mutation and two elites | Fixed anchors; theme-distance, leap and diversity objective, not listener-rated fitness |
| Grammar | Five bounded Fibonacci rewrites A→AB/B→A select theme/neighbor alternatives | An operator sequence, not a trained phrase grammar |
| Euclidean | Even circular distribution of 2–7 eligible attacks, rotating motif readout | Strong-beat anchors and cadence can override the raw mask |
| Torus | Tonnetz walk by fifths and major thirds, quantised to the nearest degree of the current mode | Quantisation changes raw lattice intervals; this is not an unaltered torus performance |

### Genres

A genre is the idiom; emotion and Energy move within it (see [the theory-first pipeline](theory/theory-first-pipeline.md)). Each profile in `src/genres.ts` fixes:

- **Groove:** a 12- or 16-slot grid, sixteenth or eighth swing, per-drum timing push and drum patterns at three Energy levels, written as readable strings. Energy chooses the level; fills and section crashes follow the phrase plan.
- **Harmony:** emotion progressions (pop, chiptune), chord loops (house, boom-bap, trap, reggae, rock), ii–V–I banks with reharmonisation (jazz, bossa), galant schemata (Romanesca, Do-Re-Mi, Prinner, Monte, Fonte, Ponte), a diatonic L/R neo-Riemannian walk (ambient, minimal) or a modal drone (techno). Extension depth (triads, sevenths, ninths) follows intensity within the genre's range.
- **Parts:** bass and accompaniment patterns (root/fifth/octave, chromatic approach, walking bass, Alberti figures, stabs, skanks, power chords, arpeggios, held pads), shell or power voicings, and melody density, gate and register.
- **Form:** four named sections per cycle with a role (establish, develop, contrast, return), optional section Energy offsets, resting parts and a key lift (rock's last chorus).
- **Instruments:** General MIDI program hints, sent only when `programs` is on and only when they change.

| Genre | Groove | Harmony | Form |
| --- | --- | --- | --- |
| Pop | Euclidean kick, backbeat | Emotion progressions, light reharmonisation | Establish, Develop, Contrast, Return |
| House | Kick every beat, off-beat open hat, clap | 1–2 chord loops, ninths | Intro, Build, Drop, Break |
| Techno | Rolling 16ths, rim ghosts | Drone with ♭VI/♭VII colour | Intro, Groove, Peak, Break |
| Boom-bap / lo-fi | Swung 16ths, late snare | Looped sevenths and ninths | Verse, Hook, Verse 2, Hook |
| Trap | Half-time, hi-hat rolls | Minor loops | Intro, Hook, Verse, Hook |
| Jazz swing | Ride pattern, hats on 2 and 4 | ii–V–I with secondary dominants, tritone and backdoor substitutes | AABA |
| Bossa nova | Clave rim, shaker | ii–V–I, gentler rewrites | AABA |
| Reggae / dub | One-drop | I–IV loops, off-beat skank | Verse, Chorus, Dub, Chorus |
| Rock | Backbeat, 8th bass | Four-chord loops, power chords | Verse, Chorus, Bridge, Last chorus (+2) |
| Galant / classical | No drums | Schemata with rule-of-the-octave inversions, Alberti bass | Establish, Develop, Contrast, Return |
| Minimalist | Rim pulse | L/R walk, held chords, 16th arpeggios | Process A, B, C, A′ |
| Ambient | No drums | L/R walk, held ninth pads that ring into the next phrase | Drift, Bloom, Haze, Drift |
| Chiptune | Busy 16ths | Emotion progressions as fast arpeggios | Establish, Develop, Contrast, Return |

### Phrase plan, cadences and tension

Phrases pair as antecedent and consequent. A first phrase may end on a half, deceptive or (in loop genres) open cadence chosen from the emotion; its answer always closes (authentic, plagal or a tonic arrival). The last phrase of a finite score always closes. When a mode lacks a leading tone, the cadential V borrows the major dominant. Bar four is labelled a half cadence only when it is V.

Reharmonisation rewrites up to three bars (depth from genre and intensity) with secondary dominants, tritone substitutes, backdoor ♭VII7 and modal interchange (iv, ♭VI), weighted by emotion. It keeps the opening, bar four and the cadence.

Intensity moves the emotion's mode along the brightness axis (Lydian → Locrian): top intensity pushes bright modes brighter and dark modes darker, low intensity pulls toward the centre. A genre may restrict modes; the nearest permitted one is used.

Each melody bar is proposed four times by the selected engine (canonical, denser, sparser and a reseeded variant). A composite tension estimate (harmonic function and colour, non-chord tones, onset rate, register and leap size) scores each proposal against the emotion's target curve, scaled by intensity and shifted by Energy. The closest is kept. The target shapes are design proposals, not measured listener curves. Strong-beat melody notes are always tones of the bar's actual chord, including chromatic chords.

Returning sections reuse the cycle's opening harmony and melodic material and re-elaborate the weak eighths (passing, neighbour, anticipation or arpeggiation, chosen by emotion), so a return is recognisably the same tune with a new surface.

When the next phrase is in another key or mode (a section's key lift, such as rock's last chorus, or a change made while playing), the last bar becomes the dominant seventh of the new key, labelled `modulation` with the cadence `modulating`. Such a phrase is not closed. Live, the session recomposes the last bar when a key or mode change is pending half a beat before it; a change made later arrives at the boundary unprepared.

These are engineering rules for musical profiles, not style-authentic performance models. There is no general species-counterpoint solver, learned model or non-Western style model, and modulation is limited to a dominant into the next key. The research folder's 115 methods and thirteen theory studies are not all implemented APIs.

### Timing feel

Each genre profile has a `feel`: a timing push per part and per drum (positive is laid back), a seeded jitter (0 for machine idioms) and a metrical accent depth that makes pitched downbeats louder than offbeats. The composer stores the result as `NoteEvent.timing`, in beats beside the notated `start`, clamped to −0.05…0.08. Analysis, tests and the piano roll use the notated grid. `Transport` plays `start + timing` (never before the score's start or a replacement point), and `scoreToMidi(score)` writes the performed times; `scoreToMidi(score, { feel: false })` writes a quantised file.

### Musical measures

`scoreMetrics(score)` returns chord tones on strong beats, syncopation (mean metrical weakness of melody and bass onsets), repetition (share of melody bars whose interval and rhythm shape occurred earlier), pitch-class entropy, range, widest leap within a phrase, parallel fifths and octaves between chord voicings, attacks per bar and mean timing offset per part. `tests/musicality.test.mjs` holds every genre to bounds on these and checks relationships between idioms, so a change that makes the music worse fails even when it is deliberate. The bounds came from measuring the generator, so they guard against regressions; they are not listener judgements. `gallery.html` shows the measures for every genre and emotion and plays each one.

Measuring found two faults that are now fixed: folding into range could leave leaps of up to 17 semitones (now at most an octave), and returning sections varied every bar, so almost nothing recurred (they now restate the first two bars of each half literally).

### Standalone theory tools

Core exports also include `scoreMetrics`, `phraseKey`, `estimateKey`, `MidiFollower`, `GENRE_PROFILES`, `genreTempo`, `planHarmony`, `realiseChord`, `reharmonise`, `resolveMode`, `targetTension`, `elaborate`, `random` (FNV-1a/Mulberry32), `weighted`, `degreePitch`, `euclidean`, `lifeStep`, `trainMarkov`, `evolveMotif`, `voiceLead`, `pitchMask`, `quantize` and `intervalVector`. `voiceLead` accepts exactly three distinct pitch classes and three previous voices. Quantization works on MIDI 0–127, resolves nearest ties downward and returns `undefined` for an empty collection. The Life function supports dead or wrapped boundaries, independently of its musical readout.

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

The AudioBus adapter dispatches immediately when the local scheduler says a message is due. Future events stay local. The scheduler uses monotonic `performance.now()` and a 10ms polling timer; this is a best-effort browser clock, not sample-accurate or synchronized remote scheduling. Outputs that declare `timestamps` (the Web MIDI adapter) can be fed ahead of time with `lookaheadMs`: messages carry exact timestamps, and stopping cancels scheduled messages with `clear()` and repeats releases after the lookahead window. `chain(score)` continues into a next score at the exact boundary time without releasing notes that are still ringing, and `replaceFrom(beat, events, endBeat?)` swaps future attacks and can shorten the active score to an earlier bar boundary. A wake gap over 300ms stops playback and releases owned notes instead of replaying a backlog. Hosts can inject `now`, call `start(score, false)` and drive `tick()` themselves.

Overlapping same-channel/same-pitch events use explicit release/retrigger. An old event's pending release cannot stop the newer owner. Stop and output replacement cancel queued attacks and release every owned address without channel-wide panic. Use dedicated channels when sharing an instrument. An output that is already disconnected may not receive releases; the host must implement receiver-side recovery. Core consumers must stop on their own disconnect, hidden-tab and lifecycle signals. The web component already handles page hiding, removal and MIDI disconnect.

`webMidiOutput(midiOutput)` adapts a browser MIDIOutput, with timestamps and `clear()`. Permission is requested only through the component's Connect MIDI option or an explicit host request. The first version uses MIDI 1.0 semitones, with no pitch-bend allocation or UMP negotiation.

### Following a player

`MidiFollower` reads incoming MIDI bytes. MIDI clock (24 pulses per quarter note) arrives as `onClock(1/24)`, ready for a host-clocked session's `advance()`, with `onStart`, `onContinue` and `onStop` for transport messages. Played notes feed a decaying pitch-class histogram (velocity on attack, duration on release, 8 s half-life). After six notes, Krumhansl–Schmuckler key finding reports a key through `onKey` when it changes and its profile correlation is at least 0.6. `motif(root, mode, length)` turns the last played line (the top note of each chord) into scale degrees for `ComposerOptions.motif`, which replaces the seeded theme. `estimateKey(weights)` is available on its own.

```js
const session = new ComposerSession({}, output, {}, { clock: 'host' });
const follower = new MidiFollower({
  onClock: beats => session.advance(beats), onStart: () => session.start(), onStop: () => session.stop(),
  onKey: key => session.update({ root: key.root, mode: key.mode }),
});
midiInput.onmidimessage = event => follower.receive(event.data);
```

### Continuous sessions

```js
import { ComposerSession, audioBusOutput } from './dist/index.js';

const session = new ComposerSession({ seed: 'my-theme' }, audioBusOutput(peer), {
  onPhrase: phrase => console.log(phrase.section),
  onStop: reason => console.log(reason),
});
session.start();
session.update({ energy: 0.25 }); // Next bar line
session.update({ emotion: 'fear', genre: 'jazz' }); // Next eight-bar boundary
session.finish(); // Stops after the next closed cadence
// session.stop(); // Immediate cancellation and owned-note release
```

`session.options` is the selected target, `session.applied` the current snapshot, `session.pending` says whether bar-level, phrase-level changes or a queued performance cue are waiting, `session.nextBarTarget` reports the upcoming bar boundary, and `session.beat` is the position within the current phrase. Energy, swing and ensemble recompose the rest of the phrase from the next bar line (at most once per bar, reported through `onRevise`); harmony and form are unchanged by them. Six performance cues (`crescendo`, `breakdown`, `bridge`, `drop`, `key-change`, `resolve`) can be armed for the very next bar with `session.cue(kind)` and cancelled with `session.clearCue()`: `crescendo` and `breakdown` reshape dynamics and texture from the next bar onward, `bridge`, `drop` and `key-change` cut cleanly at the next bar line into the contrast section, full-band return or a +2 semitone lift, and `resolve` turns the next bar into a closing tonic cadence. Every other control, including tempo and genre, applies at the next phrase; a pending key or mode change also turns the current phrase's last bar into the new key's dominant. Phrases chain at the exact boundary, so the internal clock does not drift and pads can ring across it. `finish()` stops after the next closed cadence; if the current phrase is open, one closing phrase follows. The finite `bars` option does not limit continuous sessions.

`session.recording` returns a cloned performance record: resolved phrase snapshots with monotonic start observations and actual MIDI dispatch records. Capture is bounded to 1,024 phrases / 100,000 dispatches; `truncated` flags an exceeded bound. Dispatch time measures the sender, not the receiver's acoustic onset. Phrase snapshots include planned events even if playback stopped early; dispatches identify messages actually sent. Fixed-tempo score replay uses `Transport.start(savedScore)`. Variable-tempo live recordings are logs, not a file the current transport automatically replays.

## Web-component contract

```html
<script type="module" src="./library/component/index.js"></script>
<audiobus-composer seed="first-light" emotion="anticipation"
  intensity="0.7" energy="0.5" algorithm="markov" tempo="104">
</audiobus-composer>
```

Importing the component entry registers it idempotently. `defineComposer()` is also available to ensure registration of the default tag. To register an additional tag, subclass the exported `AudioBusComposer` class and register that subclass, because the custom-element registry requires a distinct constructor per tag. Create instances through the DOM after registration. Shadow DOM isolates styles and controls. The component is browser-only; SSR consumers should import the core and load the component on the client.

Attributes: `seed`, `emotion`, `intensity`, `energy`, `algorithm`, `genre`, `tempo`, `root`, `mode`, `swing`. Choosing a genre in the panel also suggests its usual tempo, except when the host owns tempo. Tempo is a 30–240 BPM slider that applies on release, with a Tap button (or the T key) that sets it from the mean of the last few taps; both are disabled when the host owns tempo. Numeric attributes use the same ranges as the library. The `options` property accepts a partial update including `parts` or `bars`; `configure(patch)` does the same. Property changes do not reflect back into HTML attributes. `playFrom(bar)` jumps to a bar of the shown phrase. `score` returns a clone of the displayed resolved plan, `recording` returns the performance log, and `playing` reports transport state.

Methods: `start()` (async; browser audition needs a user gesture), `stop()`, `finish()`, `configure(patch)`, `cue(kind)` (arms or clears one of the 6 next-bar performance cues), `clearCue()`, `connectPeer(peer)`, `setOutput(adapter)`, `connectMidi()` (async), `connectMidiInput()` (async) and `usePlayedTheme()`. The panel's Performance strip exposes the six next-bar cues (`Crescendo`, `Breakdown`, `Bridge`, `Drop`, `Key change`, `Resolve`), also triggered via keys `1`–`6` and cancelled with `Escape`. The panel's Follow MIDI input control listens to a keyboard and sets tonic and mode from the key it hears, at the next phrase; Use played theme sets `motif` from the last four notes played, and a new seed clears it. The component does not follow external MIDI clock; hosts can do that with `MidiFollower` and the host clock. Assigning `element.peer = peer` attaches an existing AudioBus Peer and selects that output; clearing it returns to browser audition. Custom output adapters implement `send(bytes)` and optionally `label`. Output changes stop the current performance.

| Bubbling, composed event | `detail` |
| --- | --- |
| `composer-control-change` | `{selected, applied, pending}`; selected options and current snapshot, or null applied when stopped |
| `composer-cue` | `{cue, queued, active, target}`; armed/activated performance cue and upcoming bar target |
| `composer-phrase` | Resolved `Phrase` at the start of each live phrase, and again when a bar-level change recomposes its remainder |
| `composer-note` | `DispatchRecord`, including both note-ons and note-offs |
| `composer-state-change` | `{playing, phrase? , reason?}` |
| `composer-error` | `{message}` |

The star preserves all source regions; aliases select the same named emotion. Click/tap latches a selection. Pointer dragging updates it. Enter/Space selects; Left/Right changes family and Up/Down intensity. Equivalent labelled family and intensity inputs are always available. Selection never triggers immediate notes. Start/Stop are independent. The eight bar cards under the piano roll form one toolbar: arrow keys move between them (Up/Down by a row), Home/End jump to the ends, and clicking or pressing Enter on one plays from that bar, starting playback if needed (`playFrom(bar)`; `Transport.seek` and `ComposerSession.seek` underneath). A host clock owns its position, so seeking is ignored there. Less-used controls (theme, harmony, output and MIDI input) sit in two collapsed sections. A visible status distinguishes selected and applied controls. Reduced-motion preferences disable transitions.

Browser audition is a small optional Web Audio renderer for checking musical output; it is separate from the composition library. The volume control affects only that renderer. MIDI and AudioBus receivers supply their own instruments and level controls. Browser tests exercise audition lifecycle and output dispatch; they do not establish subjective sound quality or measured acoustic latency.

Score JSON/MIDI exports contain the current plan (the first 16-bar preview initially, or the current eight-bar phrase while/after live playback). MIDI export is format 0, 480 PPQ with fixed tempo, 4/4 and explicit note-offs, with the genre's timing feel unless `{ feel: false }` is passed. It supplies notes and channels; it includes Program Change hints only when `programs` is on. Notes that ring past the score's end are cut there. Save performance log exports phrase snapshots and dispatches, not a recording of audio.

## Deployment and checks

The [CI workflow](../.github/workflows/ci.yml) checks types, runs library tests, builds and runs Playwright on desktop Chromium and a mobile viewport. The [Pages workflow](../.github/workflows/deploy.yml) calls the CI workflow as a reusable job and publishes `site/` only after it passes. Playwright browsers are cached by lockfile. Library tests include golden digests of five reference scores: change them only together with `GENERATOR_VERSION`. Enable the repository's Pages source as **GitHub Actions**, then push to `main` or manually dispatch the deployment workflow. The workflow uses Node 24, the package-manager pin and frozen-lockfile installs. No npm token or custom deployment secret is required. Repository/environment restrictions still apply.

The deployment includes `library/index.js` and `library/component/index.js` with their relative module trees, enabling direct browser imports and embedding. Build products are ignored by Git; source and the lockfile are the deployment inputs. A successful local build does not mean the repository has been pushed or a live Pages deployment has completed.

Tooling follows [Vite's static deployment guide](https://vite.dev/guide/static-deploy.html), [GitHub's Pages custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [custom-element lifecycle guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). These are implementation references, separate from the music research evidence ledger.
