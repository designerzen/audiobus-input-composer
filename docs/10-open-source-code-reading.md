# 10 — Open-source implementations worth reading

Research inspection occurred on 24 November 2026. [repository-inspection.json](references/repository-inspection.json) records commit IDs, paths, byte counts and limited observations. Source was read, not installed or executed. Mutable overview links below are supplemented by commit-pinned links in the ledger.

## Directly inspected implementation references

| Repository / file | Mechanism to study | Contribution and output effect | Adoption limit |
| --- | --- | --- | --- |
| [Tidal Pattern.hs](https://github.com/tidalcycles/Tidal/blob/fefb1c364af42be265e9f02477d6d2d8fb2ec2b9/tidal-core/src/Sound/Tidal/Pattern.hs) | Pattern query, event whole/part spans | Preserve original event identity across interval queries; prevent repeated sustained attacks | Haskell representation needs a deliberate adapter; metadata reports GPL-3.0 |
| [SuperCollider Patterns.sc](https://github.com/supercollider/supercollider/blob/9254ec807aaeaf078e18abf61f6a4dad64753fb2/SCClassLibrary/Common/Streams/Patterns.sc) | Pattern classes and `Pbind` | Assemble musical event attributes into reusable streams; coordinate pitch and duration | Stateful semantics differ from pure queries; metadata reports GPL-3.0 |
| [Sonic Pi core.rb](https://github.com/sonic-pi-net/sonic-pi/blob/26cdb2cf05ada193b11bb6f4353ae4c7cdffd79c/app/server/ruby/lib/sonicpi/lang/core.rb) | Live loops, timing helpers, random-control vocabulary | Named processes and repeatable variation support an evolving ensemble | Large mixed repository; license API returned NOASSERTION, requiring file-level review |
| [FoxDot Main.py](https://github.com/Qirky/FoxDot/blob/affae587ab7b2a5f93102302254de16dd72d4c50/FoxDot/lib/Patterns/Main.py) | Pattern object and arithmetic machinery | Transform musical sequences without rewriting every event | Python runtime and SuperCollider integration are separate concerns; license needs review |
| [Tonal voice-leading](https://github.com/tonaljs/tonal/blob/5183bb488141d0ee806d03186bdbf59395af1a8d/packages/voice-leading/index.ts) | Candidate-selection functions, including top-note difference | Useful low-level voicing comparison; can reduce discontinuity | This file is not a complete global voice-leading optimizer; API license metadata was absent |
| [Scribbletune clip.ts](https://github.com/scribbletune/scribbletune/blob/fbc9a4bd975b869c534331690b11227fc16f7c50/src/clip.ts) | Convert compact clip descriptions to note objects | A concise bridge from rhythm notation to symbolic clips | Clip generation alone does not plan a piece; metadata reports MIT |
| [Magenta MusicRNN model.ts](https://github.com/magenta/magenta-js/blob/96bad8837da43beb53f2e5aaea9f29f3db4bdddb/music/src/music_rnn/model.ts) | Asynchronous `continueSequence` interface | Optional continuation of a primer rather than unrelated generation | Runtime, checkpoints and training provenance require separate checks; metadata reports Apache-2.0 |

These readings identify architectural mechanisms. They do not constitute full security, performance, dependency or licensing audits. A repository metadata license value is a discovery aid, not a conclusion about every file, model or asset.

## Additional official references

- [music21](https://github.com/cuthbertLab/music21): offline symbolic analysis, notation and corpus investigation. Useful for checking generated harmonic and interval statistics; not selected as a browser runtime dependency.
- [SCAMP](https://github.com/MarcTheSpark/scamp) and its [composition examples](https://scamp.marcevanstein.com/examples/composition_form.html): composer-facing processes and time-varying parameters. Useful as a reference for expressive control and notation workflows; code was not inspected at a pinned revision here.
- [Scribbletune documentation](https://scribbletune.com/about/): a concrete pattern-to-MIDI ecosystem. Useful for prototyping clips and exports independently of synthesis.
- [OMax official tutorials](https://forum.ircam.fr/article/omax5-tutorials/): factor-oracle improvisation. Prefer the current official material over assuming the old exported GitHub repository is the present maintained release.
- [Generative.fm repository](https://github.com/generative-music/generative.fm): useful for the product idea of sustained generative listening. Much of its practice involves audio resources, so transfer arrangement and lifecycle ideas rather than assuming a pure symbolic engine. Only repository/tree discovery was performed. A guessed `generative-music/pieces` URL returned 404; it is not an inspected source.

## A practical code-reading exercise

For each system, trace one event from musical intent to scheduled delivery. Record its time unit, identity, random source, duration model and stop behaviour. Then ask how a mid-phrase energy change affects already-generated events. This reveals deeper differences than comparing syntax snippets.

For a local prototype, Tonal-like pure theory operations and a small native event schema are likely easier to integrate than embedding a whole live-coding runtime. This is an engineering proposal, not a measured performance comparison. If a pattern runtime is adopted, retain a narrow adapter so its events can be recorded, explained and cleaned up consistently.
