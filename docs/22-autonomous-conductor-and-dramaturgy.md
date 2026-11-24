# 22 — Replacing the missing performer: an autonomous conductor

The conductor is the layer that decides what to change, how much, and when. This chapter is an original design proposal. It is informed by the player/action separation in [Konduktiva](https://konduktiva.org/doku.php?id=action-functions), the explicit change mechanisms in [Tidal transitions](https://tidalcycles.org/docs/reference/transitions/), and the existing project's form and memory work. None of those sources validates this exact policy.

## Give every part a musical job

An initial ensemble can contain an anchor pulse, bass, theme, harmonic support and answer. A part may change its notes while retaining its job. Conversely, a register exchange can move the theme's job to another part without inventing a new motif.

| Role | Obligation | When to yield |
| --- | --- | --- |
| Pulse anchor | Establish the chosen metric reference | During a deliberate suspension or breakdown |
| Bass | Clarify selected harmonic arrivals | When a low-register gesture needs space |
| Theme | Carry identity-bearing material | During an answer or planned contrast |
| Harmonic support | Sustain/colour the harmonic region | When it obscures the foreground or a suspension |
| Answer | Respond to gaps and phrase endings | When no musically useful response slot exists |

The table is one profile, not a universal ensemble. A contrapuntal profile may have several equal foreground voices. In every case, state who is allowed to interrupt whom.

## Actions need preconditions and an audible purpose

Represent actions as musical operations rather than arbitrary code edits:

```text
action: introduceAnswer
requires: phrase has an answer slot; no ending obligation is displaced
changes: answer part only
preserves: theme anchors, harmonic route, transport phase
effective: next eligible phrase
duration: at least two phrases unless overridden
rollback: remove answer at its next release boundary
```

Other actions include thin texture, rotate a rhythmic cell, prolong a dominant region, exchange registers, fragment a theme, restore a previous theme, and request a cadence. Each needs a bounded scope. “Increase energy” is an intention from which the conductor chooses actions, not an instruction for every part to independently add notes.

## Observe symbolic consequences

Maintain recent phrase summaries: attack count, active roles, register occupancy, duration contrast, motif transforms, harmonic changes, unresolved obligations and time since the last important transition. These are compositional observations, not measurements of a person's feelings.

Estimate fatigue through explicit heuristics such as repeated identical phrases and an overused transformation, while allowing repetition when the profile calls for it. A sixteenth-note ostinato is not exhausted merely because it repeats; the foreground and larger arc can still be changing.

With no audio feedback, the conductor cannot know actual balance, perceived loudness or timbral masking at the receiver. Describe its decisions as symbolic orchestration and permit the performer to correct them.

## Use timescales rather than constant intervention

At the event scale, resolve gates and accents. At the bar scale, adjust density within a budget. At the phrase scale, choose transformations and harmonic arrivals. At the section scale, choose contrast or return. Reassess the large-scale arc less often than local note selection.

A useful initial rule is to limit each phrase to one primary developmental change and a small number of supporting adjustments. Otherwise a high update rate creates continuous replacement, making recurrence difficult to hear. Exceptions should be structural events such as a deliberately abrupt break.

## Tension, activity and anticipation need separate budgets

Activity concerns attacks and part occupancy. Harmonic tension concerns the selected vocabulary and obligations. Anticipation concerns how an expected event is prepared and withheld. Their trajectories can diverge.

For example, remove bass attacks while repeating a short upper motif and postponing the cadence. Activity may fall while anticipation rises. Returning the bass can then feel substantial without any tempo increase. This is a compositional hypothesis to test, not a guarantee of a physiological response.

Define a **change budget** as well as a note budget: how many independent dimensions may change in this phrase? Reserve continuity in at least one important dimension—theme rhythm, harmonic centre, accent cell or part relationship—unless an explicit contrast action requests a larger break.

## Conductor selection loop

```text
at a planning boundary:
  read the latest emotion target, energy, locks and section obligations
  summarize recently committed/performed phrases
  enumerate a small set of eligible actions, including hold and silence
  predict each action's symbolic consequences over a short horizon
  reject range, lifecycle, budget and obligation violations
  compare continuity, target fit, contrast and transition cost separately
  choose a candidate with seeded tie-breaking
  commit an action and a plain-language reason at an explicit boundary
```

Holding the current arrangement must remain a real candidate. Without it, the system changes merely because a timer fired. The conductor also needs a deliberate silence action rather than treating all empty output as failure.

## A complete example: Joy to Fear, unchanged energy

Assume a four-note theme, stable metre, energy .45 and unlocked harmony. The person selects Fear while a phrase is already committed.

1. Acknowledge the new target immediately and replace any older pending target.
2. Preserve the active phrase's scheduled attacks and ending obligations.
3. For the next phrase, retain the theme's rhythm and choose a narrower contour with a suspended harmonic alternative.
4. Keep the attack budget near its prior level because energy has not changed.
5. Delay the final harmonic arrival only if the section plan permits it; otherwise express the target through a permitted contour/articulation change.
6. Record the selected profile rule, effective phrase and preserved features.

This avoids the simplistic response “fear means more notes and faster tempo.” It also avoids ignoring the person until the next entire section. The precise vocabulary is profile-specific and needs listening calibration.

## A second example: high energy during a return

The return's obligation is motif recognition. An energy rise should first strengthen accents, introduce a complementary part or alter register spacing while preserving the recognizable theme. If the shared budget is full, redistribute activity rather than exceed it. The return can be energetic without turning into unrelated development.

## Endings are planned actions

A Finish phrase command has priority over optional novelty. Plan a finite route to closure, reserve its target and release optional voices. If the user requests an immediate Stop, bypass musical closure and perform transport cleanup. These are two different promises.

Avoid one identical fallback cadence for every failure: a rest, an open ending or a profile-specific final gesture may be appropriate. Store why the fallback was selected so failures do not become invisible stylistic habits.

## Experiments that would justify this layer

Compare independent part reactions against conductor arbitration at matched aggregate budgets. Compare constant random action selection against a minimum-residence/change-budget policy. Compare a fixed form schedule against an adaptive conductor using the same motif vocabulary. Assess continuity, response predictability and long-session fatigue separately. The goal is not to prove that autonomy is always preferable; it is to identify which decisions are usefully delegated.
