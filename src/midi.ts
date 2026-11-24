import type { MidiOutputAdapter, MidiSink, Score } from './types.js';
import { validateEvents } from './composer.js';

/** No clock extension is assumed: call only when the local scheduler says a message is due. */
export const audioBusOutput = (peer: MidiSink): MidiOutputAdapter => ({ label: 'AudioBus', send: bytes => peer.sendMidi(bytes) });
export const webMidiOutput = (output: { send(data: number[]): void; name?: string | null }): MidiOutputAdapter => ({ label: output.name ?? 'MIDI output', send: bytes => output.send([...bytes]) });

function variableLength(value: number): number[] {
  const result = [value & 127];
  while ((value = Math.floor(value / 128)) > 0) result.unshift((value & 127) | 128);
  return result;
}
const be = (n: number, bytes: number) => Array.from({ length: bytes }, (_, i) => (n >>> (8 * (bytes - 1 - i))) & 255);

/** Format-0 Standard MIDI File, 480 PPQ, explicit note-offs and a fixed export tempo. */
export function scoreToMidi(score: Score): Uint8Array {
  validateEvents(score.events);
  if (!Number.isFinite(score.options.tempo) || score.options.tempo < 30 || score.options.tempo > 240) throw new RangeError('Invalid export tempo');
  if (!Number.isFinite(score.length) || score.length <= 0 || score.length * 480 > 0x0fffffff || score.events.some(e => e.start + e.duration > score.length + 1e-8)) throw new RangeError('Invalid export score length');
  const entries: { tick: number; order: number; data: number[] }[] = [];
  const tempo = Math.round(60_000_000 / score.options.tempo);
  entries.push({ tick: 0, order: -2, data: [255, 81, 3, ...be(tempo, 3)] }, { tick: 0, order: -1, data: [255, 88, 4, 4, 2, 24, 8] });
  // Retrigger policy matches live transport. Superseded gates never release a newer note.
  const addresses = new Map<string, typeof score.events>();
  for (const event of score.events) { const key = `${event.channel}:${event.pitch}`; const list = addresses.get(key) ?? []; list.push(event); addresses.set(key, list); }
  for (const list of addresses.values()) {
    list.sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));
    for (let i = 0; i < list.length; i++) {
      const e = list[i], channel = e.channel - 1;
      const end = Math.min(e.start + e.duration, list[i + 1]?.start ?? Infinity);
      // Simultaneous collisions choose the last event, matching the sorted live queue.
      if (end <= e.start) continue;
      entries.push({ tick: Math.round(e.start * 480), order: 1, data: [144 | channel, e.pitch, Math.max(1, Math.round(e.velocity * 127))] });
      entries.push({ tick: Math.max(Math.round(e.start * 480) + 1, Math.round(end * 480)), order: 0, data: [128 | channel, e.pitch, 0] });
    }
  }
  entries.sort((a, b) => a.tick - b.tick || a.order - b.order);
  const track: number[] = []; let previous = 0;
  for (const entry of entries) { track.push(...variableLength(entry.tick - previous), ...entry.data); previous = entry.tick; }
  const endTick = Math.max(previous, Math.round(score.length * 480));
  track.push(...variableLength(endTick - previous), 255, 47, 0);
  return new Uint8Array([77, 84, 104, 100, 0, 0, 0, 6, 0, 0, 0, 1, 1, 224, 77, 84, 114, 107, ...be(track.length, 4), ...track]);
}
