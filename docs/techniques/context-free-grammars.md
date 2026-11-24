# T041 — Context-free musical grammars

Family: **Grammars and rewriting**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Expand nonterminal symbols through production rules until a terminal structure is obtained.

## Proposed symbolic-music use

Let phrases expand into statement, response and cadence cells, each carrying a known duration and harmonic contract.

## Worked example or experiment setup

Phrase -> Statement Response Cadence; assign durations 4,2,2 beats so the result fills eight beats exactly.

## Time, emotion and energy

Emotion chooses legal terminal variants; energy chooses ornamented variants; depth and duration constrain expansion.

## Failure modes and practical limits

Recursive productions can fail to terminate or expand beyond the intended duration. Valid syntax is not convincing phrasing.

## Evaluation

Check termination, duration sums and join conditions; compare generated forms with authored sequences.

## AudioBus integration

Expand into a finite musical program with duration and entry/exit contracts. Validate before emission and bound derivation depth and event count.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [Bird, Klein and Loper: grammars and parsing](https://www.nltk.org/book/ch08.html)
- [Prusinkiewicz: score generation with L-systems](https://algorithmicbotany.org/papers/score.icmc86.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.
