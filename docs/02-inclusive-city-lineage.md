# 02 — What Inclusive City already teaches us

## Materials actually examined

The sibling checkout is at `../../inclusive-city`. The principal evidence is [generative-music-research.md](../../inclusive-city/docs/generative-music-research.md), with the [music citation and evaluation discussion](../../inclusive-city/docs/research-and-evaluation.md), [audio documentation](../../inclusive-city/source/src/audio/README.md), [Magenta integration](../../inclusive-city/source/src/audio/MAGENTA.md), and the two bibliography files under its `docs/references/`.

Implementation reads included [MusicForm.ts](../../inclusive-city/source/src/art/MusicForm.ts), [MusicMemory.ts](../../inclusive-city/source/src/art/MusicMemory.ts), [JourneyMusicComposer.ts](../../inclusive-city/source/src/art/JourneyMusicComposer.ts), [robotMusicalIdentity.ts](../../inclusive-city/source/src/audio/robotMusicalIdentity.ts), and [robotHarmony.ts](../../inclusive-city/source/src/audio/robotHarmony.ts). These links intentionally point outside this repository; their inspected hashes are recorded in [local-source-manifest.json](references/local-source-manifest.json).

## Transfer matrix

| Existing mechanism | Contribution to this Input | Expected output effect | Limit |
| --- | --- | --- | --- |
| `musicForm` derives role from phrase index | Calculate form from musical position rather than incidental call order | Statement, development, contrast and return become predictable structures | Its fixed cycle is one compositional choice |
| Shared accompaniment budget and lead-aware filtering | Allocate a joint arrangement budget after resolving the lead | More room for the main line; fewer competing attacks | Register and timing filters are not perceptual masking models |
| Transposition-invariant motif shape | Remember intervals, onsets and lengths instead of an absolute pitch recording | A motif can return in another harmony while retaining recognizable shape | Quantization and scale snapping can change characteristic intervals |
| Bounded place memory | Keep recurrence meaningful and memory finite | Earlier gestures return after contrast | Visit frequency is not musical quality |
| Provenance in score labels | Attach origins and transformations to resolved events | A later phrase can be traced back to its source | Labels must be separated from stable event identifiers |
| Seeded identity and bounded lead edits | Apply a persistent identity after optional model generation | Later passages keep a relationship to the opening | Heuristic shaping does not implement learned artist embeddings |
| Worker generation with procedural fallback | Treat model suggestions as asynchronous candidates | Music continues when inference is late or absent | Worker use does not guarantee a response deadline |
| Save resolved score | Archive actual decisions rather than recipe names | Replay survives later preset or model changes | Event replay does not promise identical sound on all renderers |

## Form: borrow the separation, not every number

The existing 32-bar cycle has eight-bar regions of statement, development, contrast and return; an explicit cadence disables generated counter-notes. Form is derived from position. This avoids speculative composition accidentally advancing the piece. The Input should preserve this property while allowing an authored section graph, variable phrase lengths and finite endings.

The exact density multipliers and candidate budgets are useful experimental baselines. They are not theory-derived constants. For example, reducing accompaniment during contrast may produce a clear break, but another musical practice might contrast through increased density or register exchange instead.

## Memory and identity solve different problems

Memory answers “what material should return?” Identity answers “what makes this performer recognizable?” Keep both. A stored motif can be transformed through inversion, rhythmic displacement or reharmonization while an identity profile constrains leap size, articulation and accent vocabulary.

Inclusive City uses bounded score edits inspired by pianist-conditioning research. This is a productive example of translating a paper into a smaller mechanism while stating the difference. Do not claim that this Input imitates a pianist or implements cross-attention simply because it has an identity seed.

## Contextual accompaniment

Inclusive City composes optional responses against the resolved lead rather than independently composing competing lines. Generalize this to an arrangement coordinator: melody has phrase priority; bass receives root and cadence responsibilities; harmony chooses register and spacing; counterline fills eligible gaps. This is a design adaptation of context-aware generation, not a reproduction of StemGen.

The current filter rejects close attacks and pitches, which can suppress accompaniment under dense melodies. That is sometimes exactly right. It is also a reason to measure silence and part balance rather than assuming that generating more notes improves output.

## Research provenance and uncertainty

The supplied tutorial bibliography has 390 records according to the source document. This library does not recategorize them all as inspected evidence. Versioned arXiv records for the tutorial, MusicLayout, MusicWeaver and pianist conditioning were checked independently. MusicWeaver's v3 title differs from older search results; the versioned v3 record is used here.

The Creative Memory Engine programme URL could not be opened by the web tool during this review. Its programme listing was found, and the complete three-page local PDF was subsequently read, with its first page also rendered for inspection. The paper confirms that it is a design case and prototype, with no completed user study, finish rates or retrieval metrics. The motif-memory adaptation remains our design inference, not a result established by that paper.

The existing source repeatedly distinguishes software correctness from listener benefit. Retain that distinction: deterministic replay and bounded edits can be verified now; recognizable identity, emotional expression and musical satisfaction need listening evaluation.
