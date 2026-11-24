# 03 — Annotated research papers

P01–P17 are below. [Chapter 25](25-additional-live-coding-papers.md) adds P18–P25 on browser patterns, notation, collaboration, disruption, machine agency and performance-scale analysis.

These cards connect source claims to specific design decisions. Unless stated otherwise, this review examined official abstracts, project material or relevant documentation, not every experiment in each full paper. “Effect” means an expected project outcome to test. Later chapters develop original proposals rather than claiming replication.

## P01 — Tidal: Pattern Language for Live Coding of Music

Alex McLean and Geraint Wiggins, 2010. [Publication record](https://zenodo.org/records/849841); [paper](https://zenodo.org/record/849841/files/smc_2010_067.pdf).

**Contribution:** a functional representation of polyphonic patterns and pattern combination. **Use:** represent a pattern as a query over a musical interval, allowing transformations and composition without precomputing an entire piece. **Effect:** cycles can overlap, subdivide and change speed coherently. **Limit:** a pattern language supplies expressive mechanisms; it does not choose a convincing large-scale composition. Reading level: abstract and source representation, supported by current manuals.

## P02 — Algorave: Live Performance of Algorithmic Electronic Dance Music

Nick Collins and Alex McLean, 2014. [NIME publication record and paper](https://nime.org/proc/nime2014_ncollins/index.html).

**Contribution:** frames algorithmic dance music as a live performance practice. **Use:** make the autonomous engine's transformations and active rules visible, and allow edits at musical boundaries. **Effect:** repetition becomes material for performance rather than an unchanging loop. **Limit:** Algorave is a practice and community, not a single generator or recipe for emotional music. Reading level: publication record and abstract.

## P03 — The Euclidean Algorithm Generates Traditional Musical Rhythms

Godfried Toussaint, 2005. [Author publication list](https://cgm.cs.mcgill.ca/~godfried/publications.html); [paper](https://ehess.modelisationsavoirs.fr/atiam/biblio/Toussaint-BRIDGES2005.pdf).

**Contribution:** relates maximally even onset distributions to a family of musical timelines. **Use:** generate an onset scaffold with pulse count, step count and rotation as separate controls. **Effect:** regular density with uneven inter-onset distances can create cross-accent and propulsion. **Limit:** matching a binary sequence does not supply phrasing, instrument roles, accent practice or cultural context. Reading level: abstract and rhythm examples.

## P04 — A Rule-Based Generative Music System Controlled by Desired Valence and Arousal

Isaac Wallis, Todd Ingalls, Ellen Campana and J. Goodman, 2011. [University publication record](https://asu.elsevierpure.com/en/publications/a-rule-based-generative-music-system-controlled-by-desired-valenc/).

**Contribution:** a direct precedent for theory-driven generation controlled through affect coordinates. **Use:** expose intended valence and arousal, then derive a bundle of symbolic controls. **Effect:** one expressive intention can affect several compositional choices consistently. **Limit:** the accessible abstract is insufficient to reproduce exact mappings or establish general listener reliability. No numeric mapping in this library is attributed to this paper. Reading level: abstract and bibliographic record.

## P05 — Emotional Expression in Music: Contribution, Linearity, and Additivity of Primary Musical Cues

Tuomas Eerola, Anders Friberg and Roberto Bresin, 2013. [Original research](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00487/full).

**Contribution:** experimentally varies musical cues and examines judged emotional expression. **Use:** steer several features and assess them separately; do not collapse expression into major/minor selection. **Effect:** tempo, register, dynamics and articulation can provide complementary expression channels. **Limit:** judged expression in controlled stimuli is not proof of a particular listener's felt emotion, nor universal validation of this Input's mappings. Reading level: article abstract and results discussion.

## P06 — AffectMachine-Classical

Kat R. Agres, Adyasha Dash and Phoebe Chua, 2023. [Author article: a novel system for generating affective classical music](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1158172/full).

**Contribution:** a concrete affect-controlled composition system with harmonic and rhythmic design choices and listener evaluation. **Use:** create coherent profiles of mappings, then calibrate through judged expression. **Effect:** continuous affect controls can influence coordinated musical features rather than selecting a fixed tune. **Limit:** results apply to that system and stimulus context; its mappings cannot be assumed to transfer unchanged to another style or renderer. Reading level: article overview, parameter discussion and evaluation framing.

## P07 — Auditory Expectation: The Information Dynamics of Music Perception and Cognition

Marcus Pearce and Geraint Wiggins, 2012. [Author manuscript](https://www.marcus-pearce.com/assets/papers/PearceWiggins2012.pdf).

**Contribution:** probabilistic musical expectation, including information content and uncertainty. **Use:** score candidate continuations relative to a musical context and profile. **Effect:** the engine can balance familiar continuations with occasional surprising ones. **Limit:** model surprise is conditioned on representation and training material; it is neither a direct emotion meter nor a complete quality score. Reading level: abstract and conceptual account.

## P08 — MorpheuS: Generating Structured Music with Constrained Patterns and Tension

Dorien Herremans and Elaine Chew. [Author project and papers](https://www.dorienherremans.com/morpheus/); [preprint](https://arxiv.org/abs/1812.04832).

**Contribution:** combines repeated pattern constraints with a target tonal-tension profile through optimization. **Use:** define recurrence as a constraint and tension as a trajectory rather than hoping both emerge from note sampling. **Effect:** a phrase can grow more harmonically unsettled while its recognizable rhythm persists. **Limit:** its template-based optimization and tonal tension model do not establish a universal affect mapping; a live Input needs bounded computation. Reading level: abstract and author project explanation.

## P09 — A Hierarchical Latent Vector Model for Learning Long-Term Structure in Music

Adam Roberts and colleagues, 2018; MusicVAE. [Paper](https://arxiv.org/abs/1803.05428).

**Contribution:** hierarchical decoding for subsequences of musical notes. **Use:** optional phrase interpolation and controlled variation, selected ahead of playback. **Effect:** related phrase variants can occupy a smooth generative neighbourhood. **Limit:** latent interpolation need not correspond to a perceptually linear change of emotion or preserve exact motifs. Reading level: abstract and model overview.

## P10 — Music Transformer

Cheng-Zhi Anna Huang and colleagues, 2018. [Paper](https://arxiv.org/abs/1809.04281).

**Contribution:** relative attention supports longer symbolic sequences, motif continuation and melody-conditioned accompaniment. **Use:** consider relative timing and explicit context in any later symbolic model. **Effect:** later notes may refer to earlier musical material more effectively than a tiny local chain. **Limit:** a longer context does not guarantee obedience to live controls, deadlines or a section plan. Reading level: abstract.

## P11 — MuseMorphose

Shih-Lun Wu and Yi-Hsuan Yang, 2021 preprint. [Paper](https://arxiv.org/abs/2105.04090); [author demonstrations](https://slseanwu.github.io/site-musemorphose/).

**Contribution:** full-song piano style transfer with bar-level controls including rhythmic intensity and polyphony. **Use:** distinguish horizontal note activity from simultaneous note density. **Effect:** energy can change through more attacks, more voices, or both, and these need not be tied together. **Limit:** piano style transfer is not a general multitrack autonomous composer or an emotion-control guarantee. Reading level: abstract and project description.

## P12 — A Tutorial on Generative Models for Music Audio

Mateusz Modrzejewski, Joanna Kurkowska and Dorien Herremans, 2026, v1. [Versioned record](https://arxiv.org/abs/2610.38252v1).

**Contribution:** broad framing of representations, generation, control, live use and evaluation. **Use:** separate an editable symbolic planner from downstream rendering, and distinguish generation throughput from response latency. **Effect:** intended form and event choices can remain inspectable. **Limit:** audio-generation results do not validate this symbolic proposal. Detailed section interpretations are inherited from Inclusive City's review; the official record was checked here. Reading level: official record plus supplied local research note.

## P13 — MusicLayout

Shuyu Li and colleagues, 2026. [Versioned paper](https://arxiv.org/abs/2608.09035v2).

**Contribution:** a time-aligned, inspectable intermediate layout for structure and arrangement. **Use:** write sections, repetitions and part roles into a plan before notes are generated. **Effect:** a return section can explicitly recall its original material. **Limit:** importing the planning concept does not import the audio model's measured performance. Reading level: official abstract.

## P14 — MusicWeaver

Xuanchen Wang, Heng Wang and Weidong Cai, 2025, revised 2026. [v3: Programmable Long-Form Music Generation with Provably Local Editing](https://arxiv.org/abs/2509.21714v3).

**Contribution:** an explicit musical program and structured control of long-form generation. **Use:** assign stable section and motif identifiers and define the scope of edits. **Effect:** revising one future section need not rewrite every other section. **Limit:** this Input must establish its own edit invariants; the paper's formal guarantees do not automatically transfer. Reading level: versioned abstract and supplied local review. Earlier versions have different titles.

## P15 — StemGen: A Music Generation Model That Listens

Julian D. Parker and colleagues, 2024. [Versioned paper](https://arxiv.org/abs/2312.08723v2).

**Contribution:** generation conditioned on musical context. **Use:** resolve a lead or priority part first, then compose an answering line against it. **Effect:** accompaniment can leave gaps and respond to existing material. **Limit:** StemGen generates audio; the proposed onset/register filtering is an original symbolic heuristic. Reading level: abstract and Inclusive City adaptation.

## P16 — Learning Jazz Pianist Style with Cross-Attention Conditioning

Drew Edwards, Akira Maezawa and Simon Dixon, 2026. [Paper](https://arxiv.org/abs/2610.02918); [author project](https://almostimplemented.github.io/jazz-pianist-style/).

**Contribution:** persistent artist conditioning of symbolic performance generation. **Use:** retain an identity signal throughout a session, and assess later passages as well as the opening. **Effect:** expression can change without every new phrase sounding like a different generator. **Limit:** seeded motif and articulation rules do not implement learned embeddings or establish pianist imitation. Reading level: official abstract and local adaptation account.

## P17 — The Creative Memory Engine: Realization-Oriented AI for Independent Musicians

Todd Anstis, ISMIR 2026 late-breaking demo. [Programme URL](https://ismir2026program.ismir.net/lbd_633.html); [accessible programme listing](https://ismir2026program.ismir.net/lounge.html).

**Contribution:** connects a creator's fragments, preserves agency and provenance, and supports selective memory. **Use:** retain a small, inspectable motif library with recall and forgetting. **Effect:** autonomous music can revisit its own material rather than endlessly replace it. **Limit:** this is a design prototype, not an autonomous composition system or validated user study. No finish-rate or listener benefit is reported. Reading level: complete local three-page PDF, first-page visual inspection, and programme listing; the detailed programme URL remained inaccessible.

## How the papers work together

Use P01–P03 for temporal mechanisms; P04–P06 for affect-control hypotheses; P07–P08 for expectation and tension; P09–P11 for optional symbolic models; P12–P15 for explicit planning and context; P16–P17 for continuity. None removes the need for theory profiles, arrangement decisions, lifecycle handling or listening studies.
