import { ALGORITHMS, FAMILIES, GENRES, PARTS, type ComposerOptions, type DispatchRecord, type EmotionFamily, type Genre, type MidiOutputAdapter, type MidiSink, type Mode, type Phrase, type Score } from '../types.js';
import { GENRE_PROFILES, genreTempo } from '../genres.js';
import { GENERATOR_VERSION } from '../version.js';
import { compose, DEFAULT_OPTIONS, normalizeOptions, phraseKey, pitchName } from '../composer.js';
import { EMOTIONS, clamp, mod } from '../theory.js';
import { audioBusOutput, scoreToMidi, webMidiOutput } from '../midi.js';
import { ComposerSession, type PerformanceRecord } from '../session.js';
import { MidiFollower } from '../input.js';
import { PLUTCHIK_ART } from './plutchik-art.js';
import { STYLES } from './styles.js';
import { PreviewSynth } from './preview-synth.js';
import { COMPOSER_CONTROL_CHANGE, COMPOSER_ERROR, COMPOSER_NOTE, COMPOSER_PHRASE, COMPOSER_STATE_CHANGE } from '../events.js';

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ALGORITHM_LABELS: Record<typeof ALGORITHMS[number], string> = {
  motif: 'Motif development', markov: 'Markov memory', life: 'Game of Life', evolution: 'Evolutionary search',
  grammar: 'L-system grammar', euclidean: 'Euclidean patterns', torus: 'Tonnetz torus walk',
};
const MODE_LABELS: Record<Mode, string> = {
  auto: 'Follow emotion', major: 'Major', minor: 'Minor', dorian: 'Dorian', mixolydian: 'Mixolydian',
  lydian: 'Lydian', phrygian: 'Phrygian', 'harmonic-minor': 'Harmonic minor', locrian: 'Locrian',
};
const COLOURS = { melody: '#d0e9aa', bass: '#88abd9', harmony: '#b9a0d9', percussion: '#e8b780' };
// Keep presentation CSS in the shadow stylesheet rather than an SVG raw-text element.
// This also lets HTML fragment parsers mount the entire panel consistently.
const STAR_STYLES = PLUTCHIK_ART.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const STAR_ART = PLUTCHIK_ART.replace(/<style>[\s\S]*?<\/style>/, '');

/** A dependency-free, Shadow DOM instrument. Import the component entry to register it. */
export class AudioBusComposer extends HTMLElement {
  static observedAttributes = ['seed', 'emotion', 'energy', 'intensity', 'tempo', 'root', 'mode', 'algorithm', 'genre', 'swing', 'host-clock'];
  private view = this.attachShadow({ mode: 'open' });
  private state = normalizeOptions();
  private scoreValue = compose();
  private synth = new PreviewSynth();
  private output: MidiOutputAdapter = this.synth;
  private hosted = false;
  private session = this.makeSession();
  private events = new Map(this.scoreValue.events.map(e => [e.id, e]));
  private listeners?: AbortController;
  private frame?: number;
  private playToken = 0;
  private midiAccess?: MIDIAccess;
  private midiPort?: MIDIOutput;
  private midiInput?: MIDIInput;
  /** Follows the key of a connected player and keeps their last notes as a possible theme. */
  private follower = new MidiFollower({ onKey: key => this.followKey(key.root, key.mode) });
  private peerValue?: MidiSink;
  private ready = false;
  private lastBarDrawn = -1;
  private taps: number[] = [];

  get options(): ComposerOptions { return normalizeOptions(this.state); }
  set options(value: Partial<ComposerOptions>) { this.configure(value); }
  get score(): Score { return structuredClone(this.scoreValue); }
  get recording(): PerformanceRecord { return this.session.recording; }
  get playing(): boolean { return this.session.running; }
  /**
   * Host clock: the owner's transport drives the beat through advance(), so playback follows its tempo,
   * pause and stop. The Start, Stop and output controls are hidden; the host also supplies setOutput().
   */
  get hostClock(): boolean { return this.hosted; }
  set hostClock(value: boolean) {
    if (value === this.hosted) return;
    this.stop('clock-changed'); this.hosted = value;
    this.toggleAttribute('host-clock', value);
    this.session = this.makeSession(); this.updateStatus();
  }
  /** Host clock only: advance by quarter-note beats of the host transport. */
  advance(beats: number): void { this.session.advance(beats); }
  get peer(): MidiSink | undefined { return this.peerValue; }
  set peer(value: MidiSink | undefined) { this.connectPeer(value); }

  connectedCallback(): void {
    if (this.ready) return;
    this.ready = true;
    this.view.innerHTML = this.template();
    this.listeners = new AbortController();
    const signal = this.listeners.signal;
    this.view.addEventListener('input', e => this.onInput(e), { signal });
    this.view.addEventListener('change', e => void this.onChange(e), { signal });
    this.view.addEventListener('click', e => this.onClick(e), { signal });
    this.view.addEventListener('pointerdown', e => {
      const path = (e.target as Element).closest<SVGPathElement>('path[data-family]');
      if (path && (e as PointerEvent).button === 0) { this.selectPath(path); path.focus(); }
    }, { signal });
    this.view.addEventListener('pointerover', e => {
      const path = (e.target as Element).closest<SVGPathElement>('path[data-family]');
      if (path && (e as PointerEvent).buttons === 1) this.selectPath(path);
    }, { signal });
    this.view.addEventListener('keydown', e => this.onKeyDown(e as KeyboardEvent), { signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden && !this.hosted) this.stop('hidden'); }, { signal });
    window.addEventListener('pagehide', () => this.stop('page-hidden'), { signal });
    for (const name of AudioBusComposer.observedAttributes) if (this.hasAttribute(name)) this.attributeChangedCallback(name, null, this.getAttribute(name));
    this.refreshOutputs('internal'); this.syncControls(); this.renderScore(); this.updateStatus();
    if (this.playing) this.ensureAnimation();
  }
  disconnectedCallback(): void {
    this.listeners?.abort();
    this.stopAnimation();
    this.ready = false;
    // A host-clocked composer is an engine as well as a view: it keeps playing into the host's output when its panel closes.
    if (this.hosted) return;
    this.stop('disconnected'); this.synth.dispose();
    if (this.midiAccess) this.midiAccess.onstatechange = null;
    this.listenTo(undefined);
    this.midiAccess = undefined; this.midiPort = undefined;
    this.output = this.synth; this.session.setOutput(this.synth);
  }
  attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void {
    if (oldValue === value) return;
    if (name === 'host-clock') { this.hostClock = value !== null; return; }
    const fallback = DEFAULT_OPTIONS[name as keyof ComposerOptions];
    const next = value === null ? fallback : ['energy', 'intensity', 'tempo', 'root', 'swing'].includes(name) ? Number(value) : value;
    try { this.configure({ [name]: next }); } catch (e) { this.reportError(e); }
  }

  configure(patch: Partial<ComposerOptions>): void {
    this.state = normalizeOptions({ ...this.state, ...patch });
    this.session.update(this.state);
    if (!this.playing) { this.scoreValue = compose(this.state); this.renderScore(); }
    this.syncControls();
    this.emit(COMPOSER_CONTROL_CHANGE, { selected: this.options, applied: this.playing ? this.session.applied : null, pending: this.playing });
  }
  async start(): Promise<void> {
    if (this.playing) return;
    const token = ++this.playToken;
    try {
      if (this.output === this.synth) await this.synth.resume();
      if (token !== this.playToken || (!this.isConnected && !this.hosted)) return;
      this.session.update(this.state); this.session.start(); this.updateStatus(); this.ensureAnimation();
    } catch (error) { this.reportError(error); }
  }
  stop(reason = 'stopped'): void {
    this.playToken++;
    this.session.stop(reason);
    this.stopAnimation();
    this.clearActiveNotes();
    this.updateStatus(reason);
  }
  finish(): void { if (this.playing) { this.session.finish(); this.setText('applied', 'Finishing at the current phrase’s tonic cadence.'); } }
  connectPeer(peer?: MidiSink): void {
    this.peerValue = peer;
    this.setOutput(peer ? audioBusOutput(peer) : this.synth);
    this.refreshOutputs(peer ? 'peer' : 'internal');
  }
  setOutput(output: MidiOutputAdapter): void {
    this.playToken++; this.session.setOutput(output); this.output = output;
    this.updateStatus('output-changed');
  }
  async connectMidi(): Promise<void> {
    await this.requestMidi();
    const first = [...this.midiAccess!.outputs.values()].find(port => port.state === 'connected');
    if (!first) throw new Error('No MIDI outputs found. Connect an instrument and try again.');
    this.midiPort = first; this.setOutput(webMidiOutput(first)); this.refreshOutputs(first.id);
  }
  /** Listen to the first connected MIDI input: follow its key, and keep its notes for "Use played theme". */
  async connectMidiInput(): Promise<void> {
    await this.requestMidi();
    const first = [...this.midiAccess!.inputs.values()].find(port => port.state === 'connected');
    if (!first) throw new Error('No MIDI inputs found. Connect a keyboard and try again.');
    this.listenTo(first); this.refreshInputs(first.id);
  }
  /** Use the last notes played on the MIDI input as the theme from the next phrase. */
  usePlayedTheme(): void {
    const { root, mode } = phraseKey(this.state, 0);
    const motif = this.follower.motif(root, mode, 4);
    if (!motif) throw new Error('Play a few notes on the MIDI input first.');
    this.configure({ motif });
  }

  private async requestMidi(): Promise<void> {
    if (this.midiAccess) return;
    if (!navigator.requestMIDIAccess) throw new Error('Web MIDI is unavailable. Use browser audition or attach an AudioBus Peer.');
    this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    this.midiAccess.onstatechange = () => {
      if (this.midiPort?.state === 'disconnected') {
        this.stop('MIDI disconnected'); this.midiPort = undefined;
        this.setOutput(this.synth); this.refreshOutputs('internal');
      }
      if (this.midiInput?.state === 'disconnected') { this.listenTo(undefined); this.refreshInputs('none'); }
    };
  }
  private listenTo(port: MIDIInput | undefined): void {
    if (this.midiInput) this.midiInput.onmidimessage = null;
    this.midiInput = port; this.follower.reset();
    if (port) port.onmidimessage = event => { if (event.data) this.follower.receive(event.data); };
    const capture = this.view.getElementById('capture') as HTMLButtonElement | null;
    if (capture) capture.disabled = !port;
  }
  private followKey(root: number, mode: 'major' | 'minor'): void {
    if (root === this.state.root && mode === this.state.mode) return;
    this.configure({ root, mode });
    this.setText('input-label', `Following ${pitchName(root + 60).slice(0, -1)} ${mode}`);
  }
  private refreshInputs(selected: string): void {
    const el = this.view.querySelector<HTMLSelectElement>('[name=input]');
    if (!el) return;
    el.innerHTML = '<option value="none">Off</option><option value="request-midi-in">Connect MIDI input…</option>';
    for (const port of this.midiAccess?.inputs.values() ?? []) if (port.state === 'connected') el.add(new Option(port.name ?? 'MIDI input', port.id));
    el.value = selected;
    this.setText('input-label', selected === 'none' ? 'Play along: the composer follows your key.' : 'Listening for your key…');
  }

  private makeSession(): ComposerSession {
    const clock = this.hosted ? 'host' : 'internal';
    return new ComposerSession(this.state, this.output, {
      onPhrase: phrase => this.onPhrase(phrase),
      onRevise: phrase => this.onRevise(phrase),
      onStop: reason => { this.stopAnimation(); this.clearActiveNotes(); this.updateStatus(reason); this.emit(COMPOSER_STATE_CHANGE, { playing: false, reason }); },
      onEvent: record => this.onDispatch(record),
      onError: error => this.reportError(error),
    }, { clock, lookaheadMs: this.hosted ? 0 : 60 });
  }
  private onPhrase(phrase: Phrase): void {
    this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: phrase.options, length: phrase.length, phrases: [phrase], events: phrase.events };
    this.events = new Map(phrase.events.map(e => [e.id, e]));
    this.lastBarDrawn = -1;
    this.renderScore(); this.syncControls(); this.updateStatus(); this.ensureAnimation();
    this.emit(COMPOSER_PHRASE, structuredClone(phrase));
    this.emit(COMPOSER_STATE_CHANGE, { playing: true, phrase: phrase.index });
  }
  /** Energy, swing or ensemble changed: the rest of this phrase was recomposed from the next bar. */
  private onRevise(phrase: Phrase): void {
    this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: phrase.options, length: phrase.length, phrases: [phrase], events: phrase.events };
    this.renderScore(); this.updateAppliedMessage();
    this.emit(COMPOSER_PHRASE, structuredClone(phrase));
  }
  private onDispatch(record: DispatchRecord): void {
    const event = this.events.get(record.eventId);
    const kind = record.bytes[0] & 240;
    const isOn = kind === 144 && (record.bytes[2] ?? 0) > 0;
    if (this.ready && event) {
      const node = this.view.querySelector<SVGElement>(`[data-event-id="${CSS.escape(record.eventId)}"]`);
      if (node) node.classList.toggle('active', isOn);
      if (isOn) {
        this.setText('reason', `${titleCase(event.part)} · ${pitchName(event.pitch)} — ${event.reason}`);
      }
    }
    this.emit(COMPOSER_NOTE, record);
  }
  private clearActiveNotes(): void {
    if (!this.ready) return;
    this.view.querySelectorAll('.note.active').forEach(el => el.classList.remove('active'));
    const playhead = this.view.getElementById('playhead');
    if (playhead) playhead.style.display = 'none';
    const progress = this.view.getElementById('phrase-progress-fill');
    if (progress) progress.style.width = '0%';
    this.view.querySelectorAll<HTMLElement>('[data-bar].current').forEach(el => el.classList.remove('current'));
    this.lastBarDrawn = -1;
  }
  private ensureAnimation(): void {
    if (!this.ready || !this.playing || this.frame !== undefined) return;
    this.frame = requestAnimationFrame(this.drawFrame);
  }
  private stopAnimation(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
  }
  private emit(name: string, detail: unknown): void { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
  private setText(id: string, value: string): void { const el = this.view.getElementById(id); if (el) el.textContent = value; }
  private reportError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.setText('applied', message); this.view.getElementById('applied')?.classList.add('error');
    this.emit(COMPOSER_ERROR, { message });
  }
  private updateStatus(reason?: string): void {
    if (!this.ready) return;
    this.view.getElementById('applied')?.classList.remove('error');
    const live = this.view.querySelector<HTMLElement>('.live')!;
    live.dataset.playing = String(this.playing);
    this.setText('live-label', this.playing ? 'Composing live' : 'Ready to compose');
    (this.view.getElementById('start') as HTMLButtonElement).disabled = this.playing;
    (this.view.getElementById('stop') as HTMLButtonElement).disabled = !this.playing;
    (this.view.getElementById('finish') as HTMLButtonElement).disabled = !this.playing;
    if (!this.playing) this.setText('applied', reason === 'suspended' ? 'Playback paused after a timing interruption. Start to begin a fresh phrase.' : 'Ready. Start composing, then steer the next phrase with emotion and energy.');
    this.setText('output-label', this.output.label ?? 'Custom output');
  }
  private syncControls(): void {
    if (!this.ready) return;
    const tempo = this.view.querySelector<HTMLInputElement>('[name="tempo"]');
    if (tempo) { tempo.disabled = this.hosted; tempo.title = this.hosted ? 'Tempo follows the host transport' : ''; }
    const tap = this.view.getElementById('tap') as HTMLButtonElement | null;
    if (tap) tap.disabled = this.hosted;
    this.setText('tempo-value', `${this.state.tempo} BPM`);
    for (const key of ['emotion', 'intensity', 'energy', 'tempo', 'root', 'mode', 'algorithm', 'genre', 'seed', 'swing'] as const) {
      const el = this.view.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${key}"]`);
      if (el) el.value = String(this.state[key]);
    }
    this.view.querySelectorAll<HTMLInputElement>('input[data-part]').forEach(el => { el.checked = this.state.parts.includes(el.dataset.part as typeof PARTS[number]); });
    const programs = this.view.querySelector<HTMLInputElement>('[name="programs"]');
    if (programs) programs.checked = this.state.programs;
    const profile = EMOTIONS[this.state.emotion], level = clamp(Math.ceil(this.state.intensity * 3) - 1, 0, 2);
    this.view.querySelector<HTMLElement>('.instrument')?.style.setProperty('--emotion-accent', profile.colour);
    this.setText('emotion-label', profile.labels[level]); this.setText('family-label', titleCase(this.state.emotion));
    this.setText('intensity-value', `${Math.round(this.state.intensity * 100)}%`);
    this.setText('energy-value', `${Math.round(this.state.energy * 100)}`);
    this.setText('swing-value', `${Math.round(this.state.swing * 100)}%`);
    let tabAssigned = false;
    this.view.querySelectorAll<SVGPathElement>('path[data-family]').forEach(path => {
      const selected = path.dataset.family === this.state.emotion && Math.abs(Number(path.dataset.strength) - (level + 1) / 3) < .01;
      path.setAttribute('aria-pressed', String(selected));
      path.setAttribute('tabindex', selected && !tabAssigned ? '0' : '-1');
      if (selected) tabAssigned = true;
    });
    this.updateAppliedMessage();
  }
  private updateAppliedMessage(): void {
    if (!this.ready || !this.playing) return;
    const applied = this.session.applied, pending = this.session.pending;
    const barsLeft = Math.max(1, 8 - Math.floor(this.session.beat / 4));
    const now = `${GENRE_PROFILES[applied.genre].label} · ${titleCase(applied.emotion)} · ${Math.round(applied.energy * 100)} energy · ${applied.tempo} BPM`;
    this.setText('applied', pending.phrase
      ? `Selected changes apply next phrase (in ${barsLeft} ${barsLeft === 1 ? 'bar' : 'bars'}). Now: ${now}.`
      : pending.bar
        ? `Energy, swing and ensemble enter at the next bar. Now: ${now}.`
        : `Applied: ${now}. Energy enters at the next bar; other changes at the eight-bar boundary.`);
  }
  private onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (['energy', 'intensity', 'swing'].includes(input.name)) this.configure({ [input.name]: Number(input.value) });
    if (input.name === 'volume') { this.synth.volume = Number(input.value); return; }
    // The slider applies on release; show the value while dragging.
    if (input.name === 'tempo') this.setText('tempo-value', `${input.value} BPM`);
  }
  private async onChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    try {
      if (input.name === 'programs') this.configure({ programs: (input as HTMLInputElement).checked });
      else if (input.name === 'genre') {
        // A genre suggests its usual tempo, unless the host owns tempo.
        const genre = input.value as Genre;
        this.configure(this.hosted ? { genre } : { genre, tempo: genreTempo(genre) });
      } else if (input.dataset.part) this.configure({ parts: [...this.view.querySelectorAll<HTMLInputElement>('input[data-part]:checked')].map(el => el.dataset.part as typeof PARTS[number]) });
      else if (input.name === 'input') {
        if (input.value === 'request-midi-in') await this.connectMidiInput();
        else if (input.value === 'none') { this.listenTo(undefined); this.refreshInputs('none'); }
        else {
          const port = this.midiAccess?.inputs.get(input.value);
          if (!port || port.state !== 'connected') throw new Error('MIDI input is disconnected');
          this.listenTo(port); this.refreshInputs(port.id);
        }
      } else if (input.name === 'output') {
        if (input.value === 'request-midi') await this.connectMidi();
        else if (input.value === 'internal') { this.midiPort = undefined; this.setOutput(this.synth); }
        else if (input.value === 'silent') { this.midiPort = undefined; this.setOutput({ label: 'Events only', send: () => {} }); }
        else if (input.value === 'peer' && this.peerValue) { this.midiPort = undefined; this.setOutput(audioBusOutput(this.peerValue)); }
        else {
          const port = this.midiAccess?.outputs.get(input.value);
          if (!port || port.state !== 'connected') throw new Error('MIDI output is disconnected');
          this.midiPort = port; this.setOutput(webMidiOutput(port));
        }
      } else if (['seed', 'emotion', 'tempo', 'root', 'mode', 'algorithm'].includes(input.name)) {
        if (this.hosted && input.name === 'tempo') { this.syncControls(); return; }
        this.configure({ [input.name]: ['tempo', 'root'].includes(input.name) ? Number(input.value) : input.value });
      }
    } catch (e) {
      this.syncControls();
      if (input.name === 'output') { this.midiPort = undefined; this.setOutput(this.synth); this.refreshOutputs('internal'); }
      if (input.name === 'input') { this.listenTo(undefined); this.refreshInputs('none'); }
      this.reportError(e);
    }
  }
  private onClick(event: Event): void {
    const target = event.target as Element;
    const path = target.closest<SVGPathElement>('path[data-family]');
    if (path) { this.selectPath(path); return; }
    const button = target.closest('button');
    if (!button) return;
    switch (button.id) {
      case 'start': void this.start(); break;
      case 'stop': this.stop(); break;
      case 'finish': this.finish(); break;
      case 'reroll': this.configure({ seed: `theme-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`, motif: undefined }); break;
      case 'tap': this.tapTempo(); break;
      case 'capture': try { this.usePlayedTheme(); } catch (e) { this.reportError(e); } break;
      case 'midi': this.download(scoreToMidi(this.scoreValue), 'composition.mid', 'audio/midi'); break;
      case 'json': this.download(JSON.stringify(this.scoreValue, null, 2), 'composition.json', 'application/json'); break;
      case 'recording': this.download(JSON.stringify(this.recording, null, 2), 'performance.json', 'application/json'); break;
    }
  }
  /** Tap tempo: the mean of the last few intervals, restarting after a two-second pause. */
  private tapTempo(): void {
    if (this.hosted) return;
    const now = performance.now();
    if (this.taps.length && now - this.taps[this.taps.length - 1] > 2000) this.taps = [];
    this.taps.push(now);
    if (this.taps.length > 5) this.taps.shift();
    if (this.taps.length < 2) { this.setText('tempo-value', 'Tap again…'); return; }
    const interval = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1);
    this.configure({ tempo: clamp(Math.round(60000 / interval), 30, 240) });
  }
  private selectPath(path: SVGPathElement): void {
    this.configure({ emotion: path.dataset.family as EmotionFamily, intensity: Number(path.dataset.strength) });
  }
  private onKeyDown(event: KeyboardEvent): void {
    const target = event.target as Element;
    const path = target.closest<SVGPathElement>('path[data-family]');
    if (path) {
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); this.selectPath(path); return; }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const family = FAMILIES[mod(FAMILIES.indexOf(this.state.emotion) + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0), 8)];
      const level = clamp(Math.ceil(this.state.intensity * 3) + (event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0), 1, 3);
      this.configure({ emotion: family, intensity: level / 3 });
      this.view.querySelector<SVGPathElement>('path[tabindex="0"]')?.focus();
      return;
    }
    if (!this.hosted && (event.key === 't' || event.key === 'T') && !event.ctrlKey && !event.metaKey && !event.altKey && !target.closest('input[type=text], input[type=number], select, textarea')) {
      this.tapTempo(); return;
    }
    if (!this.hosted && event.key === ' ' && !target.closest('input, select, button, textarea')) {
      event.preventDefault();
      if (this.playing) this.stop(); else void this.start();
    }
  }
  private refreshOutputs(selected: string): void {
    const el = this.view.querySelector<HTMLSelectElement>('[name=output]');
    if (!el) return;
    el.innerHTML = '<option value="internal">Browser audition</option><option value="silent">Events only</option><option value="request-midi">Connect MIDI output…</option>';
    if (this.peerValue) el.add(new Option('AudioBus Peer', 'peer'));
    for (const port of this.midiAccess?.outputs.values() ?? []) if (port.state === 'connected') el.add(new Option(port.name ?? 'MIDI output', port.id));
    el.value = selected;
  }
  private renderScore(): void {
    if (!this.ready) return;
    const phrase = this.scoreValue.phrases[0];
    this.events = new Map(this.scoreValue.events.map(e => [e.id, e]));
    this.setText('section-label', `${this.playing ? 'Live' : 'Preview'} / ${phrase.section}`);
    this.setText('score-title', 'A phrase with somewhere to go.');
    this.setText('score-meta', `${GENRE_PROFILES[phrase.genre].label} · ${this.scoreValue.options.tempo} BPM · ${MODE_LABELS[phrase.mode]} · ${phrase.cadence} cadence · ${this.scoreValue.events.length} events${this.scoreValue.length > 32 ? ' · showing first 8 bars' : ''}`);
    const width = 960, left = 37, inner = width - left, height = 200;
    const visible = phrase.events.filter(e => e.start < phrase.start + 32);
    const melodic = visible.filter(e => e.part !== 'percussion');
    const drums = visible.filter(e => e.part === 'percussion');
    const width32 = (e: { start: number; duration: number }) => Math.min(e.duration, phrase.start + 32 - e.start) / 32 * inner;
    const low = Math.min(36, ...melodic.map(e => e.pitch)), high = Math.max(84, ...melodic.map(e => e.pitch));
    const y = (pitch: number) => 18 + (high - pitch) / (high - low) * 126;
    let svg = `<svg class="roll" viewBox="0 0 ${width} ${height}" role="img" aria-label="Eight-bar piano roll: melody, bass, harmony and percussion. Chord functions are listed below.">`;
    for (let p = low; p <= high; p++) if (p % 12 === 0) svg += `<line class="minor-grid" x1="${left}" x2="${width}" y1="${y(p)}" y2="${y(p)}"/><text x="4" y="${y(p) + 3}">C${p / 12 - 1}</text>`;
    svg += `<line class="drum-sep" x1="${left}" x2="${width}" y1="154" y2="154"/><text x="4" y="170">DR</text>`;
    for (let b = 0; b <= 32; b++) { const x = left + b / 32 * inner; svg += `<line class="${b % 4 ? 'minor-grid' : 'grid-line'}" x1="${x}" x2="${x}" y1="14" y2="182"/>`; if (b % 4 === 0 && b < 32) svg += `<text x="${x + 5}" y="195">${b / 4 + 1}</text>`; }
    for (const e of melodic) svg += `<rect class="note" data-event-id="${e.id}" x="${left + (e.start - phrase.start) / 32 * inner}" y="${y(e.pitch) - 2}" width="${Math.max(2, width32(e))}" height="4" rx="1.5" fill="${COLOURS[e.part]}" opacity="${.5 + e.velocity * .5}"/>`;
    for (const d of drums) {
      const dx = left + (d.start - phrase.start) / 32 * inner;
      const dy = d.pitch === 36 ? 176 : d.pitch >= 37 && d.pitch <= 40 ? 168 : 161;
      svg += `<circle class="note" data-event-id="${d.id}" cx="${dx}" cy="${dy}" r="${d.pitch === 36 ? 2.6 : 1.9}" fill="${COLOURS.percussion}" opacity="${.45 + d.velocity * .55}"/>`;
    }
    svg += `<line id="playhead" class="playhead" x1="${left}" x2="${left}" y1="12" y2="184"/></svg>`;
    this.view.getElementById('roll')!.innerHTML = svg;
    this.view.getElementById('chords')!.innerHTML = phrase.bars.map((bar, i) =>
      `<div class="chord ${bar.function.endsWith('cadence') || bar.function === 'modulation' ? 'cadence' : ''}" data-bar="${i}"><div class="chord-top"><span class="number">${String(i + 1).padStart(2, '0')}</span><span class="roman">${bar.roman ?? ''}</span></div><strong>${bar.chord}</strong><small>${bar.function}</small><div class="tension-bar" title="Tension ${Math.round(bar.tension * 100)}% (target ${Math.round(bar.targetTension * 100)}%)"><div class="tension-fill" style="width:${Math.round(bar.tension * 100)}%"></div><div class="tension-target" style="left:${Math.round(bar.targetTension * 100)}%"></div></div></div>`
    ).join('');
    this.setText('reason', `${GENRE_PROFILES[phrase.genre].label} idiom; ${ALGORITHM_LABELS[this.scoreValue.options.algorithm].toLowerCase()} proposes melodies, and the one closest to the emotion’s tension curve is kept.`);
  }
  private drawFrame = (): void => {
    this.frame = undefined;
    if (!this.ready || !this.playing) return;
    const beat = this.session.beat;
    const playhead = this.view.getElementById('playhead');
    if (playhead) {
      playhead.style.display = 'block';
      const x = String(37 + Math.min(32, beat) / 32 * 923);
      playhead.setAttribute('x1', x); playhead.setAttribute('x2', x);
    }
    const progress = this.view.getElementById('phrase-progress-fill');
    if (progress) progress.style.width = `${clamp(beat / 32 * 100, 0, 100).toFixed(1)}%`;
    const currentBar = clamp(Math.floor(beat / 4), 0, 7);
    if (currentBar !== this.lastBarDrawn) {
      this.lastBarDrawn = currentBar;
      this.setText('bar-pill', `Bar ${currentBar + 1} / 8`);
      this.view.querySelectorAll<HTMLElement>('[data-bar]').forEach(el => el.classList.toggle('current', Number(el.dataset.bar) === currentBar));
      this.updateAppliedMessage();
    }
    this.frame = requestAnimationFrame(this.drawFrame);
  };
  private download(data: string | Uint8Array, name: string, type: string): void {
    const blob = new Blob([typeof data === 'string' ? data : new Uint8Array(data)], { type });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  private template(): string {
    return `<style>${STYLES}${STAR_STYLES}</style><section class="instrument" aria-label="Autonomous music composer">
      <div class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true"></span>AudioBus / Composer</div><div class="live" data-playing="false"><span class="bar-pill" id="bar-pill">Bar 1 / 8</span><span class="dot"></span><span id="live-label">Ready to compose</span></div></div>
      <div class="workspace"><section class="expression" aria-labelledby="expression-title">
        <div class="section-heading"><div><div class="eyebrow">01 / Expression</div><h2 id="expression-title">Give the music a feeling.</h2></div></div>
        <div class="wheel-wrap">${STAR_ART}</div>
        <p class="sr-only">Select an emotion on the star. Left and right arrows change family; up and down change intensity. Equivalent controls follow.</p>
        <div class="wheel-description" aria-live="polite"><div class="selected-label" id="emotion-label">Joy</div><div class="selection-meta"><span class="family" id="family-label">Joy</span> family · intensity <span id="intensity-value">67%</span></div></div>
        <div class="emotion-alternatives"><label class="field">Emotion family<select name="emotion">${FAMILIES.map(f => `<option value="${f}">${titleCase(f)}</option>`).join('')}</select></label><label class="field"><span class="range-label">Intensity</span><input name="intensity" type="range" min="0" max="1" step="0.01" aria-label="Emotion intensity"></label></div>
      </section><section class="controls" aria-labelledby="direction-title">
        <div><div class="eyebrow">02 / Direction</div><h2 id="direction-title">Let a theme find its way.</h2><div class="hint">Rules shape the phrase. You shape its character.</div></div>
        <label class="field"><span class="range-label"><span>Energy</span><output class="energy-value" id="energy-value">50</output></span><input name="energy" aria-label="Energy" type="range" min="0" max="1" step="0.01"><span class="range-ends"><span>Spacious</span><span>Active</span></span></label>
        <div class="control-grid"><label class="field">Genre<select name="genre">${GENRES.map(g => `<option value="${g}">${GENRE_PROFILES[g].label}</option>`).join('')}</select></label><label class="field">Generator<select name="algorithm">${ALGORITHMS.map(a => `<option value="${a}">${ALGORITHM_LABELS[a]}</option>`).join('')}</select></label><label class="field"><span class="range-label"><span>Tempo</span><output id="tempo-value">104 BPM</output></span><div class="seed-row tempo-row"><input name="tempo" type="range" min="30" max="240" step="1" aria-label="Tempo / BPM"><button id="tap" title="Tap the beat to set the tempo (or press T)">Tap</button></div></label><label class="field">Tonic<select name="root">${Array.from({ length: 12 }, (_, i) => `<option value="${i}">${pitchName(i + 60).slice(0, -1)}</option>`).join('')}</select></label><label class="field">Harmonic colour<select name="mode">${(Object.keys(MODE_LABELS) as Mode[]).map(m => `<option value="${m}">${MODE_LABELS[m]}</option>`).join('')}</select></label></div>
        <div class="control-grid"><label class="field">Theme seed<div class="seed-row"><input name="seed" type="text" maxlength="128" spellcheck="false"><button id="reroll" aria-label="Create a new theme" title="Create a new theme">↻</button></div></label><label class="field"><span class="range-label">Swing <output id="swing-value">0%</output></span><input name="swing" type="range" min="0" max="0.45" step="0.01" aria-label="Swing"></label></div>
        <div class="field"><span class="field-label" id="parts-label">Ensemble</span><div class="parts" role="group" aria-labelledby="parts-label">${PARTS.map(p => `<label class="part"><input type="checkbox" data-part="${p}" checked>${titleCase(p)}</label>`).join('')}<label class="part" title="Send General MIDI Program Change messages for the genre’s instruments"><input type="checkbox" name="programs">Instrument changes</label></div></div>
        <div><div class="transport-buttons"><button class="primary" id="start">▶ Start composing</button><button id="finish" disabled>Finish phrase</button><button class="danger" id="stop" disabled>Stop</button></div><div class="applied-wrap"><div class="phrase-progress" aria-hidden="true"><div class="phrase-progress-fill" id="phrase-progress-fill"></div></div><p class="applied" id="applied" role="status">Ready. Start composing, then steer the next phrase.</p></div></div>
        <div class="output-row"><label class="field">Output<select name="output"><option value="internal">Browser audition</option><option value="silent">Events only</option><option value="request-midi">Connect MIDI output…</option></select></label><label class="field volume-field">Audition volume<input name="volume" type="range" min="0" max="1" step="0.01" value="0.35" aria-label="Audition volume"></label></div>
        <div class="input-row"><label class="field">Follow MIDI input<select name="input"><option value="none">Off</option><option value="request-midi-in">Connect MIDI input…</option></select><span class="hint" id="input-label">Play along: the composer follows your key.</span></label><button id="capture" disabled title="Use the last notes you played as the theme">Use played theme</button></div>
      </section></div>
      <section class="score-section" aria-labelledby="score-title"><div class="score-header"><div><div class="eyebrow" id="section-label">Preview / Establish</div><h2 id="score-title">A phrase with somewhere to go.</h2></div><div class="score-meta" id="score-meta"></div></div><div class="roll-scroll" id="roll"></div><div class="chords" id="chords"></div><div class="legend">${(['melody', 'bass', 'harmony'] as const).map(p => `<span style="--swatch:${COLOURS[p]}">${titleCase(p)}</span>`).join('')}<span style="--swatch:#e8b780">Percussion on channel 10</span></div></section>
      <div class="lower"><section class="notes"><div class="eyebrow">Inside the decision</div><p class="reason" id="reason"></p></section><section class="exports"><div class="eyebrow">Keep the music</div><div class="buttons"><button id="midi">Export MIDI</button><button id="json">Save score</button><button id="recording">Save performance log</button></div><p class="hint">Score exports contain the displayed plan. The performance log records phrase snapshots and actual dispatches.</p></section></div>
      <div class="footer"><span>Symbolic music · seeded decisions · 4/4 phrases · v${GENERATOR_VERSION}</span><span id="output-label">Browser audition</span></div>
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'audiobus-composer': AudioBusComposer }
}
