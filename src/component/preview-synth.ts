import type { MidiOutputAdapter } from '../types.js';

interface ActiveVoice {
  sources: AudioScheduledSourceNode[];
  gain: GainNode;
  nodes: AudioNode[];
}

/** Expressive zero-dependency audition synth. The composition engine itself never creates audio. */
export class PreviewSynth implements MidiOutputAdapter {
  readonly label = 'Browser audition';
  private context?: AudioContext;
  private master?: GainNode;
  private compressor?: DynamicsCompressorNode;
  private delaySend?: GainNode;
  private voices = new Map<string, ActiveVoice>();
  private noise?: AudioBuffer;
  private volumeValue = .35;

  async resume(): Promise<void> {
    if (!this.context || this.context.state === 'closed') {
      const ctx = new AudioContext();
      this.context = ctx;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = .005;
      comp.release.value = .15;

      const master = ctx.createGain();
      master.gain.value = this.volumeValue * .28;
      master.connect(comp);
      comp.connect(ctx.destination);

      // Subtle damped delay space for warm audition depth.
      const send = ctx.createGain();
      send.gain.value = .16;
      const delay = ctx.createDelay(1);
      delay.delayTime.value = .24;
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 2200;
      const feedback = ctx.createGain();
      feedback.gain.value = .24;
      send.connect(delay);
      delay.connect(tone);
      tone.connect(feedback);
      feedback.connect(delay);
      tone.connect(master);

      this.compressor = comp;
      this.master = master;
      this.delaySend = send;

      this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    await this.context.resume();
  }

  set volume(value: number) {
    this.volumeValue = Math.max(0, Math.min(1, value));
    if (this.context && this.master) this.master.gain.setTargetAtTime(this.volumeValue * .28, this.context.currentTime, .02);
  }

  send(bytes: readonly number[]): void {
    const [status, pitch, velocity] = bytes, kind = status & 240, channel = status & 15, key = `${channel}:${pitch}`;
    const ctx = this.context;
    if (!ctx || !this.master || ctx.state !== 'running') return;
    if (kind === 128 || (kind === 144 && !velocity)) { this.release(key); return; }
    if (kind !== 144) return;
    this.release(key);

    if (channel === 9) {
      this.triggerDrum(ctx, pitch, velocity / 127);
      return;
    }

    const time = ctx.currentTime;
    const freq = 440 * 2 ** ((pitch - 69) / 12);
    const vel = velocity / 127;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    const sources: AudioScheduledSourceNode[] = [];
    const nodes: AudioNode[] = [filter, gain];

    if (channel === 0) {
      // Melody: warm electric-piano-like dual oscillator (triangle + detuned sine).
      const osc1 = ctx.createOscillator(), osc2 = ctx.createOscillator(), subGain = ctx.createGain();
      osc1.type = 'triangle'; osc1.frequency.value = freq;
      osc2.type = 'sine'; osc2.frequency.value = freq * 2; osc2.detune.value = 4;
      subGain.gain.value = .22;
      filter.frequency.setValueAtTime(1400 + vel * 2800, time);
      filter.frequency.exponentialRampToValueAtTime(750 + vel * 900, time + .35);
      filter.Q.value = 1.2;
      osc1.connect(filter); osc2.connect(subGain); subGain.connect(filter);
      sources.push(osc1, osc2); nodes.push(subGain);
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.linearRampToValueAtTime(vel * .85, time + .01);
      gain.gain.exponentialRampToValueAtTime(Math.max(.001, vel * .45), time + .45);
      filter.connect(gain);
      gain.connect(this.master);
      this.delaySend && gain.connect(this.delaySend);
    } else if (channel === 1) {
      // Bass: deep sub-sine + filtered triangle punch.
      const sub = ctx.createOscillator(), body = ctx.createOscillator(), bodyGain = ctx.createGain();
      sub.type = 'sine'; sub.frequency.value = freq;
      body.type = 'triangle'; body.frequency.value = freq;
      bodyGain.gain.value = .45;
      filter.frequency.setValueAtTime(420 + vel * 550, time);
      filter.frequency.exponentialRampToValueAtTime(220, time + .25);
      sub.connect(filter); body.connect(bodyGain); bodyGain.connect(filter);
      sources.push(sub, body); nodes.push(bodyGain);
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.linearRampToValueAtTime(vel * .75, time + .008);
      filter.connect(gain);
      gain.connect(this.master);
    } else {
      // Harmony: warm detuned pad/EP voicing.
      const osc1 = ctx.createOscillator(), osc2 = ctx.createOscillator();
      osc1.type = 'triangle'; osc1.frequency.value = freq; osc1.detune.value = -5;
      osc2.type = 'sine'; osc2.frequency.value = freq; osc2.detune.value = 5;
      filter.frequency.setValueAtTime(900 + vel * 1100, time);
      osc1.connect(filter); osc2.connect(filter);
      sources.push(osc1, osc2);
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.linearRampToValueAtTime(vel * .42, time + .035);
      filter.connect(gain);
      gain.connect(this.master);
      this.delaySend && gain.connect(this.delaySend);
    }

    for (const s of sources) s.start(time);
    const voice: ActiveVoice = { sources, gain, nodes };
    this.voices.set(key, voice);
    sources[0].onended = () => {
      for (const s of sources) { try { s.disconnect(); } catch { /* noop */ } }
      for (const n of nodes) { try { n.disconnect(); } catch { /* noop */ } }
      if (this.voices.get(key) === voice) this.voices.delete(key);
    };
  }

  private triggerDrum(ctx: AudioContext, pitch: number, vel: number): void {
    const time = ctx.currentTime;
    const master = this.master!;
    if (pitch === 36) {
      // Kick: pitch-swept sine + subtle click.
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + .11);
      gain.gain.setValueAtTime(vel * .95, time);
      gain.gain.exponentialRampToValueAtTime(.0001, time + .22);
      osc.connect(gain); gain.connect(master);
      osc.start(time); osc.stop(time + .24);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    } else if (pitch === 37) {
      // Rimshot / side-stick.
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(520, time);
      osc.frequency.exponentialRampToValueAtTime(260, time + .03);
      gain.gain.setValueAtTime(vel * .55, time);
      gain.gain.exponentialRampToValueAtTime(.0001, time + .06);
      osc.connect(gain); gain.connect(master);
      osc.start(time); osc.stop(time + .07);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    } else if (pitch === 38) {
      // Snare: bandpass noise burst + 190Hz tone body.
      const noise = ctx.createBufferSource(); noise.buffer = this.noise!;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = .8;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(vel * .6, time); nGain.gain.exponentialRampToValueAtTime(.0001, time + .16);
      noise.connect(bp); bp.connect(nGain); nGain.connect(master);
      noise.start(time); noise.stop(time + .18);
      noise.onended = () => { noise.disconnect(); bp.disconnect(); nGain.disconnect(); };

      const body = ctx.createOscillator(), bGain = ctx.createGain();
      body.type = 'triangle'; body.frequency.setValueAtTime(195, time);
      body.frequency.exponentialRampToValueAtTime(110, time + .07);
      bGain.gain.setValueAtTime(vel * .45, time); bGain.gain.exponentialRampToValueAtTime(.0001, time + .09);
      body.connect(bGain); bGain.connect(master);
      body.start(time); body.stop(time + .1);
      body.onended = () => { body.disconnect(); bGain.disconnect(); };
    } else {
      // Hi-hats (42 closed, 46 open) and ride/cymbal (51).
      const noise = ctx.createBufferSource(); noise.buffer = this.noise!;
      const hp = ctx.createBiquadFilter(); hp.type = pitch === 51 ? 'bandpass' : 'highpass';
      hp.frequency.value = pitch === 51 ? 5200 : 7400;
      const decay = pitch === 51 ? .34 : pitch === 46 ? .22 : .05;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vel * (pitch === 51 ? .32 : .38), time);
      gain.gain.exponentialRampToValueAtTime(.0001, time + decay);
      noise.connect(hp); hp.connect(gain); gain.connect(master);
      noise.start(time); noise.stop(time + decay + .02);
      noise.onended = () => { noise.disconnect(); hp.disconnect(); gain.disconnect(); };
    }
  }

  private release(key: string): void {
    const voice = this.voices.get(key);
    if (!voice || !this.context) return;
    this.voices.delete(key);
    const time = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(time);
    voice.gain.gain.setTargetAtTime(0, time, .02);
    for (const s of voice.sources) {
      try { s.stop(time + .12); } catch { /* Already stopped. */ }
    }
  }

  dispose(): void {
    for (const key of [...this.voices.keys()]) this.release(key);
    this.compressor?.disconnect();
    void this.context?.close();
    this.context = undefined;
    this.master = undefined;
    this.compressor = undefined;
    this.delaySend = undefined;
  }
}
