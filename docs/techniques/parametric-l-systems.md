# T046 — Parametric L-systems

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Carry numerical parameters on symbols and transform them through production expressions.

## Proposed symbolic-music use

Attach degree offset, duration and accent to motif cells, enabling gradual growth or contraction.

## Worked example or experiment setup

A cell F(d,t) can expand to F(d,t/2) followed by F(d+2,t/2), preserving total duration while adding movement.

## Time, emotion and energy

Energy bounds subdivision; emotion controls allowed degree changes; section time fixes recursion depth.

## Failure modes and practical limits

Duration can shrink below playable limits. Parameter growth may push register outside the profile.

## Evaluation

Check total duration, minimum gate and pitch bounds at every derivation, not only after final decoding.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Prusinkiewicz and Lindenmayer: author publication archive](https://algorithmicbotany.org/papers/)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
