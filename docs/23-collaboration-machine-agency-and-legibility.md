# 23 — Collaboration, machine agency and readable decisions

## Autonomy is not a single slider

Distinguish who proposes material, who evaluates it, who authorizes its entry, who chooses the entry time and who can undo it. A model can generate notes while a deterministic conductor retains all structural authority. Another system can propose a harmless-looking edit that autonomously changes the entire arrangement.

[Wilson, Fazekas and Wiggins](https://doi.org/10.1017/S1355771823000420) argue that reflection, aesthetics and evaluation matter when moving from a merely generative tool toward a collaborating agent. That is a conceptual/design contribution, not experimental proof of this Input's agency. It suggests that a creative agent needs an account of why it changes things, not just permission to produce them.

## Three modes worth implementing and comparing

| Mode | Machine authority | Human interaction | Useful question |
| --- | --- | --- | --- |
| Suggest | Propose a phrase/action without committing it | Audition or accept | Are the proposals useful and understandable? |
| Conduct | Commit bounded changes within selected profile and locks | Steer intention, stop or undo | Does autonomous development remain coherent and controllable? |
| Provoke | Introduce occasional explicitly allowed disruptions | Recover, redirect or reject | Can surprise help exploration without overwhelming the performer? |

Conduct is the intended default for an autonomous Input. Provoke is an optional exploratory mode, not a hidden behaviour. All modes preserve the immediate transport Stop.

## What the disruption study actually establishes

Attanayake, Swift, Gardner and Sorensen's [2020 paper](https://benswift.me/assets/documents/preprints/attanayake_et_al_2020_disruption_and_creativity_in_live_coding.pdf) examined recommendation and disruptive agent modes with six participants. Its no-agent condition came first, and the two agent conditions were subsequently randomized in order. This provides situated evidence about creative interaction, not a population-wide ranking of autonomous versus assisted music-making.

**Project inference:** compare authority modes directly rather than assuming that more initiative means more creativity. For a Plutchik interface user, an unsolicited structural break may feel very different from the same break requested through energy or surprise controls. Record whether a change was invited, automatic or explicitly rejected.

## What visible LLM co-performers add

Hollowell, Bennett and Marshall's [2026 Strudel-based system](https://zenodo.org/records/20784519) makes machine editing visible through separate cursors and incremental text generation, using a CRDT for concurrent editing. Its evaluation is collaborative autoethnography. This is evidence about one performance practice and its interaction patterns, not a controlled demonstration of superior music or verified emotion conditioning.

**Project inference:** reveal actionable machine decisions, but do not equate visible activity with musical agency. Animating an AI cursor can make work perceptible while leaving the actual decision criteria opaque. The star interface can instead show “retaining your motif; adding a two-note answer next phrase,” linked to the actual action log.

## Readable explanations must be grounded

Generate explanations from committed action records, not from a model inventing a plausible narrative after the performance. A useful record includes the accepted target, applied mapping rule, scope, effective time, preserved constraints and rejected alternatives where relevant.

Good: “Energy rose; the answer enters next bar. Tempo is locked.” Misleading: “The audience feels anxious, so I chose this harmony,” when there is no audience sensing or calibrated emotion model. Do not claim that a symbolic density statistic measures felt energy.

Use an optional deeper view for source pattern, harmonic reasoning and provenance. The default view should describe a small number of musically meaningful changes. More logs are not automatically more transparency.

## Shared documents are not shared performances

Estuary's [early collaborative design](https://iclc.toplap.org/2017/cameraReady/ICLC_2017_paper_78.pdf) and [Flok's editing/evaluation implementation](https://github.com/munshkr/flok) demonstrate different collaboration layers. A shared document needs additional policies before it becomes a synchronized ensemble: active revision, beat reference, effective boundary, random keys and output ownership.

If two browsers show the same text but commit it on different bars, they can produce different musical traces. If one reconnects halfway through a held note, copying text does not restore its note lifecycle. If each sends the same notes to a shared destination, duplicate performance may occur. These are proposed integration failure cases, not measured defects in those platforms.

## Roles in a human–composer duet

Define a lead-owner, harmony-owner and transport-owner for each session. The autonomous Input can listen to a human symbolic melody and occupy answer slots, or it can lead while the person adds rhythm. Ownership can change at explicit boundaries.

The [SuperContinent account](https://econtact.ca/21_1/knotts-etal_supercontinent.html) is a practitioner source for negotiated online ensemble practice. Its transfer here is to make yielding, turn-taking and constraints first-class musical actions. A shared clock solves only one coordination problem.

An input melody should not be reduced to pitch classes alone. Capture phrasing, rests and note lengths; preserve confidence when input is incomplete. If a human continues playing into the planned answer window, let the answer shorten or defer rather than force a precomputed reply over the person.

## Correction, memory and learning

An Undo should name its scope: revert the last future arrangement action, restore a prior phrase candidate, or restore a setting. It cannot unplay notes already heard. A reject action can prevent immediate reuse without permanently teaching that a musical idea is bad.

If explicit feedback later updates preferences, separate “I disliked this phrase” from “this was badly timed” and “this did not match the target.” Otherwise the model may suppress good material because delivery was late. Do not infer a durable preference from Stop alone: the person may simply be leaving.

## Research programme

Evaluate autonomy at matched musical vocabulary and compute budget. Record accept/reject/undo behaviour, recovery time, sense of control, usefulness of explanations, perceived authorship and musical preference separately. Include people who cannot or do not wish to type code, since the primary interface is a diagram. A successful performance for an expert live coder is not sufficient evidence of accessibility or useful control for this instrument's audience.
