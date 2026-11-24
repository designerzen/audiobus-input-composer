# 16 — Working glossary

| Term | Meaning in this project |
| --- | --- |
| Algorithmic composition | Choosing musical structures or events by explicit procedures |
| Generative music | Music produced by an ongoing rule/model system; may be finite or endless |
| Procedural audio | Ambiguous term covering event generation and sound synthesis; this library extracts the event side |
| Symbolic music | Notes, durations, controls and structural annotations rather than a waveform |
| Event | A time-located musical or control decision with identity and context |
| Beat | A declared pulse unit; its note value must be specified |
| Meter | Organization of pulses and metric weights, including grouping |
| Cycle | A repeating temporal reference whose length is explicitly defined |
| Groove | Relationships of timing, duration and accent that shape rhythmic feel |
| Swing | Unequal subdivision timing within a larger pulse; ratio is only one simple model |
| Syncopation | A rhythmic relationship to expected metric emphasis, often involving weak-position attacks or sustain |
| Polyrhythm | Different divisions operating over a shared time span |
| Polymeter | Different metric cycle lengths occurring together |
| Harmonic rhythm | Rate and placement of harmony changes |
| Tonal centre | A pitch treated as a point of reference or stability in a profile |
| Mode | A profile-defined pitch organization; more than a generic emotion label |
| Scale degree | Pitch position relative to a tonal collection, using an explicit indexing convention |
| Voicing | Register, spacing, order and doubling of a chord's notes |
| Voice-leading | Movement of individual voices between musical events |
| Counterpoint | Relationships among distinct musical lines |
| Tessitura | Typical working register, rather than absolute minimum and maximum pitch |
| Motif | A short identity-bearing musical idea |
| Phrase | A coherent span with internal direction and some degree of closure |
| Cadence | A profile-specific gesture of closure or punctuation |
| Tension | Intended instability or unresolved expectation within the selected musical practice |
| Valence | Intended positive/negative expressive coordinate; not a quality judgment |
| Arousal | Intended activation coordinate |
| Energy | A separate intensity/activity control implemented through chosen musical channels |
| Density | Attack count per time unit, distinguished from simultaneous-note count |
| Articulation | How notes are connected, separated, stressed or shaped; symbolic gate is one component |
| Gate | Final duration for which an event is held before release |
| Entropy | Uncertainty of a probability distribution, relative to a particular model |
| Surprisal | `-log2(probability)` of an event under a model; not synonymous with pleasure |
| Pattern algebra | Composing and transforming event patterns through reusable operations |
| Markov model | Predictive model conditioned on a finite state or context |
| Factor oracle | Automaton used in sequence analysis and recombination; one basis for machine improvisation |
| Hard constraint | A condition that accepted output must satisfy |
| Soft constraint | A preference that may be traded against other preferences |
| Seed | Initial or keyed information determining reproducible pseudorandom choices |
| Planning horizon | How far ahead musical decisions may be drafted |
| Commitment horizon | How far ahead delivery decisions become fixed or sent |
| Provenance | Trace of where material and transformations came from |
| UMP | Universal MIDI Packet format; carrying it does not imply support for every MIDI 2.0 feature |
| AudioBus adapter | Boundary translating resolved events into the actual host's supported protocol |

These definitions establish local usage. Individual traditions and tools may use some terms differently; musical profiles and adapters should state those differences.
