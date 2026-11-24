# T001 — Weighted categorical choice

Family: **Probability and stochastic processes**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Choose one discrete outcome using nonnegative weights normalized to a probability distribution.

## Proposed symbolic-music use

Use candidate motifs, chord functions or articulations as outcomes. Filter illegal candidates before normalization, so randomness selects a musically meaningful alternative.

## Worked example or experiment setup

For tonic, predominant and dominant weights [5,2,3], probabilities are [.5,.2,.3]. This does not require the next ten choices to contain exactly five tonics.

## Time, emotion and energy

Energy can favour active variants; emotion changes profile-specific weights; section time can increase a cadence weight.

## Failure modes and practical limits

Independent choices forget context. All-zero weights need an explicit fallback; peaked weights can trap the piece.

## Evaluation

Compare empirical frequencies over many seeds, then listen for direction with and without phrase constraints.

## AudioBus integration

Use small, seeded event proposals on the event or bar scale. A distribution supplies variation; the conductor supplies phrase targets and shared limits.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [NumPy: categorical sampling](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
