# 18 — Plutchik star: the chosen composer interface

**Interface decision:** use the Plutchik emotion diagram from PhotoSYNTH.lol as the composer's primary control surface. This updates the design brief: emotion is selected on the star, with separate energy and performance controls. It is an implementation specification; this research-only repository does not yet contain a running composer application.

## Reuse the actual PhotoSYNTH work

The source is the sibling `photosynth.lol` checkout:

- [star-controller.svg](../../photosynth.lol/source/webcomponent/star-controller/star-controller.svg): original artwork, eight petals and 32 paths.
- [star-controller.ts](../../photosynth.lol/source/webcomponent/star-controller/star-controller.ts): custom element, region setup, interaction feedback and settings UI.
- [star-settings.ts](../../photosynth.lol/source/webcomponent/star-controller/star-settings.ts): petal ordering, path intensity ranks and configurable chord mapping.
- [star-controller.css](../../photosynth.lol/source/webcomponent/star-controller/star-controller.css): layout, focus, pressed state and reduced-motion handling.
- [component README](../../photosynth.lol/source/webcomponent/star-controller/README.md): interaction and lifecycle contract.
- [SectionPlutchik.astro](../../photosynth.lol/src/components/sections/SectionPlutchik.astro): the site's actual integration point.

The similarly named legacy `source/assets/scripts/components/pulchik-synth.js` is an incomplete older stub. Use the current web component as the reference. The composer should reuse the established SVG geometry and colour system rather than draw an unrelated circular approximation.

The current component is a chord-playing instrument. It emits note events through a shared controller base; its default roots run in fifths. This composer needs an emotion-selection adapter instead. The chord pad's root, inversion, MIDI velocity and hold semantics must not silently become the composer's psychological or compositional model.

## Main surface

Place the star centrally, with the selected emotion and intensity immediately below it. Put Energy alongside it or below it on narrow screens. Keep Start, Stop and Finish phrase visible. Below that, show the current section and one upcoming musical response, for example “Sadness selected; harmony changes next phrase.”

The wheel is the primary emotion interface. Valence/arousal values remain available for mapping diagnostics and advanced editing; users do not need to position a second XY controller to use the instrument.

## Emotion families and musical intentions

Preserve the source's clockwise order from the top. The table defines initial creative mapping hypotheses, not validated associations or psychological measurements.

| Family | Source labels from mild to strong | Initial compositional vocabulary to audition |
| --- | --- | --- |
| Joy | Serenity → joy → ecstasy | Clear anchors, rising answers, open major-colour alternatives |
| Trust | Acceptance → trust → admiration | Common-tone voicings, consonant answers, stable phrase endings |
| Fear | Apprehension → fear → terror | Repeated cells, suspended resolution, constrained register and unsettled accents |
| Surprise | Distraction → surprise → amazement | Occasional displacement, a new register or unexpected phrase extension |
| Sadness | Pensiveness → sadness → grief | Falling contours, longer rests, minor/mixture alternatives |
| Disgust | Boredom → disgust → loathing | Broken repetition, chromatic neighbour alternatives and clipped responses |
| Anger | Annoyance → anger → rage | Forceful accents, persistent ostinati and sharper rhythmic contrasts |
| Anticipation | Interest → anticipation → vigilance | Repeated preparation, rising contour, deferred arrival and selective entrances |

Each vocabulary is constrained by the selected musical profile. Locking harmony means a change toward sadness can affect contour, gates and spacing while retaining the current harmony. High-intensity grief does not require high activity; energy controls that independently.

## Resolve the source's duplicate regions explicitly

The artwork has four paths per petal but three distinct named intensity levels. Seven petals duplicate their strongest label at the thin tip; anger duplicates annoyance. The original component uses geometric `intensityRanks` for alternative chord behaviour, which is a separate convention.

For emotion selection, map by a stable `(petal ID, source path index)` table. Use the source emotion label to select mild, middle or strong strength; duplicate-labelled regions are aliases of the same emotion and highlight together. This retains all 32 touch regions while representing 24 named choices. Do not infer a fourth psychological emotion or use raw path order as intensity.

Normalize strength initially as `1/3`, `2/3`, `1`; these are interface settings, not measured psychological distances. Optional fine adjustment can interpolate strength within the selected family. The provided [mapping file](interface/plutchik-regions.json) enumerates every source path and alias explicitly.

## Interaction contract

Tap or click to select and latch an emotion. Releasing the pointer retains the target so the composer continues autonomously. Dragging across regions updates the target with smoothing. Keyboard Enter or Space selects; arrow keys move between families or intensity levels. Provide an equivalent family selector and intensity control with readable labels and at least 44 × 44 CSS-pixel targets.

Start and Stop control performance independently of the selected emotion. Stop immediately cancels future attacks and releases owned notes; it does not erase the selection. Finish phrase requests a cadence. A separate Clear emotion action restores the musical profile's neutral mapping; neither the centre nor a blank gap should mean Stop implicitly.

Begin with one selected family. Do not interpret multitouch as multiple sounding chords. A later explicit Blend mode may preserve two family weights, including opposed feelings, without reducing them to an accidentally cancelled valence value. That mode needs its own mapping and evaluation before being enabled.

Pointer pressure is optional expression, not the default source of energy or intensity. The existing chord controller's attack-pressure mapping should not be inherited automatically. Mouse, keyboard and touch users must be able to select the same musical state.

## Composer event contract

Use a proposed selection event such as `composerEmotionChange`, separate from note-on/note-off:

```json
{
  "schemaVersion": 1,
  "family": "sadness",
  "emotion": "sadness",
  "strength": 0.6666666666666666,
  "sourceRegion": "grief:2",
  "gesture": "select"
}
```

This is a new proposed contract, not an event already implemented by PhotoSYNTH. Record a monotonic observation timestamp at the integration boundary. Keep `energy` in a separate control event/property and save both with the resolved score.

The mapping layer converts family and strength into weighted preferences for harmony, contour, articulation, rhythm and novelty. Retain family identity even if a profile also derives valence/arousal coordinates; eight categorical families cannot be recovered faithfully from a single collapsed scalar.

## Feedback and timing

Show two distinct states: **selected target** and **currently applied expression**. A solid outline marks the selection; text indicates when a planned change takes effect. A quieter applied-state marker may remain on the prior selection until the next phrase boundary. Colour alone must not distinguish these states.

Apply local articulation preferences at future uncommitted notes, texture changes at a bar boundary and harmonic changes at a phrase boundary unless a profile specifies otherwise. Respect tempo/harmony locks. Rapid dragging should update a pending target rather than enqueue dozens of obsolete transitions.

Examples: selecting Rage at low energy can strengthen a sparse ostinato without filling every subdivision. Selecting Grief at high energy can retain rapid activity while changing contour and harmonic vocabulary. Selecting Amazement can propose an occasional structural surprise without discarding the motif on every note.

## Accessibility and integration checks

The source already demonstrates keyboard, focus and lifecycle patterns. Revalidate them after adapting the interaction: the new control is a latched single selection, not a held chord pad. Expose family, emotion and strength in accessible names; use a single-selection semantic model and a readable alternative control. Duplicate aliases represent the same selected value, not independent toggles.

Test narrow screens, zoom, keyboard-only operation, visible focus, reduced motion, drag cancellation and selection persistence after pointer release. Verify that wheel selection produces a composer-control event and no immediate MIDI note. Verify that Stop still releases notes while a selection remains latched. Compare low/high intensity at matched energy and low/high energy at matched emotion to establish that the two dimensions remain separate.

The exact source files and SVG paths were inspected locally. Their hashes are appended to the [source manifest](references/local-source-manifest.json). No changes were made to the PhotoSYNTH checkout.
