import type { MidiOutputAdapter } from '../types.js';

/** Small audition renderer. The composition engine itself never creates audio. */
export class PreviewSynth implements MidiOutputAdapter {
  readonly label = 'Browser audition';
  private context?: AudioContext;
  private master?: GainNode;
  private voices = new Map<string, { source: AudioScheduledSourceNode; gain: GainNode }>();
  private noise?: AudioBuffer;
  private volumeValue = .35;
  async resume(): Promise<void> {
    if (!this.context || this.context.state === 'closed') {
      this.context = new AudioContext(); this.master = this.context.createGain();
      this.master.gain.value = this.volumeValue * .18; this.master.connect(this.context.destination);
      this.noise = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    await this.context.resume();
  }
  set volume(value: number) {
    this.volumeValue = Math.max(0, Math.min(1, value));
    if (this.context && this.master) this.master.gain.setTargetAtTime(this.volumeValue * .18, this.context.currentTime, .02);
  }
  send(bytes: readonly number[]): void {
    const [status, pitch, velocity] = bytes, kind = status & 240, channel = status & 15, key = `${channel}:${pitch}`;
    const context = this.context;
    if (!context || !this.master || context.state !== 'running') return;
    if (kind === 128 || (kind === 144 && !velocity)) { this.release(key); return; }
    if (kind !== 144) return;
    this.release(key);
    const gain = context.createGain(), time = context.currentTime;
    let source: OscillatorNode | AudioBufferSourceNode;
    if (channel === 9 && pitch !== 36) {
      source = context.createBufferSource(); source.buffer = this.noise!;
      const filter = context.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = pitch === 42 ? 7000 : 1800;
      source.connect(filter); filter.connect(gain);
    } else {
      source = context.createOscillator(); source.type = channel === 2 ? 'sine' : channel === 1 ? 'triangle' : 'sine';
      source.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
      if (channel === 9) { source.frequency.setValueAtTime(130, time); source.frequency.exponentialRampToValueAtTime(42, time + .13); }
      source.connect(gain);
    }
    const level = velocity / 127 * (channel === 2 ? .5 : 1);
    gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(level, time + .008);
    gain.connect(this.master); source.start();
    this.voices.set(key, { source, gain });
    source.onended = () => { source.disconnect(); gain.disconnect(); if (this.voices.get(key)?.source === source) this.voices.delete(key); };
    if (channel === 9) {
      gain.gain.exponentialRampToValueAtTime(.0001, time + .18); source.stop(time + .2);
    }
  }
  private release(key: string): void {
    const voice = this.voices.get(key);
    if (!voice || !this.context) return;
    this.voices.delete(key);
    const time = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(time); voice.gain.gain.setTargetAtTime(0, time, .015);
    try { voice.source.stop(time + .1); } catch { /* Percussion already ended. */ }
  }
  dispose(): void {
    for (const key of this.voices.keys()) this.release(key);
    void this.context?.close(); this.context = undefined; this.master = undefined;
  }
}
