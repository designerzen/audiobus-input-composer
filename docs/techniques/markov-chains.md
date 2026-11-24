# T011 — First-order Markov chains

Family: **Markov models and sequence memory**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

The next-state distribution depends on the present state.

## Proposed symbolic-music use

Represent states as scale degrees, rhythmic cells or harmonic functions. Add metric and cadence constraints outside the chain.

## Worked example or experiment setup

For C,D,E states, C may transition to D with .75 and E with .25. Sampling follows that row; it does not understand a phrase ending.

## Time, emotion and energy

Blend valid transition matrices at phrase boundaries; energy controls rhythmic emissions, while emotion chooses profile-conditioned alternatives.

## Failure modes and practical limits

Dead rows, absorbing states and short loops need explicit handling. A chain can imitate local habits while losing long-term form.

## Evaluation

Check row sums and empirical transitions, then compare phrase closure and theme recall with a conductor added.

## AudioBus integration

Record symbolic representation, context/state, estimator and corpus version. Preserve cadence and motif obligations above local sequence sampling.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [IDyOM: variable-order and multiple-viewpoint prediction](https://www.marcus-pearce.com/idyom/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.

## A complete small model

Choose zero-based degree states `[0,1,2]` and a transition matrix:

```text
         next 0   next 1   next 2
state 0    0       .75      .25
state 1   .50       0       .50
state 2   1.00      0        0
```

Every row sums to one. Given state 0, a uniform draw .6 chooses state 1; a draw .9 chooses state 2. This specifies local preference, not a guarantee that either route makes a complete phrase. Keep the rhythmic plan separate unless state explicitly includes rhythm.

For training, count transitions in a supplied corpus. The degree sequence `[0,2,1,2,0]` gives transitions 0→2, 2→1, 1→2 and 2→0. The row for state 2 has counts `[1,1,0]`. Additive smoothing with alpha .5 changes that row to `[1.5,1.5,.5]/3.5`, or `[3/7,3/7,1/7]`. This is a simple teaching estimator; it does not reproduce IDyOM's multiple-viewpoint smoothing.

## A symbolic composition pipeline

Define the state meaning first: absolute pitches, scale degrees, intervals, chord functions and rhythmic cells generate different kinds of memory. Degrees make transposition easier, but chromatic alterations and harmony-dependent meanings still need explicit representation. A joint pitch/rhythm state captures coordination while making the state space larger.

At each event, obtain the row distribution, remove candidates violating range or required resolution, then renormalize. If no candidate remains, back off or use a declared rest/cadence fallback. Do not repeatedly sample forever until a legal note appears. Protect the phrase target rather than forcing an unrelated final tonic after all intermediate choices have already been made.

For a fixed-length ending, dynamic programming can calculate which states can reach the target in the remaining steps. A stronger bridge computes endpoint-conditioned probabilities. Filtering by reachability alone retains valid paths but is not the same probability distribution as exact endpoint conditioning.

## Emotion, energy and nonstationarity

Keep the wheel's family label in the context. Two families may request different contour or harmonic preferences even if their intended arousal overlaps. Blend matrices only when their states have the same meaning. A convex blend of row-stochastic matrices remains row-stochastic, but the perceived result need not vary linearly.

Use energy primarily to select rhythm/arrangement budgets, not simply to flatten every transition row. Increased entropy can create less predictable music without producing more perceived activity. Time can condition a cadence row near the ending, making the model explicitly nonstationary.

## What to record and compare

Save matrix/corpus version, estimator, seed keys, initial state, constrained distribution, chosen state and fallback. Record resolved events for replay. Compare a first-order model with a weighted independent baseline and a higher-order model at equal event budgets. Evaluate predictability, motif recognition, ending quality and expression separately.

A chain trained on one repertoire reflects that material, including its biases and possible recognizable fragments. Statistical likelihood, stylistic familiarity and musical quality are separate outcomes. Training rights and attribution also remain separate from the fact that output consists of MIDI notes.
