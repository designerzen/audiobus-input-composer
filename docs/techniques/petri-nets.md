# T048 — Petri-net-inspired musical coordination

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Tokens enable transitions subject to input and output conditions.

## Proposed symbolic-music use

Represent available musical roles or turn-taking permissions as tokens, so an answer begins only after its lead phrase has yielded.

## Worked example or experiment setup

A lead-finished token and a harmony-ready token jointly enable an answer transition; firing consumes the permission and starts the response.

## Time, emotion and energy

Energy controls optional transitions; emotion selects response vocabulary; musical time controls transition deadlines.

## Failure modes and practical limits

Deadlock, token accumulation and starvation are musical failures as well as formal ones. A timeout needs an explicit rest/fallback policy.

## Evaluation

Trace token conservation and reachability on interrupted phrases, then assess whether turn-taking sounds intentional.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [van der Aalst and Berti: Petri-net event models](https://arxiv.org/abs/2010.02047)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
