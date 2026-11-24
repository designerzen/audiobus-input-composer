# 12 — AudioBus events and scheduling

## What was verified locally

The sibling [audiobus-protocol README](../../audiobus-protocol/README.md), [wire specification](../../audiobus-protocol/docs/protocol.md) and [Peer source](../../audiobus-protocol/src/index.ts) were examined. The older sibling [audiobus README](../../audiobus/README.md) describes a separate historical codebase; do not infer the current Input interface from that old README alone.

The protocol supports WebMidiLink-style MIDI messages, negotiated UMP, command discovery, scalar properties and capability bundles. `Peer.sendMidi(bytes)` sends a message immediately; it does not take a future timestamp. Version 1 uses arrival time and provides no shared clock synchronization. UMP carriage does not automatically establish scheduling or MIDI-CI support. These are local source findings, not assumptions about Apple's similarly named Audiobus product.

## Consequence: keep future events local

A composer can plan sixteen bars ahead while sending only currently due messages. Never send an entire future score through `sendMidi` and assume the receiver will delay its notes. If accurate remote lookahead is needed, design and negotiate a timestamped score/scheduling capability, including clock calibration and cancellation. Such an extension is proposed, not present in the inspected protocol.

For comparison, direct [Web MIDI `send` timing](https://webaudio.github.io/web-midi-api/#dom-midioutput-send) uses a timestamp on the performance time base. That facility should be used only by an adapter that actually owns a MIDIOutput. It is different from passing bytes through the present AudioBus Peer API.

## Clock authority

Choose one authority per session: host clock, external MIDI clock, or composer clock. Read or discover the actual transport interface rather than assuming a command name exists. The protocol's example `transport.setTempo` is an example application command, not a mandatory universal transport contract.

Record tempo requests separately from accepted tempo changes. If the composer follows the host, it can change subdivision, arrangement and articulation while leaving tempo locked. External MIDI clock has transport and pulse semantics; conversion into the internal beat timeline needs explicit start, continue, stop and position handling.

## A proposed adapter loop

```text
on each scheduler wake:
  read authoritative monotonic time and musical position
  obtain events intersecting a short local planning window
  retain their original event IDs and onset spans
  queue local note-on and note-off deadlines
  dispatch due protocol MIDI immediately
  measure lateness and record actual dispatch
```

Wake cadence and queue horizon must be measured on target devices. Inclusive City's 25 ms wake / 75 ms MIDI lookahead is a local precedent, not a validated AudioBus remote scheduling budget. Main-thread timers can be throttled; a worker can improve isolation but does not guarantee accurate delivery when the host or browser is suspended.

If the tab is suspended, a safe initial policy is to release owned notes and pause. On resume, rejoin at a future boundary. Do not replay a backlog as a burst of stale attacks.

## Note lifecycle ledger

Track each outgoing note by source session, part, channel, pitch and event ID. Schedule its release when accepting its attack. Stop invalidates future attacks and releases owned active notes. Disconnect, reload, output change and seek must do the same. If reconnection occurs, resume with new future notes; do not resurrect an old held-note ledger.

MIDI 1.0 does not uniquely identify overlapping same-channel same-pitch voices. Choose an explicit policy: avoid overlap on that address, merge gates, retrigger with an explicit release, or allocate voices to distinct channels when feasible. A naive reference count cannot guarantee that every receiver will interpret overlapping attacks as intended. Document the chosen behaviour.

Sustain release and channel-wide cleanup can affect other performers sharing a channel. Prefer dedicated channels and session-owned explicit note releases. Do not use a global panic as the routine way to stop one part in a shared setup.

## MIDI mapping

Map normalized velocity to `1..127` for audible note-ons and use explicit note-off messages for release; zero-velocity note-on is a MIDI note-off convention. Clamp and validate every value. Preserve the internal dynamic value because velocity is instrument-dependent and not a decibel measurement.

Microtonal playback requires a negotiated strategy: pitch bend with channel allocation, MPE, or supported MIDI 2.0 messages. Plain semitone MIDI is the first baseline. UMP transport capability alone is insufficient evidence that a receiver implements the intended expressive feature.

## Proposed public controls

Offer seed, musical profile, energy, valence, arousal, tension, novelty, density cap and dimension locks as scalar properties where appropriate. Commands can start, stop, request cadence, recall a motif or regenerate the next unlocked phrase. Rich score structures require an agreed extension because the inspected command schema accepts only a bounded scalar parameter subset.

This chapter specifies integration questions to resolve before implementation; it does not claim that a new Input or capability bundle has been registered.
