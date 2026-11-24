# T021 — Genetic algorithms for phrases

Family: **Evolution and quality-diversity**. Reviewed 24 November 2026. [Technique index](README.md).

## Mechanism

Evolve a population using selection, recombination and mutation over an explicit representation.

## Proposed symbolic-music use

Encode a phrase as rhythmic cells, degree anchors and articulation genes. Decode and validate before calculating musical criteria.

## Worked example or experiment setup

Cross two four-cell phrases only at cell boundaries, preserve their cadence anchor, then mutate one optional interval.

## Time, emotion and energy

Energy selects density objectives; emotion selects profile preferences; evolution prepares future phrases outside the commitment window.

## Failure modes and practical limits

Fitness can reward bland repetition; naive crossover breaks meter and voice-leading. More generations do not prove better music.

## Evaluation

Compare against equal-budget random search, log objective components and audition held-out seeds.

## AudioBus integration

Prepare candidate phrases or parameter libraries away from the timing callback. Store objective components, lineage, repairs and the plan revision.

Produce resolved musical events before delivery. The [composer architecture](../11-composer-architecture.md), [Plutchik interface](../18-plutchik-interface.md) and [scheduling contract](../12-audiobus-events-and-scheduling.md) supply the shared context. This is research, not an implemented Input feature.

## Sources and evidence boundary

- [DEAP: evolutionary operators](https://deap.readthedocs.io/en/master/api/tools.html)

Sources support the method, mathematical background or documented musical precedent; the proposed mapping, control assignments and experiments above are project designs. A general algorithm reference is not evidence of listener benefit or a claim that its authors implemented this musical mapping. Local HarmonEasy notes are explicitly secondary research; see [the reuse analysis](../27-harmoneasy-research-and-reuse.md) for independently checked sources and inspected code.

## Encode musical meaning before choosing a search algorithm

A useful phrase chromosome contains cell identity, degree anchors, rhythm, articulation and an explicit ending contract. An array of unrelated MIDI integers makes mutation easy but places most musical work in a repair stage. Fixed rhythmic templates are a reasonable first experiment because they isolate pitch and contour search.

For example, hold onsets `[0,1,1.5,3]` in a four-beat bar and begin with degrees `[0,2,1,4]`. The first and last degrees are protected anchors. Mutating the second degree from 2 to 3 creates a controlled variant while preserving attack placement. A separate cell-level mutation can later change rhythm without altering total phrase length.

## Selection, crossover, mutation and repair

Select parents with a documented rule, such as tournament selection. Recombine only at musically valid boundaries. Copy parents before mutation; otherwise an implementation can accidentally change a preserved elite. Invalidate stored objective values whenever the decoded candidate changes.

Mutation operations can replace an optional degree, exchange two interior cells, shorten a gate, rotate an accent cell or choose another valid voicing. Each operation has a different musical effect. A single mutation-rate knob does not express which type of novelty is desired.

Repair ranges and exact durations before evaluation, but log repairs. If most offspring need major repair, revise the encoding or operators. A search that proposes nonsense and always repairs it to the same tonic phrase can appear converged while producing little useful diversity.

## Fitness is a hypothesis about a task

Keep named components for voice movement, theme resemblance, phrase completion, target activity and arrangement space. Valid event lifetimes and hard budgets are acceptance conditions, not small penalties that can be traded away for a high score elsewhere. Use multiple objectives when meaningful trade-offs should remain available for selection.

Avoid rewarding only scale membership, consonance or small intervals. Those objectives can be satisfied by an immobile, repetitive phrase. Conversely, maximizing novelty can reward extreme leaps and density. Evaluate an intentional balance against human judgments and retain disliked examples as well as successful demonstrations.

## Online evolution versus offline evolution

Offline search can curate a library of phrase variants for later use. Online search prepares future phrases in a worker under a strict proposal/evaluation budget. It does not mutate the active score while notes are being delivered. If the deadline expires, use the best validated available candidate or a procedural fallback.

A population prepared for one harmonic plan must be revalidated if the plan changes. Tag every candidate with its target section, control snapshot and revision. The wheel steers future selection preferences; it does not justify replacing committed notes or forgetting a cadence obligation.

## A fair first experiment

Use the same representation and objective for an evolutionary search and an equal-budget random search. Also retain the original motif as a baseline. Compare multiple seeds, objective components, duplicate rates, repair rates and musician preference. A higher internal score alone cannot demonstrate that evolution contributed musically useful development.
