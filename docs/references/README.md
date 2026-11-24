# Reference and evidence ledger

Reviewed 24 November 2026. The [original annotated paper chapter](../03-annotated-papers.md) covers P01–P17; [the live-coding expansion](../25-additional-live-coding-papers.md) adds P18–P25. Each identifies contributions, applications, expected output effects and evidence limits. The [original code-reading chapter](../10-open-source-code-reading.md) and [expanded system comparison](../21-system-comparison-and-adoption.md) cover implementation references.

## Evidence classes

| Class | Sources | What was established |
| --- | --- | --- |
| Local research and selected code read | Inclusive City research notes, audio documentation, form, memory, identity and composer files | Existing design choices and documented evidence limits |
| Official paper records / abstracts checked | P01–P04, P07–P16 | Paper identity and the specific claims summarized in each card |
| Relevant article material checked | P05, P06 | Parameter and evaluation framing, with no claim of reproducing experiments |
| Local PDF read | P17, all three pages; first page rendered and visually inspected | Prototype affordances and explicit absence of completed user-study results |
| Secondary local interpretation | P12's detailed section interpretation | Inherited interpretation, explicitly distinguished from a fresh full-paper read |
| Commit-pinned implementation read | Tidal, SuperCollider, Sonic Pi, FoxDot, Tonal, Scribbletune, Magenta.js selected files | Specific mechanisms and paths, not whole-repository validation |
| Official documentation / overview | Strudel, Sardine, Gibber, music21, SCAMP, OMax, Generative.fm | Useful concepts or discovery leads; no compatibility benchmark |
| Local integration source read | AudioBus protocol README, specification and Peer source | Present immediate-message API and absence of shared-clock scheduling |
| Standards reference | [Web MIDI API](https://webaudio.github.io/web-midi-api/#dom-midioutput-send) | Direct MIDIOutput timestamp semantics, distinguished from the AudioBus Peer API |
| Additional primary PDF material | P18–P25; extracted text, first-page overviews and selected passages | Pattern implementation, notation, collaboration, intervention studies and performance-analysis framing; no reproduction claims |
| Additional pinned source excerpts | Orca, Ziffers, Flok, Estuary, Topos | Specific timing, notation, editing and evaluation mechanisms; no whole-runtime audit |
| Additional official/practitioner sources | TOPLAP, Konduktiva, ChucK, Extempore, SuperContinent, Mercury and Sema | Stated design intentions, timing models, player abstractions and collaboration practice |

## Machine-readable records

- [HarmonEasy inspection](harmoneasy-inspection.json): local research/code hashes, reading scope, independently checked references and access limits. A hash identifies the file version, not a claim that every line was read.
- [Technique catalogue](../techniques/catalogue.json) and [method sources](../techniques/sources.json): 115 studies in twelve families and 63 source records. General method evidence is distinguished from this project's proposed musical applications in every study.

- [repository-inspection.json](repository-inspection.json): GitHub commit, default branch, license metadata, successfully read paths and limited source observations. Failed guesses are retained transparently.
- [local-source-manifest.json](local-source-manifest.json): paths, byte counts and SHA-256 hashes of local sources consulted. The external sibling files remain in their original repositories.
- [research-bibliography.bib](research-bibliography.bib): selected scholarly citations for all 25 paper cards. Documentation and code citations remain in their chapters and inspection ledgers.
- [verification.json](verification.json): local-link, source-hash, bibliography and numerical-example checks. This records documentation checks, not application or listening tests.
- [live-coding-paper-inspection.json](live-coding-paper-inspection.json): eight additional PDF URLs, page counts, hashes and reading scope. Text extraction emitted CFF-font warnings for one manuscript; its overview was subsequently checked with PyMuPDF. No full visual review is claimed.
- [live-coding-source-inspection.json](live-coding-source-inspection.json): five additional repositories, pinned revisions, inspected file paths and limited implementation observations.
- [live-coding-web-sources.json](live-coding-web-sources.json): primary/official sources used by the expansion and known access limits.

## Verification boundaries

The current Strudel Codeberg repository could not be retrieved through the web tool; its official manuals were accessible. The old GitHub repository was only a pointer. The detailed Creative Memory Engine programme page was inaccessible; the broader programme listing was available. Its local three-page PDF was located during final checks, read in full and its first page visually inspected; the evidence notes were updated accordingly. A guessed Generative.fm pieces repository returned 404. None of those is represented as a successful code or full-paper inspection.

Inclusive City's imported `generative-music-tutorial.bib` and `realization-oriented-ai.bib` were located and partially reviewed through file output. The entire imported bibliography is not reproduced or represented as independently evaluated here. It contains material beyond symbolic music. Follow its original provenance note if returning to that wider literature.

Research dates describe this review, not release dates. Some repository default branches are development branches. Pinning makes the inspection recoverable; it does not certify release stability. No downloaded package, model, asset or third-party implementation was added to this project.

All mathematical mappings, score examples, candidate costs, architecture contracts and roadmap choices in these documents are proposals unless explicitly attributed. No listener ratings, performance numbers or implementation test results have been fabricated.
