# 19 — Algorave: practice, history and actual successor relationships

## What the earlier survey left out

The first survey named systems and transferable features. It did not adequately distinguish a scene, a musical language, an execution engine, a performance strategy and an autonomous composer. Those distinctions determine what can actually be borrowed. This chapter supplies the historical and musical frame; [20](20-pattern-semantics-and-live-editing.md) examines semantics, [21](21-system-comparison-and-adoption.md) compares systems and [22](22-autonomous-conductor-and-dramaturgy.md) addresses the performer decisions that the software must supply.

## Live coding is a practice; Algorave is one context for it

The [TOPLAP draft manifesto](https://toplap.org/wiki/ManifestoDraft.html) foregrounds visible algorithms, improvisation and the relationship between thought and performance. The community's [FAQ](https://toplap.org/wiki/FrequentlyAskedQuestions.html) distinguishes running a generative algorithm from changing that algorithm while it runs. These are useful primary statements of intent, not experimentally established requirements for good music.

The [Algorave paper by Collins and McLean](https://nime.org/proc/nime2014_ncollins/index.html) places algorithms in live electronic dance performance. It does not establish a single sonic style, language or algorithm. Live coding also encompasses non-dance music, visual art, teaching and other performance forms. An autonomous composer can borrow live-coding techniques while requiring no typing and never claiming that a machine-generated session is equivalent to a human live-coded performance.

**Project implication:** the Plutchik star is a performance surface for changing intentions, while a structured musical program changes underneath. Its relevant inheritance is editable process and visible consequences. The interface does not need a compulsory source-code editor to make those changes legible.

## An ecosystem rather than a replacement timeline

Do not write `Algorave → Tidal → Strudel → AI` as though each replaces the last. A more accurate evidence-based map separates relationships:

| Relationship | Supported example | What actually changes |
| --- | --- | --- |
| Shared practice | Algorave and many live-coding systems | Performance context, exchange and experimentation |
| Alternative implementation / port | TidalCycles and Strudel | Language/runtime and browser access, with related pattern ideas |
| Documented successor | Conductive and Konduktiva | A Haskell architecture developed into a JavaScript library |
| Related framework and notation | Sardine with Ziffers | Execution environment plus a musical notation that can travel between hosts |
| Related web environment | Topos | Browser-oriented sequencing, with documented Teletype inspiration |
| Collaborative layer | Flok | Shared editing and evaluation across supported backends |
| Collaborative platform | Estuary | Multiple notations and ensemble-oriented browser practice |
| Research extension | Visible machine co-performers built on Strudel | Allocation and visibility of human/machine agency |

The [Strudel paper](https://zenodo.org/records/7842142) describes a JavaScript/web implementation of Tidal's pattern approach, including feedback between the two systems. That is a direct technical relationship. Konduktiva's [official introduction](https://konduktiva.org/doku.php?id=start) explicitly identifies its relationship to Conductive and its intended Node.js use. Topos's [repository](https://github.com/Bubobubobubobubo/topos) identifies Teletype inspiration; it should not be assigned a Tidal-derived architecture simply because it appears at similar events.

## The musical work hidden behind a short code fragment

As an analytical model for this project, divide a performer's work into six activities:

1. Establish a temporal reference and a recognisable rhythmic proposition.
2. Assign functions to parts: anchor, answer, sustain, disturbance, transition.
3. Introduce repetition so a later change has a reference.
4. Judge foreground, space and competing activity by listening.
5. Decide when to prolong, interrupt, contrast or return.
6. Recover from a weak idea and bring a passage to an ending.

Pattern syntax can express actions from this list, but syntax does not choose their timing or artistic purpose. A performer may also select samples whose internal rhythm supplies much of the perceived structure. For a symbolic-only Input, those relationships must be represented as notes, rests, articulations and part roles rather than assumed to arrive inside a sample.

This explains a common prototype failure: a sophisticated pattern engine plays indefinitely, but the piece has no persuasive reason to change. The missing component is not necessarily a larger neural model. It may be an explicit policy for arrangement and development.

## Repetition, disturbance and recovery

The following are compositional proposals, not claims about every Algorave performer. Repetition establishes a local world. A displaced accent or removed bass attack can then be heard as a change to that world. A return restores a relationship, not merely a previously used pitch sequence.

Distinguish **variation** (modify the established material), **contrast** (temporarily establish a different relationship) and **replacement** (discard the material). A generator that calls all three “randomize” cannot control how much continuity it sacrifices.

Recovery matters just as much as invention. If a new layer obscures the motif, remove it or simplify another part. If a transition creates an overfull bar, treat that as evidence for the conductor rather than generate still more notes. Store a last coherent arrangement snapshot and a bounded route back to it.

## Why culture matters to the design

Transparency can mean that a person sees what was changed and who changed it. It does not require them to understand every implementation detail. Participation, language, interface familiarity and access to instruments affect who can steer the system. Keeping a visible pattern history while exposing only obscure keyboard syntax would satisfy one kind of transparency and fail another.

The [SuperContinent practitioners' account](https://econtact.ca/21_1/knotts-etal_supercontinent.html) treats networked music-making as negotiated ensemble practice. For this Input, the inference is that coordination involves restraint and social roles as well as a shared clock. If a person plays a lead into AudioBus, the autonomous part should know when to yield. It cannot infer permission to dominate simply from having free note slots.

## Evidence about musical diversity

Diapoulis and Carlé's [2023 analysis of 133 anniversary performances](https://research.chalmers.se/publication/535526/file/535526_Fulltext.pdf) offers a reproducible MIR framework and emphasizes diversity in the examined event. It supports analyzing whole performances rather than treating one demo as representative. It does not give this project a symbolic style classifier or prove that an acoustic feature trajectory expresses a particular emotion.

**Project inference:** collect several kinds of symbolic performance traces and study recurring structural actions. A density increase, register exchange and prolonged silence should remain distinguishable in the logs even if an audio embedding groups them together.

## What should be inherited

Preserve editable rules, bounded transformations, audible continuity, an inspectable change history and a performer’s ability to intervene. Add what an unattended Input needs: explicit goals, arrangement arbitration, memory, transition policies, note ownership and reliable stopping. Avoid defining success as “sounds like an Algorave” without naming a repertoire, practice and listening criterion.

The useful research question is therefore: **which decisions should the person make through emotion and energy, and which decisions can a musical process make coherently on their behalf?** Later tools provide different answers, not a single final successor.
