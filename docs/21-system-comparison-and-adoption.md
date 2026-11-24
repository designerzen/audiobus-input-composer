# 21 — What the systems actually contribute

This is an architectural comparison, not a benchmark, popularity ranking or claim of current package compatibility. Official records/manuals and selected source reads support the observations. The adoption judgments are project-specific inferences. Source revisions and inspection scope are in [live-coding-source-inspection.json](references/live-coding-source-inspection.json).

## TidalCycles and Strudel: transform time relationships

The direct relationship is supported by the [2023 Strudel paper](https://zenodo.org/records/7842142). Their main value here is a compositional vocabulary for transforming event relationships. Neither a Tidal expression nor a Strudel expression should be treated as a completed artistic policy.

**Adopt conceptually:** a typed pattern intermediate representation, explicit alignment and reusable transformations. **Expected output:** interlocking rhythms, controlled repetition and time-scaled motif variants. **Still required:** harmony obligations, form, arrangement arbitration and the identity of performed events. Browser proximity makes Strudel relevant to an adapter, but its native audio scheduling path does not establish timestamp support in AudioBus's immediate-message protocol.

## SuperCollider: named processes and replaceable definitions

The [pattern guide](https://doc.sccode.org/Tutorials/A-Practical-Guide/PG_01_Introduction.html) and [`Pdef`](https://doc.sccode.org/Classes/Pdef.html) are precedents for composing event attributes and replacing named musical processes. **Adopt conceptually:** named part definitions and explicit replacement boundaries. **Expected output:** evolving part behaviour with stable ensemble roles. **Still required:** state snapshots and deterministic replay if a stateful stream is used. A server and synthesis language are not necessary dependencies for a symbolic browser composer.

## Sonic Pi: coordination and learnable performance actions

The [official tutorial](https://sonic-pi.net/tutorial.html) provides a practical account of loops, synchronization and reproducible randomness. **Adopt conceptually:** a small vocabulary of understandable part actions and explicit coordination. **Expected output:** parts can change independently without losing a common reference. **Still required:** a conductor that chooses changes and a mapping from emotion to musical preferences. Do not infer that an interface designed for learning must produce simplistic music, or that educational examples establish runtime performance on our target.

## FoxDot: musical sequence transformations

The [FoxDot repository](https://github.com/Qirky/FoxDot) and previously inspected Pattern implementation provide examples of musical pattern objects. **Adopt conceptually:** composable sequence-level changes and reusable player controls. **Expected output:** concise variations of existing motifs. **Still required:** explicit multi-timescale planning and a tested adapter. Avoid claiming it is obsolete or maintained solely from age, issue counts or apparent activity; this review did not run it.

## Conductive → Konduktiva: closer to an autonomous ensemble

Konduktiva is an explicitly documented successor to Conductive, not an inferred family resemblance. Its [QuantizedMaps tutorial](https://konduktiva.org/doku.php?id=quantizedmaps-tutorial) describes time-keyed values within a span; [player creation](https://konduktiva.org/doku.php?id=creating-players) and [action functions](https://konduktiva.org/doku.php?id=action-functions) separate musical data from what a player does with it.

**Adopt conceptually:** named players, separate control maps, action policies and an environment that coordinates them. **Expected output:** one player can change rhythm or register without replacing every other musical dimension. **Still required:** an explicit policy for which maps change together and how memory is committed. Current documentation targets Node.js; browser use would require a runtime/dependency investigation. No Konduktiva source or package was executed during this review.

For this project, its architecture is at least as relevant as another syntax for note strings. A Plutchik selection can alter a player's preferences while a conductor preserves the bass pattern and ending obligations. That is a project adaptation, not an existing documented Plutchik feature.

## Sardine: callbacks, players and multiple notations

[Sardine's player documentation](https://sardine.raphaelforment.fr/basics/players.html) and [Ziffers integration](https://sardine.raphaelforment.fr/pattern_languages/ziffers.html) illustrate an execution framework hosting musical patterns. **Adopt conceptually:** distinguish the scheduler/clock from the notation that creates material. **Expected output:** a part can use a concise melody notation while another uses a rhythmic process. **Still required:** a common event schema and constraints across the resulting parts. Python scheduling and browser scheduling are separate integration choices.

## Ziffers: notes and theory need a richer notation

The [Alonen–Forment paper](https://zenodo.org/records/7841945) proposes an implementation-agnostic numbered musical notation. It is a notation and generative vocabulary, not a whole autonomous ensemble. **Adopt conceptually:** degree-aware melody and harmony, explicit durations, transformations and exportable symbolic structure. **Expected output:** themes remain meaningfully transposable and theoretically inspectable. **Still required:** phrase goals, voicing, expressive interpretation and host-specific evaluation of supported syntax. The selected Ruby source belongs to one implementation, not every Ziffers host.

## Topos: an event-oriented browser environment

The [Topos repository](https://github.com/Bubobubobubobubo/topos) documents browser operation, Teletype inspiration and external sequencing. Clock and evaluator files were inspected at a fixed revision. **Adopt conceptually:** short, performable processes and a separation between candidate and committed state. **Expected output:** a small number of processes can change the behaviour of several parts. **Still required:** bounded evaluation, robust rollback and explicit scheduling semantics. See [20](20-pattern-semantics-and-live-editing.md) for why an evaluator's timer is not itself a computation bound.

## Orca: a visible machine that sends events

The [Orca repository](https://github.com/hundredrabbits/Orca) describes a clocked operator grid that outputs MIDI/OSC/UDP rather than synthesizing sound. The inspected JavaScript clock uses a worker for its internal tick and contains external MIDI-clock handling. **Adopt conceptually:** small inspectable processes, clear event boundaries and visibly related transformations. **Expected output:** evolving rhythmic networks from limited rules. **Still required:** harmonic and formal meaning; a grid's state evolution is not automatically a motif plan. A spatial source grid also introduces accessibility and editing questions unrelated to wheel selection.

## Estuary and Flok: collaboration is a separate layer

The [Estuary paper](https://iclc.toplap.org/2017/cameraReady/ICLC_2017_paper_78.pdf) describes an early projectional/collaborative design. The current repository has broader platform concerns; do not use the 2017 design to certify every current interface. [Flok](https://github.com/munshkr/flok) supplies collaborative editing/evaluation infrastructure; selected source distinguishes line, block and document evaluation.

**Adopt conceptually:** versioned shared intentions and explicit evaluation scope. **Expected output:** a person can revise one part while another stays stable. **Still required:** musical ownership, conflict arbitration and synchronized committed plans. Equal document contents do not establish equal clocks, active notes or audible output.

## Mercury and Sema: language design is itself an instrument choice

[Mercury's official overview](https://tmhglnd.github.io/mercury/docs/) and the [Sema paper record](https://doi.org/10.5281/zenodo.3939228) foreground approachable notation and plural language design, respectively. **Adopt conceptually:** shape the allowed vocabulary around a musician's task. **Expected output:** clearer relationships between an intention and the changes it permits. **Still required:** a musical decision policy and evaluation. These are documentation-level references here; no implementation adoption or maintenance conclusion is claimed.

## Architecture selection for this Input

Prefer a small native symbolic core with adapters over embedding several complete environments. Use time-query pattern ideas for rhythmic material, a player/action model for arrangement, and a degree-aware representation for themes. Preserve the Plutchik interface as the primary performance control. An optional textual view can reveal the generated musical program for advanced inspection.

Prototype a Strudel adapter only after the semantic fixtures in [20](20-pattern-semantics-and-live-editing.md) define what it must preserve. Prototype a Konduktiva-inspired native conductor separately from any decision to embed Node.js. This separates a useful architectural precedent from an expensive runtime commitment.

The crucial unresolved comparison is empirical: can those small native mechanisms express the intended musical transformations without becoming a second, weaker reimplementation of a mature pattern engine? A bounded adapter experiment can answer that question; an inventory of feature names cannot.
