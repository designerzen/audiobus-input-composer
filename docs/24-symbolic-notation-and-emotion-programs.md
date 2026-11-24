# 24 — From the Plutchik star to an editable musical program

The missing middle layer is a representation of musical intent that is richer than MIDI bytes and more constrained than arbitrary generated code. This chapter proposes that layer. The [Ziffers paper](https://zenodo.org/records/7841945) and [Sema paper](https://doi.org/10.5281/zenodo.3939228) provide distinct precedents: a portable musical notation and a language-design environment. Their findings do not validate this particular schema.

## Separate four representations

1. **Intent:** selected family, intensity, energy, locks, scope and change timing.
2. **Musical program:** sections, roles, motifs, harmony, pattern operations and obligations.
3. **Resolved score:** particular note/control events with provenance and musical time.
4. **Delivery messages:** MIDI/UMP or other negotiated protocol output.

Changing an intention does not rewrite the event history. Changing a program does not immediately send MIDI. A resolved score can be replayed without invoking either the original model or the original emotion mapper.

## A minimal musical program

The following is a proposed declarative example, not an implemented API:

```json
{
  "profile": "tonal-12tet-v1",
  "section": "return-1",
  "theme": "opening-cell",
  "preserve": ["theme-rhythm", "phrase-ending"],
  "roles": {"lead": "theme", "bass": "anchor", "counter": "answer"},
  "actions": [
    {"type": "strengthen-accents", "part": "lead", "amount": 0.12},
    {"type": "introduce-answer", "part": "counter", "maximumAttacks": 2}
  ],
  "effectiveBoundary": "next-phrase"
}
```

It states what to preserve as well as what to change. An unrestricted text prompt usually leaves both implicit. A language model may propose a record like this, but a deterministic validator should resolve whether it is permissible.

## Theory-aware symbolic data

Pitch needs degree, alteration, spelling and delivery value when available. Rhythm needs rational onset, notated duration, gate and grouping. Harmony needs function or profile-specific relation, not only a chord label. Motifs need anchors and permitted transformations. Articulation needs a symbolic intention and its final event realization.

When material crosses profiles, mark which information survives. A seven-degree melody can transpose into another seven-degree collection, but “third degree” alone does not preserve its exact semitone intervals or style. A rhythm transferred to a new meter may retain proportional spacing or metric emphasis; those are different transformations.

## Mapping the emotion family without collapsing it

Retain the Plutchik family and intensity in the intent record. Optional valence/arousal estimates can inform a profile but must not replace that identity. Anger and fear might share high-arousal tendencies in a chosen mapping while requesting different contour, repetition and harmonic alternatives.

Use a family-specific preference vector with a neutral baseline and bounded strength interpolation. Treat feature weights as authored hypotheses. Do not interpolate categorical chord labels or emotion names numerically. For discrete alternatives, interpolate selection weights; for continuous values such as gate ratio, interpolate within valid bounds.

Energy remains independent. High-intensity sadness can be sparse or active depending on energy; increasing intensity need not increase event count. The existing [32-region mapping](interface/plutchik-regions.json) supplies UI selection identities, not the final compositional profile.

## A proposed transition cost

Evaluate a candidate against multiple named criteria:

```text
target fit:    which requested expressive preferences does it realize?
continuity:    which motif/role relationships survive?
obligations:   which cadence, suspension and turn-taking goals remain?
change cost:   how many important dimensions change simultaneously?
delivery:      is the candidate ready before its commitment boundary?
```

Keep these components visible rather than reporting an unexplained aesthetic score. Hard obligations and delivery limits reject a candidate before soft preferences rank it. A higher target-fit value cannot justify an invalid event or a missed release.

## Notation versus execution

Numbered notation can make a melody easy to transpose and inspect. It does not determine whether the receiving host interprets a digit as a scale degree, pitch class, sample index or absolute MIDI pitch. An adapter must carry that meaning explicitly and declare supported syntax.

Do not promise to accept arbitrary Tidal, Ziffers, SuperCollider and JavaScript fragments as though they were interchangeable expressions. Start with a small typed representation and, if useful, import a deliberately limited subset. Unsupported constructs should produce an explicit diagnostic rather than quietly changing their musical meaning.

## Two rates of musical control

A time-varying curve can be sampled at note attacks, at bar boundaries or continuously. Sampling at note attacks makes values depend on the rhythm; sampling continuously requires an expressive delivery channel and a defined control rate. A sparse melody does not provide enough events to approximate every intended curve.

Use piecewise curves for dynamic shape and a separate event plan for entrances. Smooth a target from the star, then commit its structural consequences at a declared boundary. Keep the requested and applied trajectories in the recording so a delayed transition can be explained later.

## Editing without destroying continuity

Support edits by scope: change only the answer rhythm, reharmonize a future section, preserve the theme contour or regenerate an unlocked ending. Stable IDs connect program nodes to score events. A changed section revision invalidates its uncommitted descendants, not all previous history.

This makes local editing a testable contract: compare unaffected event sets before and after an edit, then assess whether the changed section remains musically connected. It is a new project invariant, not a borrowed guarantee from a paper about a different model.

## Round-trip experiments

Test intent → program → score → saved score replay. Separately test a supported notation import → program → notation export and record losses. Exact string equality is less useful than preserved pitches, rational timing, structure and declared semantics.

For emotion mapping, generate matched programs under fixed seeds, then inspect which actions changed before listening. This avoids a black box in which an attractive result is credited to emotion control even when the actual difference came from random phrase replacement.
