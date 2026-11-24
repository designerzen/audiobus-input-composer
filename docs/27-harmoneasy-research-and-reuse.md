# 27 — HarmonEasy research: pitch geometry, performance agency and reuse

Reviewed 24 November 2026. HarmonEasy contributes both theory research and implemented AudioBus mechanisms. Its research findings, its application heuristics and this composer's proposals are kept distinct below. No changes were made to the HarmonEasy checkout.

## Research consulted

- [Scales, pitch sets and the musical torus](../../harmoneasy/research/scales-and-musical-torus.md): representations, set equivalences, interval analysis and the periodic fingerboard.
- [Ensemble evidence and design](../../harmoneasy/docs/research/ensemble-transformer.md): gesture agency, note cursors, grooves, synchronization and error policies.
- [Ensemble experiments](../../harmoneasy/docs/research/ensemble-next-experiments.md): acceptance feedback, selective correction, recovery, expressive gestures and evaluation.
- [Research index](../../harmoneasy/docs/research/README.md): evidence conventions and scope.

The scale note links Ian Ring, Marc Gallo/Studio Devil and Andrew Duncan. Ring's [original essay](https://ianring.com/musictheory/scales/) was independently consulted here. Studio Devil's page was inaccessible through the web tool and Duncan's page timed out; their detailed interpretations remain inherited from the local note. No certificate-verification bypass was used in this task.

The ensemble note contains sixteen annotated references. This review uses its synthesis selectively rather than claiming a fresh complete read of all sixteen papers. Independently checked primary/official material includes [MidifilePerformer’s proceedings abstract](https://sigplan.github.io/OpenTOC/farm21.html), [Antescofo synchronization documentation](https://antescofo-doc.ircam.fr/Reference/time_synchro/), [Ableton Link documentation](https://ableton.github.io/link/), the [GEM article](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2022.916551/full), and [Action-Sound Latency](https://nime.org/proceedings/2016/nime2016_paper0005.pdf). Reading scope was record/abstract, relevant documentation or selected article passages; no experiment was reproduced.

## Pitch sets are a complete material space, not a complete music theory

Ring's representation encodes twelve pitch-class memberships in bits. The design implication is valuable: a generator need not be limited to a menu of named major/minor scales. It can explore sparse sets, complements and symmetric collections while retaining explicit musical context.

HarmonEasy's [pitch-class-set.ts](../../harmoneasy/packages/audiobus/tuning/pitch-class-set.ts) was read directly. It implements membership masks, affine mappings, class representatives, autocorrelation, interval-class counts and directional quantization. Its representative is the minimum numeric mask over declared transformations, deliberately distinguished from a Forte catalogue number.

The code supports all 4096 masks including silence. Its nonempty transposition/inversion classes number 223. Those are different quantities: a class can contain many particular rooted collections. Reducing everything to a class ID would lose the tonic and musical function that a phrase planner needs.

**Composer use:** keep collection mask, tonic, degree spelling, harmonic role and voicing as separate fields. A Markov chain can propose degrees; a cellular automaton can propose activity; the pitch-set decoder determines eligible material. It must not erase intended passing notes or suspensions merely because a global collection changed.

## Intervals and symmetry as descriptors

The inspected analysis counts unordered interval classes, halving the tritone component derived from directed autocorrelation. This matters when comparing collections: a tritone pair must not be counted twice. The vector's entries should sum to the number of unordered pitch pairs.

**Composer use:** add interval content, cardinality and common-tone count to motif-library descriptors or a MAP-Elites archive. These describe structure; they are not calibrated emotion, tension or pleasantness scores. Collections with the same vector can still differ and can play different roles.

Symmetry can organize deliberate contrast. The whole-tone set, for example, has fewer distinct transpositions than a typical asymmetric collection. Use that property to create a colour field, then plan how thematic material enters and leaves it. Do not treat mathematical equivalence as perceptual identity.

## A torus supplies paths, not 144 independent notes

The local note describes the periodic fingerboard `p=(x+5y) mod 12`. Moving in one direction changes pitch by semitone and in the other by fourth. Its 12-by-12 surface repeats the twelve pitch classes. The [musical-torus module](../../harmoneasy/packages/audiobus/ui/musical-torus.ts) was located as the implementation link; its rendering implementation was not reviewed in this task.

**Composer use:** investigate a lattice walk as one motif generator. Preserve its interval path and map it to a workable register. It can be driven by a random walk, graph route or agent, but it does not replace the Plutchik star as this composer's chosen primary interface. The star steers expressive intent; a harmonic lattice is an internal musical space or optional inspector.

The technique folder contains individual documents for [torus walks](techniques/musical-torus-walks.md), [set proximity](techniques/pitch-set-proximity-graphs.md), [affine transforms](techniques/affine-pitch-transformations.md), [symmetry](techniques/symmetry-limited-transposition.md) and related pitch-set operations.

## Input and Transformer mechanisms already exist

[InputScaleExplorer](../../harmoneasy/packages/audiobus/io/inputs/input-scale-explorer.ts) supplies a local precedent for a clock-driven symbolic Input. Its inspected timing path emits current eligible steps, releases prior notes and skips missed steps after a stalled update rather than replaying a backlog. The controls and set-operation pipeline are in [scale-explorer-controls.ts](../../harmoneasy/packages/audiobus/io/scale-explorer-controls.ts).

[TransformerScaleExplorer](../../harmoneasy/packages/audiobus/io/transformers/transformer-scale-explorer.ts) maps incoming notes to an effective set. It explicitly handles several source keys converging on one target and releases targets according to stored ownership. This is a strong lifecycle precedent for algorithmic decoders: a later mask edit must not make a note-off target the new pitch instead of the pitch actually started.

**Reuse assessment:** the pure pitch-set functions are promising candidates for a shared module. The Input and Transformer demonstrate local host conventions. Their exact import/package boundary, tests and public API should be confirmed when implementation begins; reading them does not certify a drop-in integration.

## Ensemble research changes the meaning of autonomy

The local ensemble review separates a press requesting one onset from a press launching a repeating groove. That distinction prevents assistance from silently taking over an assigned melodic contribution. The [MidifilePerformer abstract](https://sigplan.github.io/OpenTOC/farm21.html) supplies a score/gesture precedent; the application’s exact one-key and recovery rules are its own design choices.

**Composer use:** label manual audition, motif selection, phrase launch and autonomous performance as distinct actions. Selecting Fear on the star can steer future autonomous choices, but it should not silently promise one manually triggered note. Conversely, a manual note request should not authorize a whole phrase.

Keep accepted, queued, sounding and stopped feedback distinct. A control can be accepted immediately while its harmonic effect waits for a phrase boundary. This directly strengthens the selected/applied-state distinction in the [Plutchik specification](18-plutchik-interface.md).

## Time, synchronization and recovery

Antescofo's documentation distinguishes synchronization strategies involving tempo and target positions. Link distinguishes shared tempo/phase from independent timelines and optional arrangement alignment. The inference for this Input is to track beat phase, section position, local motif progress and clock authority independently.

The local [EnsemblePerformance](../../harmoneasy/packages/audiobus/io/ensemble-performance.ts) was inspected selectively: role assignment, recovery thresholds, late-note duration treatment, groove boundaries and same-address releases. Its late-duration scale has a lower bound of .75 in the inspected path. That is an application heuristic; it does not implement the full synchronization theory cited by its research note.

**Composer use:** a late answer may defer, shorten or yield according to its role. Do not emit every missed note after a stall, reinterpret a written rest as failure, or claim synchronization because two parts share a BPM value. Store recovery decisions in the score/action log.

## Adaptation needs measured limits

The [GEM study](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2022.916551/full) concerns adaptive metronome behaviour in specific tapping tasks. It motivates testing bounded adaptation with audible feedback; its experimental gains are not percentages to add to tempo or a validated conductor rule for this composer.

[McPherson, Jack and Moro](https://nime.org/proceedings/2016/nime2016_paper0005.pdf) motivate measuring the complete action-to-sound path. Immediate acknowledgement, intended musical waiting, generation delay, dispatch delay and receiver sound latency must remain separate. An asynchronous worker or fast timer proves none of the final acoustic claim on its own.

## Concrete consequences for the technique library

1. Add pitch-set geometry as a first-class family, rather than treating a scale as only a seven-element array.
2. Require every stochastic, evolutionary and agent decoder to preserve target-note ownership through edits.
3. Separate material generation from gesture authority, phrase launching and autonomous transport.
4. Evaluate human-facing adaptation through contribution recognition and predictability as well as timing error.
5. Preserve explicit recovery and silent-set behaviours as valid musical outcomes.

These conclusions inform the 115 technique documents and [combination recipes](techniques/COMBINING.md). They do not replace the existing requirement for listening studies, accessible interaction testing and integration verification.
