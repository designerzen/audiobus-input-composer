# 06 — Emotion and energy as musical controls

## An expressive intention, not a diagnosis

The primary interface is now the [PhotoSYNTH Plutchik star](18-plutchik-interface.md): select an emotion family and intensity there, with Energy as an independent control. Valence and arousal below are optional mapping coordinates, not a replacement for the selected family or the primary user interface.

Use valence `v ∈ [-1,1]` and arousal `a ∈ [0,1]` as optional coordinates for intended expression. Keep energy `e ∈ [0,1]` as a separate compositional intensity control. Tension `q ∈ [0,1]` describes instability or unresolved expectation in the chosen profile. These coordinates need not be independent perceptually, but separating them makes experiments and control clearer.

A high-energy passage can be restrained in tempo but dense in attacks. A low-valence passage can be fast and forceful. High harmonic tension can occur under a very sparse texture. Do not map all four controls to the same “more” knob.

[Wallis et al.](https://asu.elsevierpure.com/en/publications/a-rule-based-generative-music-system-controlled-by-desired-valenc/), [Eerola et al.](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00487/full) and [AffectMachine-Classical](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1158172/full) support investigating affect through coordinated musical parameters. They do not establish the following exact mappings, which are original hypotheses.

## Proposed mapping matrix

| Control | Primary musical channels | Secondary channels | Expected expression and caveat |
| --- | --- | --- | --- |
| Energy | Attack budget, active parts, accent strength | Register spread, repetition rate | Greater activity or weight; excessive density can become clutter |
| Arousal | Tempo target if clock ownership permits; rhythmic subdivision | Articulation, accent variability | More activation; tempo alone may dominate other intended changes |
| Valence | Profile-specific harmonic vocabulary and melodic direction biases | Register and cadence colour | Changes expressive colour; major/minor is a culturally situated cue |
| Tension | Dissonance obligations, harmonic distance, delayed cadence | Syncopation and phrase extension | Creates instability and expectation of resolution; not identical to negative valence |
| Novelty | Motif transformation rate and candidate surprise target | New section probability | Makes development less predictable; excess weakens identity |

A musical profile owns the matrix and ranges. A drone profile may steer pitch collection and ornamentation rather than dominant harmony. A rhythm-focused profile can express a substantial energy arc with a fixed tonal centre.

## Example equations for an initial profile

These are starting values for experiments, not findings from a paper:

```text
targetBPM = 72 + 60*a                  # only if this Input owns tempo
leadAttackBudgetPer4Beats = round(2 + 6*e)
optionalAnswerBudget = floor(4*e)      # shared across all answer voices
targetVelocity = clamp(0.35 + 0.35*e + accent, 0, 1)
ornamentChance = 0.05 + 0.20*e
cadenceDelayChance = 0.4*q
```

Do not apply every equation maximally at once. Allocate a phrase budget and account for other active parts. If arousal rises while the host owns tempo, increase subdivisions or accents within a capped density instead of sending unauthorized tempo changes.

Valence should select weighted alternatives, not instantly remap every sounding note. For the first tonal profile, test a set of major, minor and mixture choices selected at phrase boundaries. Record which features changed. “Happy equals C major” would confound tonal centre with mode and provide very little expressive range.

## Smoothing and hysteresis

For a continuous target `x`, apply:

```text
alpha = 1 - exp(-dt/tau)
smoothed = previous + alpha*(target-previous)
```

`dt` and `tau` use the same units. A fixed alpha applied once per animation frame produces frame-rate-dependent behaviour. Use separate timescales: velocity and gate length can respond quickly; texture can wait for a bar; harmony can wait for a phrase. Tempo changes must preserve phase continuity.

For a discrete part entrance, use different entry and exit thresholds, for example enter above `e=.65`, leave below `e=.45`. Add minimum residence time. This avoids rapid part flickering when a sensor hovers near one threshold.

## Keep intention, observation and interpretation separate

If later inputs include movement, text sentiment or physiological signals, preserve the raw observation, its confidence, the inferred coordinate and the musical mapping as distinct records. A low-confidence estimate should reduce influence or hold a prior value. It should not trigger repeated harmonic shifts.

Let users override mappings, lock tempo or harmony, and audition a fixed-seed phrase at several settings. A readable explanation such as “energy added two offbeat attacks; harmony stayed fixed” supports experimentation without pretending to know the listener's feelings.

## How to test the mapping

First generate matched symbolic scores with one control varied. Confirm which parameters actually changed and whether caps were respected. Then render them through a consistent external instrument for blinded listening. Ask perceived expression and personal feeling separately. Compare fixed-tempo and tempo-enabled conditions so that tempo does not hide weak effects elsewhere.

Also compare equal-density high/low energy conditions: if listeners still hear an energy distinction, accents, articulation or arrangement may be contributing. If not, that is useful evidence about this profile. Retain individual and cultural differences rather than forcing agreement with the controller's label.
