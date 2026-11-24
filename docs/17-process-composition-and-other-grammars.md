# 17 — Process composition and alternatives to tonal note sampling

A comprehensive composer should be able to organize relationships other than a chord progression. This chapter gives additional executable approaches. The mechanisms and worked rules below are original sketches; historical references indicate a compositional lineage, not a claim of faithful stylistic reproduction.

## Perceptible gradual processes

Steve Reich's essay *Music as a Gradual Process* (1968), in [his collected writings](https://people.ucsc.edu/~dej/migrated/Ewha%20Materials/RHYTHM/Reich.Writings.pdf), is a primary reference for making a process itself musically perceptible. The relevant design idea is that transformation can unfold slowly enough for listeners to follow its consequences.

**Proposal:** repeat a short motif while moving one voice through a small number of phase offsets. Keep the phase process and the phrase plan separate. **Expected effect:** new alignments emerge from familiar material, so development need not depend on constant invention. **Limit:** phase shifting can become a technical demonstration if register, duration and overall pacing are ignored. This review used the available essay identification and source excerpt; it is not a full analysis of Reich's scores.

## Statistical masses and distributions

The [Xenakis estate's stochastic-music account](https://www.iannis-xenakis.org/en/stochastic-music/) describes probabilistic organization of parameters and distinguishes free and Markovian approaches. Its discussion of density and register points toward musical decisions at an aggregate scale.

**Proposal:** generate a symbolic texture with an explicit event-rate envelope and register distribution. A sparse low-register texture can evolve into a denser high-register texture without each event being part of a singable melody. **Expected effect:** the large-scale cloud has a shape even when individual notes are unpredictable. **Limit:** a distribution specifies tendencies, not phrase quality, and copying a probability formula does not reproduce a composition.

For a bounded onset process, draw a count for each bar from a chosen distribution, cap it, then place events subject to minimum spacing and part budgets. This intentionally changes the unconstrained distribution. If the musical goal is exact density, directly allocate a fixed attack count instead. Do not describe a capped, quantized output as a pristine Poisson process.

## Serial and pitch-class procedures

A pitch-class row supplies an ordered collection, often twelve distinct pitch classes in a twelve-tone example. Transposition, inversion and retrograde generate related orderings. A row does not determine octave, rhythm, articulation or voice allocation.

**Proposal:** let a row govern pitch-class order while a separate rhythmic grammar and register contour shape phrases. Preserve the row identity in provenance. **Expected effect:** systematic pitch relationships without a functional tonal centre. **Limit:** enforcing “all pitch classes before repetition” alone does not supply expressive form. Do not evaluate this profile with a tonal chord-fit metric.

Set-based generation can instead choose unordered pitch collections and constrain common tones or interval-class content between them. This suits colour-field transitions. Distinguish order-sensitive motifs from order-insensitive collections so the engine does not confuse two different kinds of similarity.

## Sieves and modular filters

Define allowed positions through modular predicates, for example `(i mod 3 = 0) OR (i mod 5 = 1)`. The same operation can select rhythmic slots or degree indices. Combining filters produces structured irregularity.

**Expected effect:** recurring but nontrivial spacing. **Limit:** a mathematically interesting set can yield awkward instrumental jumps or excessive attacks. Range, duration and density constraints remain necessary. Preserve the filter expression so the process can be inspected and edited.

## Canon and rule-based imitation

A canon can derive a second voice from a first through a delay and a specified transformation. Start with exact imitation, then permit a bounded adjustment at harmonic conflicts. If changes are substantial, label it free imitation rather than an exact canon.

**Expected effect:** audible relationship between voices and a sense of pursuit or dialogue. **Limit:** a delayed line may collide with changed harmony, exceed range or obscure the leader. Compose the source with the intended answer in mind, or use a bounded search over both lines.

This is different from a generic counterline: its dependence on the source is structurally explicit. It provides a good test case for event provenance and transformations across bar boundaries.

## Isorhythm, permutation and unequal cycles

Use one repeating duration sequence and a differently sized pitch sequence. Advancing them independently makes their pairings recur over a longer combined cycle. For lengths 3 and 5, the pairing pattern repeats after fifteen events, assuming both advance once per event.

**Expected effect:** variation from limited material with clear internal relationships. **Limit:** the event-count alignment is not necessarily a bar alignment, because duration values determine elapsed time. The scheduler must accumulate the actual duration pattern rather than infer a time cycle from the least common multiple alone.

Permutation methods can reorder a phrase under explicit restrictions: preserve first and last anchors, reorder only interior cells, or interleave two sequences. Compare permutation distance with heard motif identity rather than assuming every reordering remains recognizable.

## Rule-based recombination and musical dice

Author interchangeable phrase cells with compatible entry and exit conditions. Choose among them by weighted rules. Conditions may include meter, harmonic function, register, preceding contour and required next target.

**Expected effect:** stronger local craft than unrestricted note sampling, with many possible larger sequences. **Limit:** poorly designed joins expose the assembly process; repeated cells can become obvious. Recombination should preserve authored attribution, and cell selection should not be mistaken for proof of originality.

## Adaptive arrangement and game-like state

Use a finite-state controller for texture: sparse, moving, intense, suspended and closing. Each state defines allowed part roles, budgets and transitions. Unlike a playlist of fixed recordings, the parts still consist of generated symbolic events.

**Expected effect:** energy and external events influence the arrangement coherently. **Limit:** direct state-to-section jumps can sound abrupt. Add minimum duration, transition cells and a policy for sustained notes. A short event can change an accent immediately while a larger structural response waits for a phrase boundary.

These methods should enter the same event, memory and evaluation pipeline as tonal generation. The architecture should support different grammars while retaining consistent timing, reproducibility and note cleanup.
