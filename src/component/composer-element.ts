import { ALGORITHMS, ALGORITHM_COMBINERS, FAMILIES, GENRES, GENRE_MIX_MODES, GROOVES, PARTS, PERFORMANCE_CUES, TUNINGS, type Algorithm, type AlgorithmCombiner, type ComposerOptions, type DispatchRecord, type EmotionFamily, type Genre, type GenreMixMode, type GroovePreset, type MidiOutputAdapter, type MidiSink, type Mode, type PerformanceCue, type Phrase, type Score, type Tuning } from '../types.js';
import { GENRE_PROFILES, genreTempo } from '../genres.js';
import { TUNING_PROFILES } from '../tuning.js';
import { GENERATOR_VERSION } from '../version.js';
import { compose, composePhrase, DEFAULT_OPTIONS, normalizeOptions, phraseKey, pitchName } from '../composer.js';
import { EMOTIONS, NOTE_NAMES, clamp, mod } from '../theory.js';
import { EmotionFollower, emotionLabel, intensityTier, type EmotionStep } from '../emotion-follower.js';
import { audioBusOutput, scoreToMidi, webMidiOutput } from '../midi.js';
import { ComposerSession, type PerformanceRecord } from '../session.js';
import { MidiFollower } from '../input.js';
import { PLUTCHIK_ART } from './plutchik-art.js';
import { STYLES } from './styles.js';
import { PreviewSynth } from './preview-synth.js';
import { COMPOSER_CONTROL_CHANGE, COMPOSER_CUE, COMPOSER_ERROR, COMPOSER_NOTE, COMPOSER_PHRASE, COMPOSER_STATE_CHANGE } from '../events.js';

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const CUE_LABELS: Record<PerformanceCue, string> = {
  crescendo: 'Crescendo', breakdown: 'Breakdown', bridge: 'Bridge', drop: 'Drop', 'key-change': 'Key change', resolve: 'Resolve',
};
const ALGORITHM_LABELS: Record<typeof ALGORITHMS[number], string> = {
  motif: 'Motif development', markov: 'Markov memory', life: 'Game of Life', evolution: 'Evolutionary search',
  grammar: 'L-system grammar', euclidean: 'Euclidean patterns', torus: 'Tonnetz torus walk',
};
const MODE_LABELS: Record<Mode, string> = {
  auto: 'Follow emotion', major: 'Major', minor: 'Minor', dorian: 'Dorian', mixolydian: 'Mixolydian',
  lydian: 'Lydian', phrygian: 'Phrygian', 'harmonic-minor': 'Harmonic minor', locrian: 'Locrian',
};
const GROOVE_LABELS: Record<GroovePreset, string> = {
  auto: 'Style default', straight: 'Straight', swung: 'Swung', pocket: 'Laid-back pocket',
  shuffled: '16th shuffle', halftime: 'Half-time', doubletime: 'Double-time',
  syncopated: 'Syncopated', polyrhythm: 'Polyrhythm', human: 'Humanised',
};
const GENRE_MIX_LABELS: Record<GenreMixMode, string> = {
  blend: 'Continuous blend', 'rhythm-swap': 'Swap rhythm & bass', 'harmony-swap': 'Swap harmony & comp',
  alternate: 'Alternate phrases', split: 'Split band',
};
const ALGO_COMBINE_LABELS: Record<AlgorithmCombiner, string> = {
  pipeline: 'Pipeline (A → B)', split: 'Pitch × Rhythm', alternate: 'Call & response',
  blend: 'Weighted blend', counterpoint: 'Interlocking counterpoint',
};
const COLOURS = { melody: '#d0e9aa', bass: '#88abd9', harmony: '#b9a0d9', percussion: '#e8b780' };
// Keep presentation CSS in the shadow stylesheet rather than an SVG raw-text element.
// This also lets HTML fragment parsers mount the entire panel consistently.
const STAR_STYLES = PLUTCHIK_ART.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const STAR_ART = PLUTCHIK_ART.replace(/<style>[\s\S]*?<\/style>/, '');

/** A dependency-free, Shadow DOM instrument. Import the component entry to register it. */
export class AudioBusComposer extends HTMLElement {
  static observedAttributes = ['seed', 'emotion', 'energy', 'intensity', 'tempo', 'root', 'mode', 'algorithm', 'genre', 'swing', 'tuning', 'groove', 'dynamics', 'host-clock'];
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
  private emotionFollower = new EmotionFollower({ emotion: this.state.emotion, intensity: this.state.intensity });
  private previewPath: EmotionStep[] = [];

  get options(): ComposerOptions { return normalizeOptions(this.state); }
  set options(value: Partial<ComposerOptions>) { this.configure(value); }
  get score(): Score { return structuredClone(this.scoreValue); }
  get recording(): PerformanceRecord { return this.session.recording; }
  get playing(): boolean { return this.session.running; }
  get queuedCue(): PerformanceCue | undefined { return this.session.queuedCue; }
  get activeCue(): PerformanceCue | undefined { return this.session.activeCue; }
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
    this.refreshOutputs('internal'); this.refreshInputs('none'); this.syncControls(); this.renderScore(); this.updateStatus();
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
    const next = value === null ? fallback : ['energy', 'intensity', 'tempo', 'root', 'swing', 'dynamics'].includes(name) ? Number(value) : value;
    try { this.configure({ [name]: next }); } catch (e) { this.reportError(e); }
  }

  configure(patch: Partial<ComposerOptions>): void {
    const prevEmotion = this.state.emotion, prevIntensity = this.state.intensity;
    this.state = normalizeOptions({ ...this.state, ...patch });
    this.session.update(this.state);
    this.synth.setTuning(this.state.tuning ?? 'equal', this.state.root);
    const emotionChanged = this.state.emotion !== prevEmotion || Math.abs(this.state.intensity - prevIntensity) > 1e-6;
    if (!this.playing) {
      if (emotionChanged) {
        this.emotionFollower.setCurrent({ emotion: prevEmotion, intensity: prevIntensity });
        this.emotionFollower.guideTo({ emotion: this.state.emotion, intensity: this.state.intensity });
        this.previewPath = this.emotionFollower.takeForBars(8);
      }
      this.renderPreview();
    }
    this.syncControls();
    this.emit(COMPOSER_CONTROL_CHANGE, { selected: this.options, applied: this.playing ? this.session.applied : null, pending: this.playing });
  }
  /** Arm or clear a next-bar performance change; previews the change when stopped. */
  cue(kind: PerformanceCue | null): void {
    this.session.cue(kind);
    if (!this.playing) this.renderPreview();
    this.syncPerformance();
    this.updateAppliedMessage();
    this.emit(COMPOSER_CUE, {
      cue: kind,
      queued: this.queuedCue ?? null,
      active: this.activeCue ?? null,
      target: this.session.nextBarTarget,
    });
  }
  clearCue(): void { this.cue(null); }
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
  /** Play from the start of a bar of the shown phrase, starting playback if it is stopped. Not available on a host clock. */
  async playFrom(bar: number): Promise<void> {
    if (this.hosted) return;
    if (!this.playing) await this.start();
    const maxBar = Math.max(0, this.scoreValue.phrases[0].bars.length - 1);
    if (this.playing) { this.session.seek(clamp(Math.floor(bar), 0, maxBar)); this.ensureAnimation(); }
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
    const prev = this.state;
    this.state = this.session.options;
    this.synth.setTuning(phrase.options.tuning ?? 'equal', phrase.root);
    this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: phrase.options, length: phrase.length, phrases: [phrase], events: phrase.events };
    this.events = new Map(phrase.events.map(e => [e.id, e]));
    this.lastBarDrawn = -1;
    this.renderScore(); this.syncControls(); this.updateStatus(); this.ensureAnimation();
    if (prev.root !== this.state.root || prev.energy !== this.state.energy) {
      this.emit(COMPOSER_CONTROL_CHANGE, { selected: this.options, applied: this.session.applied, pending: false });
    }
    if (phrase.cue) {
      this.emit(COMPOSER_CUE, { cue: phrase.cue, queued: this.queuedCue ?? null, active: phrase.cue, target: this.session.nextBarTarget });
    }
    this.emit(COMPOSER_PHRASE, structuredClone(phrase));
    this.emit(COMPOSER_STATE_CHANGE, { playing: true, phrase: phrase.index });
  }
  /** Energy, swing, ensemble or performance cue changed: the rest of this phrase was recomposed from the next bar. */
  private onRevise(phrase: Phrase): void {
    const prev = this.state;
    this.state = this.session.options;
    this.synth.setTuning(phrase.options.tuning ?? 'equal', phrase.root);
    this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: phrase.options, length: phrase.length, phrases: [phrase], events: phrase.events };
    this.renderScore(); this.syncControls(); this.updateAppliedMessage();
    if (prev.root !== this.state.root || prev.energy !== this.state.energy) {
      this.emit(COMPOSER_CONTROL_CHANGE, { selected: this.options, applied: this.session.applied, pending: false });
    }
    if (phrase.cue) {
      this.emit(COMPOSER_CUE, { cue: phrase.cue, queued: this.queuedCue ?? null, active: phrase.cue, target: this.session.nextBarTarget });
    }
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
    this.view.querySelectorAll<HTMLElement>('[data-bar].current').forEach(el => { el.classList.remove('current'); el.removeAttribute('aria-current'); });
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
    this.syncPerformance();
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
    const tuningEl = this.view.querySelector<HTMLSelectElement>('[name="tuning"]');
    if (tuningEl) tuningEl.value = this.state.tuning ?? 'equal';
    const grooveEl = this.view.querySelector<HTMLSelectElement>('[name="groove"]');
    if (grooveEl) grooveEl.value = this.state.groove ?? 'auto';
    const dynEl = this.view.querySelector<HTMLInputElement>('[name="dynamics"]');
    if (dynEl) dynEl.value = String(this.state.dynamics ?? 0);
    this.setText('dynamics-value', `${Math.round((this.state.dynamics ?? 0) * 100)}%`);
    const mixGenreEl = this.view.querySelector<HTMLSelectElement>('[name="mix-genre"]');
    if (mixGenreEl) mixGenreEl.value = this.state.genreMix?.genre ?? 'none';
    const mixModeEl = this.view.querySelector<HTMLSelectElement>('[name="mix-mode"]');
    if (mixModeEl) { mixModeEl.value = this.state.genreMix?.mode ?? 'blend'; mixModeEl.disabled = !this.state.genreMix; }
    const mixAmountEl = this.view.querySelector<HTMLInputElement>('[name="mix-amount"]');
    const mixAmt = this.state.genreMix?.amount ?? .5;
    if (mixAmountEl) { mixAmountEl.value = String(mixAmt); mixAmountEl.disabled = !this.state.genreMix; }
    this.setText('mix-amount-value', `${Math.round(mixAmt * 100)}%`);
    const mixAlgoEl = this.view.querySelector<HTMLSelectElement>('[name="mix-algorithm"]');
    if (mixAlgoEl) mixAlgoEl.value = this.state.algorithmMix?.secondary ?? 'none';
    const mixAlgoModeEl = this.view.querySelector<HTMLSelectElement>('[name="mix-algo-mode"]');
    if (mixAlgoModeEl) { mixAlgoModeEl.value = this.state.algorithmMix?.mode ?? 'pipeline'; mixAlgoModeEl.disabled = !this.state.algorithmMix; }
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
    const displayPath = this.playing
      ? (this.session.plannedEmotionPath.length ? this.session.plannedEmotionPath : this.session.emotionPath)
      : this.previewPath;
    const pathKeys = new Set(displayPath.filter(s => !s.arrival).map(s => `${s.emotion}:${s.tier}`));
    const sounding = this.playing ? this.session.currentEmotion : undefined;
    const soundingTier = sounding ? intensityTier(sounding.intensity) : 0;
    this.view.querySelectorAll<SVGPathElement>('path[data-family]').forEach(path => {
      const strength = Number(path.dataset.strength);
      const tier = intensityTier(strength);
      const selected = path.dataset.family === this.state.emotion && Math.abs(strength - (level + 1) / 3) < .01;
      const inPath = pathKeys.has(`${path.dataset.family}:${tier}`);
      const isSounding = !!sounding && path.dataset.family === sounding.emotion && tier === soundingTier && !selected;
      path.setAttribute('aria-pressed', String(selected));
      path.setAttribute('tabindex', selected && !tabAssigned ? '0' : '-1');
      path.classList.toggle('path-step', inPath);
      path.classList.toggle('sounding', isSounding);
      if (selected) tabAssigned = true;
    });
    this.syncPerformance();
    this.updateAppliedMessage();
  }
  private syncPerformance(): void {
    if (!this.ready) return;
    const queued = this.queuedCue;
    const active = this.playing ? this.activeCue : undefined;
    const target = this.session.nextBarTarget;
    const profile = GENRE_PROFILES[this.state.genre];
    const bridgeName = profile.form.find(s => s.role === 'contrast')?.name ?? 'Bridge';
    const dropName = profile.form.find(s => s.role === 'return')?.name ?? 'Drop';
    const activeRoot = this.state.root;
    const hints: Record<PerformanceCue, string> = {
      crescendo: 'Swell & build',
      breakdown: 'Strip back',
      bridge: bridgeName === 'Bridge' ? 'Contrast shift' : `→ ${bridgeName}`,
      drop: dropName === 'Drop' ? 'Full band peak' : `→ ${dropName}`,
      'key-change': `${NOTE_NAMES[activeRoot]} → ${NOTE_NAMES[mod(activeRoot + 2, 12)]}`,
      resolve: 'Tonic cadence',
    };
    this.view.querySelectorAll<HTMLButtonElement>('.cue[data-cue]').forEach(btn => {
      const kind = btn.dataset.cue as PerformanceCue;
      const armed = queued === kind;
      const live = !armed && active === kind;
      btn.classList.toggle('armed', armed);
      btn.classList.toggle('active-cue', live);
      btn.setAttribute('aria-pressed', String(armed));
      const hint = btn.querySelector<HTMLElement>('[data-cue-hint]');
      if (hint) hint.textContent = hints[kind];
    });
    const clearBtn = this.view.getElementById('perf-clear') as HTMLButtonElement | null;
    if (clearBtn) clearBtn.hidden = !queued;
    this.setText('perf-target', this.playing ? (target.nextPhrase ? 'Next bar · Next phrase (Bar 1)' : `Next bar · Bar ${target.bar + 1}`) : 'Next bar · Bar 1');
    this.setText('perf-status', queued
      ? (this.playing ? `${CUE_LABELS[queued]} armed for ${target.nextPhrase ? 'next phrase' : `bar ${target.bar + 1}`}` : `${CUE_LABELS[queued]} armed for start`)
      : active
        ? `Active: ${CUE_LABELS[active]}`
        : 'Choose a change for the next bar');
    const barTarget = this.playing && !target.nextPhrase ? target.bar : -1;
    this.view.querySelectorAll<HTMLElement>('.chord[data-bar]').forEach(el => {
      const idx = Number(el.dataset.bar);
      const isNext = idx === barTarget;
      el.classList.toggle('next-bar', isNext);
      el.classList.toggle('cue-armed', isNext && !!queued);
      const badge = el.querySelector<HTMLElement>('.bar-cue');
      if (badge) badge.textContent = isNext ? (queued ? CUE_LABELS[queued] : 'Next') : '';
    });
  }
  private updateAppliedMessage(): void {
    if (!this.ready || !this.playing) return;
    const applied = this.session.applied, pending = this.session.pending;
    const totalBars = this.scoreValue.phrases[0]?.bars.length ?? 8;
    const barsLeft = Math.max(1, totalBars - Math.floor(this.session.beat / 4));
    const now = `${GENRE_PROFILES[applied.genre].label} · ${titleCase(applied.emotion)} · ${Math.round(applied.energy * 100)} energy · ${applied.tempo} BPM`;
    this.setText('applied', pending.phrase
      ? `Selected changes apply next phrase (in ${barsLeft} ${barsLeft === 1 ? 'bar' : 'bars'}). Now: ${now}.`
      : pending.bar
        ? `Energy, swing and ensemble enter at the next bar. Now: ${now}.`
        : pending.cue
          ? `${CUE_LABELS[pending.cue]} enters at the next bar. Now: ${now}.`
          : `Applied: ${now}. Energy enters at the next bar; other changes at the eight-bar boundary.`);
  }
  private onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (['energy', 'intensity', 'swing', 'dynamics'].includes(input.name)) this.configure({ [input.name]: Number(input.value) });
    if (input.name === 'mix-amount' && this.state.genreMix) {
      this.configure({ genreMix: { ...this.state.genreMix, amount: Number(input.value) } });
    }
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
      } else if (['seed', 'emotion', 'tempo', 'root', 'mode', 'algorithm', 'tuning', 'groove'].includes(input.name)) {
        if (this.hosted && input.name === 'tempo') { this.syncControls(); return; }
        this.configure({ [input.name]: ['tempo', 'root'].includes(input.name) ? Number(input.value) : input.value });
      } else if (input.name === 'mix-genre') {
        if (input.value === 'none') this.configure({ genreMix: undefined });
        else this.configure({ genreMix: { genre: input.value as Genre, mode: this.state.genreMix?.mode ?? 'blend', amount: this.state.genreMix?.amount ?? .5 } });
      } else if (input.name === 'mix-mode' && this.state.genreMix) {
        this.configure({ genreMix: { ...this.state.genreMix, mode: input.value as GenreMixMode } });
      } else if (input.name === 'mix-algorithm') {
        if (input.value === 'none') this.configure({ algorithmMix: undefined });
        else this.configure({ algorithmMix: { secondary: input.value as Algorithm, mode: this.state.algorithmMix?.mode ?? 'pipeline', weight: this.state.algorithmMix?.weight ?? .5 } });
      } else if (input.name === 'mix-algo-mode' && this.state.algorithmMix) {
        this.configure({ algorithmMix: { ...this.state.algorithmMix, mode: input.value as AlgorithmCombiner } });
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
    if (button.dataset.cue !== undefined) {
      const kind = button.dataset.cue as PerformanceCue;
      this.cue(this.queuedCue === kind ? null : kind);
      return;
    }
    if (button.dataset.bar !== undefined) { void this.playFrom(Number(button.dataset.bar)); return; }
    switch (button.id) {
      case 'start': void this.start(); break;
      case 'stop': this.stop(); break;
      case 'finish': this.finish(); break;
      case 'perf-clear': {
        const prev = this.queuedCue;
        this.clearCue();
        if (prev) this.view.querySelector<HTMLButtonElement>(`.cue[data-cue="${prev}"]`)?.focus();
        break;
      }
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
    const bar = target.closest<HTMLElement>('.chord[data-bar]');
    if (bar && this.moveBarFocus(bar, event.key)) { event.preventDefault(); return; }
    if (!event.ctrlKey && !event.metaKey && !event.altKey && !target.closest('input[type=text], input[type=number], select, textarea')) {
      if (/^[1-6]$/.test(event.key)) {
        event.preventDefault();
        const kind = PERFORMANCE_CUES[Number(event.key) - 1];
        this.cue(this.queuedCue === kind ? null : kind);
        return;
      }
      if (event.key === 'Escape' && this.queuedCue) {
        event.preventDefault();
        this.clearCue();
        return;
      }
    }
    if (!this.hosted && (event.key === 't' || event.key === 'T') && !event.ctrlKey && !event.metaKey && !event.altKey && !target.closest('input[type=text], input[type=number], select, textarea')) {
      this.tapTempo(); return;
    }
    if (!this.hosted && event.key === ' ' && !target.closest('input, select, button, textarea')) {
      event.preventDefault();
      if (this.playing) this.stop(); else void this.start();
    }
  }
  /** Arrow keys move between bars (up and down by a row of the grid); Home and End go to the first and last. */
  private moveBarFocus(from: HTMLElement, key: string): boolean {
    const bars = [...this.view.querySelectorAll<HTMLElement>('.chord[data-bar]')];
    const columns = getComputedStyle(from.parentElement!).gridTemplateColumns.split(' ').length;
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    const index = bars.indexOf(from);
    const next = key === 'Home' ? 0 : key === 'End' ? bars.length - 1 : key in steps ? clamp(index + steps[key], 0, bars.length - 1) : -1;
    if (next < 0) return false;
    bars.forEach((el, i) => el.tabIndex = i === next ? 0 : -1);
    bars[next].focus();
    return true;
  }
  private refreshOutputs(selected: string): void {
    const el = this.view.querySelector<HTMLSelectElement>('[name=output]');
    if (!el) return;
    el.innerHTML = '<option value="internal">Browser audition</option><option value="silent">Events only</option><option value="request-midi">Connect MIDI output…</option>';
    if (this.peerValue) el.add(new Option('AudioBus Peer', 'peer'));
    for (const port of this.midiAccess?.outputs.values() ?? []) if (port.state === 'connected') el.add(new Option(port.name ?? 'MIDI output', port.id));
    el.value = selected;
  }
  private renderPreview(): void {
    const queued = this.queuedCue;
    if (!queued) {
      if (this.previewPath.length) {
        const phrase = composePhrase(this.state, 0, 0, { final: true, emotionPath: this.previewPath });
        this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: this.state, length: phrase.length, phrases: [phrase], events: phrase.events };
      } else {
        this.scoreValue = compose(this.state);
      }
      this.renderScore();
      return;
    }
    let opts = this.state;
    let index = 0;
    if (queued === 'key-change') opts = normalizeOptions({ ...opts, root: mod(opts.root + 2, 12) });
    else if (queued === 'drop') opts = normalizeOptions({ ...opts, energy: clamp(Math.max(opts.energy + .18, .78), 0, 1) });
    else if (queued === 'crescendo') opts = normalizeOptions({ ...opts, energy: clamp(Math.max(opts.energy + .3, .8), 0, 1) });
    if (queued === 'bridge' || queued === 'drop') {
      const wantRole = queued === 'bridge' ? 'contrast' : 'return';
      const form = GENRE_PROFILES[opts.genre].form;
      const slot = form.findIndex(s => s.role === wantRole);
      if (slot >= 0) index = slot;
    }
    const phrase = composePhrase(opts, index, 0, {
      final: queued === 'resolve',
      cue: queued,
      cueFromBar: 0,
      ...(queued === 'crescendo' ? { cueStartEnergy: this.state.energy } : {}),
    });
    this.scoreValue = { schemaVersion: 1, generatorVersion: GENERATOR_VERSION, options: opts, length: phrase.length, phrases: [phrase], events: phrase.events };
    this.renderScore();
  }
  private renderScore(): void {
    if (!this.ready) return;
    const phrase = this.scoreValue.phrases[0];
    this.events = new Map(this.scoreValue.events.map(e => [e.id, e]));
    const barCount = phrase.bars.length;
    const displayBeats = Math.max(32, phrase.length);
    const cueSuffix = phrase.cue ? ` · ${CUE_LABELS[phrase.cue]}` : '';
    const genreLabel = phrase.options.genreMix ? `${GENRE_PROFILES[phrase.genre].label} × ${GENRE_PROFILES[phrase.options.genreMix.genre].label}` : GENRE_PROFILES[phrase.genre].label;
    const tuningSuffix = phrase.options.tuning ? ` · ${TUNING_PROFILES[phrase.options.tuning].label}` : '';
    const grooveSuffix = phrase.options.groove ? ` · ${GROOVE_LABELS[phrase.options.groove]}` : '';
    this.setText('score-meta', `${titleCase(phrase.section)} · ${genreLabel} · ${this.scoreValue.options.tempo} BPM · ${MODE_LABELS[phrase.mode]}${tuningSuffix}${grooveSuffix} · ${phrase.cadence} cadence${cueSuffix} · ${this.scoreValue.events.length} events${this.scoreValue.length > 32 ? ' · showing first 8 bars' : ''}`);
    const width = 960, left = 37, inner = width - left, height = 200;
    const visible = phrase.events.filter(e => e.start < phrase.start + displayBeats);
    const melodic = visible.filter(e => e.part !== 'percussion');
    const drums = visible.filter(e => e.part === 'percussion');
    const widthBeats = (e: { start: number; duration: number }) => Math.min(e.duration, phrase.start + displayBeats - e.start) / displayBeats * inner;
    const low = Math.min(36, ...melodic.map(e => e.pitch)), high = Math.max(84, ...melodic.map(e => e.pitch));
    const y = (pitch: number) => 18 + (high - pitch) / (high - low) * 126;
    let svg = `<svg class="roll" viewBox="0 0 ${width} ${height}" role="img" aria-label="Eight-bar piano roll: melody, bass, harmony and percussion. Chord functions are listed below.">`;
    for (let p = low; p <= high; p++) if (p % 12 === 0) svg += `<line class="minor-grid" x1="${left}" x2="${width}" y1="${y(p)}" y2="${y(p)}"/><text x="4" y="${y(p) + 3}">C${p / 12 - 1}</text>`;
    svg += `<line class="drum-sep" x1="${left}" x2="${width}" y1="154" y2="154"/><text x="4" y="170">DR</text>`;
    for (let b = 0; b <= displayBeats; b++) { const x = left + b / displayBeats * inner; svg += `<line class="${b % 4 ? 'minor-grid' : 'grid-line'}" x1="${x}" x2="${x}" y1="14" y2="182"/>`; if (b % 4 === 0 && b < displayBeats) svg += `<text x="${x + 5}" y="195">${b / 4 + 1}</text>`; }
    if (phrase.length < displayBeats) {
      const cutX = left + phrase.length / displayBeats * inner;
      svg += `<rect class="roll-cut" x="${cutX}" y="14" width="${width - cutX}" height="168"/><line class="cut-line" x1="${cutX}" x2="${cutX}" y1="12" y2="184"/>`;
    }
    for (const e of melodic) svg += `<rect class="note" data-event-id="${e.id}" x="${left + (e.start - phrase.start) / displayBeats * inner}" y="${y(e.pitch) - 2}" width="${Math.max(2, widthBeats(e))}" height="4" rx="1.5" fill="${COLOURS[e.part]}" opacity="${.5 + e.velocity * .5}"/>`;
    for (const d of drums) {
      const dx = left + (d.start - phrase.start) / displayBeats * inner;
      const dy = d.pitch === 36 ? 176 : d.pitch >= 37 && d.pitch <= 40 ? 168 : 161;
      svg += `<circle class="note" data-event-id="${d.id}" cx="${dx}" cy="${dy}" r="${d.pitch === 36 ? 2.6 : 1.9}" fill="${COLOURS.percussion}" opacity="${.45 + d.velocity * .55}"/>`;
    }
    svg += `<line id="playhead" class="playhead" x1="${left}" x2="${left}" y1="12" y2="184"/></svg>`;
    this.view.getElementById('roll')!.innerHTML = svg;
    // Rebuilding the bars must not lose keyboard focus while a phrase or revision arrives.
    const chords = this.view.getElementById('chords')!;
    const focused = (this.view.activeElement as HTMLElement | null)?.dataset.bar;
    const tabStop = clamp(Number(focused ?? (this.playing ? Math.max(0, this.lastBarDrawn) : 0)), 0, Math.max(0, barCount - 1));
    chords.innerHTML = phrase.bars.map((bar, i) => {
      const stepTag = bar.emotion
        ? `<span class="bar-emotion" style="--bar-emo:${EMOTIONS[bar.emotion].colour}">${emotionLabel(bar.emotion, bar.intensity ?? phrase.options.intensity)}</span>`
        : '';
      return `<button class="chord ${bar.function.endsWith('cadence') || bar.function === 'modulation' ? 'cadence' : ''}" data-bar="${i}" tabindex="${i === tabStop ? 0 : -1}" aria-label="Bar ${i + 1}: ${bar.chord}${bar.roman ? ` (${bar.roman})` : ''}, ${bar.function}. Play from here."><span class="chord-top"><span class="number">${String(i + 1).padStart(2, '0')}</span><span class="bar-cue"></span><span class="roman">${bar.roman ?? ''}</span></span><strong>${bar.chord}</strong>${stepTag}<small>${bar.function}</small><span class="tension-bar" title="Tension ${Math.round(bar.tension * 100)}% (target ${Math.round(bar.targetTension * 100)}%)"><span class="tension-fill" style="width:${Math.round(bar.tension * 100)}%"></span><span class="tension-target" style="left:${Math.round(bar.targetTension * 100)}%"></span></span></button>`;
    }).join('');
    if (focused !== undefined) chords.querySelector<HTMLElement>(`[data-bar="${focused}"]`)?.focus();
    this.syncPerformance();
    const algoDesc = this.scoreValue.options.algorithmMix
      ? `${ALGORITHM_LABELS[this.scoreValue.options.algorithm].toLowerCase()} + ${ALGORITHM_LABELS[this.scoreValue.options.algorithmMix.secondary].toLowerCase()} (${ALGO_COMBINE_LABELS[this.scoreValue.options.algorithmMix.mode].toLowerCase()})`
      : ALGORITHM_LABELS[this.scoreValue.options.algorithm].toLowerCase();
    this.setText('reason', `${genreLabel} idiom; ${algoDesc} proposes melodies, and the one closest to the emotion’s tension curve is kept.`);
  }
  private drawFrame = (): void => {
    this.frame = undefined;
    if (!this.ready || !this.playing) return;
    const beat = this.session.beat;
    const phrase = this.scoreValue.phrases[0];
    const totalBeats = phrase?.length ?? 32;
    const displayBeats = Math.max(32, totalBeats);
    const barCount = phrase?.bars.length ?? 8;
    const playhead = this.view.getElementById('playhead');
    if (playhead) {
      playhead.style.display = 'block';
      const x = String(37 + Math.min(displayBeats, beat) / displayBeats * 923);
      playhead.setAttribute('x1', x); playhead.setAttribute('x2', x);
    }
    const progress = this.view.getElementById('phrase-progress-fill');
    if (progress) progress.style.width = `${clamp(beat / totalBeats * 100, 0, 100).toFixed(1)}%`;
    const currentBar = clamp(Math.floor(beat / 4), 0, Math.max(0, barCount - 1));
    if (currentBar !== this.lastBarDrawn) {
      this.lastBarDrawn = currentBar;
      this.setText('bar-pill', `Bar ${currentBar + 1} / ${barCount}`);
      this.view.querySelectorAll<HTMLElement>('[data-bar]').forEach(el => {
        const current = Number(el.dataset.bar) === currentBar;
        el.classList.toggle('current', current); el.toggleAttribute('aria-current', current);
      });
      this.syncPerformance();
      this.syncControls();
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
    const options = (values: readonly string[], label: (v: string) => string) => values.map(v => `<option value="${v}">${label(v)}</option>`).join('');
    return `<style>${STYLES}${STAR_STYLES}</style><section class="instrument" aria-label="Autonomous music composer">
      <div class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true"></span>AudioBus / Composer</div><div class="live" data-playing="false"><span class="bar-pill" id="bar-pill">Bar 1 / 8</span><span class="dot"></span><span id="live-label">Ready to compose</span></div></div>
      <div class="workspace"><section class="expression" aria-label="Feeling">
        <div class="wheel-wrap">${STAR_ART}</div>
        <p class="sr-only">Select an emotion on the star. Left and right arrows change family; up and down change intensity. Equivalent controls follow.</p>
        <div class="wheel-description" aria-live="polite"><div class="selected-label" id="emotion-label">Joy</div><div class="selection-meta"><span class="family" id="family-label">Joy</span> family · intensity <span id="intensity-value">67%</span></div></div>
        <div class="control-grid"><label class="field">Emotion family<select name="emotion">${options(FAMILIES, titleCase)}</select></label><label class="field">Intensity<input name="intensity" type="range" min="0" max="1" step="0.01" aria-label="Emotion intensity"></label></div>
      </section><section class="controls" aria-label="Music">
        <div><div class="transport-buttons"><button class="primary" id="start">▶ Start composing</button><button id="finish" disabled>Finish phrase</button><button class="danger" id="stop" disabled>Stop</button></div><div class="applied-wrap"><div class="phrase-progress" aria-hidden="true"><div class="phrase-progress-fill" id="phrase-progress-fill"></div></div><p class="applied" id="applied" role="status">Ready. Start composing, then steer the next phrase.</p></div></div>
        <label class="field"><span class="range-label"><span>Energy</span><output class="energy-value" id="energy-value">50</output></span><input name="energy" aria-label="Energy" type="range" min="0" max="1" step="0.01"><span class="range-ends"><span>Spacious</span><span>Active</span></span></label>
        <div class="control-grid"><label class="field">Genre<select name="genre">${options(GENRES, g => GENRE_PROFILES[g as Genre].label)}</select></label><label class="field"><span class="range-label">Swing <output id="swing-value">0%</output></span><input name="swing" type="range" min="0" max="0.45" step="0.01" aria-label="Swing"></label></div>
        <label class="field"><span class="range-label"><span>Tempo</span><output id="tempo-value">104 BPM</output></span><div class="seed-row"><input name="tempo" type="range" min="30" max="240" step="1" aria-label="Tempo / BPM"><button id="tap" title="Tap the beat to set the tempo (or press T)">Tap</button></div></label>
        <details class="more"><summary>Theme &amp; harmony</summary><div class="more-body">
          <div class="control-grid"><label class="field">Tonic<select name="root">${Array.from({ length: 12 }, (_, i) => `<option value="${i}">${pitchName(i + 60).slice(0, -1)}</option>`).join('')}</select></label><label class="field">Harmonic colour<select name="mode">${options(Object.keys(MODE_LABELS), m => MODE_LABELS[m as Mode])}</select></label></div>
          <div class="control-grid"><label class="field">Tuning<select name="tuning">${options(TUNINGS, t => TUNING_PROFILES[t as Tuning].label)}</select></label><label class="field">Groove<select name="groove">${options(GROOVES, g => GROOVE_LABELS[g as GroovePreset])}</select></label></div>
          <label class="field"><span class="range-label"><span>Dynamics &amp; variation</span><output id="dynamics-value">0%</output></span><input name="dynamics" type="range" min="0" max="1" step="0.01" value="0" aria-label="Dynamics and variation"></label>
          <div class="control-grid"><label class="field">Blend style<select name="mix-genre"><option value="none">None</option>${options(GENRES, g => GENRE_PROFILES[g as Genre].label)}</select></label><label class="field">Blend mode<select name="mix-mode" disabled>${options(GENRE_MIX_MODES, m => GENRE_MIX_LABELS[m as GenreMixMode])}</select></label></div>
          <label class="field"><span class="range-label"><span>Blend balance</span><output id="mix-amount-value">50%</output></span><input name="mix-amount" type="range" min="0" max="1" step="0.01" value="0.5" disabled aria-label="Blend balance"></label>
          <div class="control-grid"><label class="field">Theme seed<div class="seed-row"><input name="seed" type="text" maxlength="128" spellcheck="false"><button id="reroll" aria-label="Create a new theme" title="Create a new theme">↻</button></div></label><label class="field">Generator<select name="algorithm">${options(ALGORITHMS, a => ALGORITHM_LABELS[a as typeof ALGORITHMS[number]])}</select></label></div>
          <div class="control-grid"><label class="field">Combine algorithm<select name="mix-algorithm"><option value="none">None</option>${options(ALGORITHMS, a => ALGORITHM_LABELS[a as typeof ALGORITHMS[number]])}</select></label><label class="field">Combine mode<select name="mix-algo-mode" disabled>${options(ALGORITHM_COMBINERS, m => ALGO_COMBINE_LABELS[m as AlgorithmCombiner])}</select></label></div>
          <div class="field"><span class="field-label" id="parts-label">Ensemble</span><div class="parts" role="group" aria-labelledby="parts-label">${PARTS.map(p => `<label class="part"><input type="checkbox" data-part="${p}" checked>${titleCase(p)}</label>`).join('')}</div></div>
        </div></details>
        <details class="more"><summary>Sound &amp; MIDI</summary><div class="more-body">
          <div class="output-row"><label class="field">Output<select name="output"></select></label><label class="field">Volume<input name="volume" type="range" min="0" max="1" step="0.01" value="0.35" aria-label="Audition volume"></label></div>
          <label class="part" title="Send General MIDI Program Change messages for the genre’s instruments"><input type="checkbox" name="programs">Send instrument changes</label>
          <div class="input-row"><label class="field">Follow MIDI input<select name="input"></select></label><button id="capture" disabled title="Use the last notes you played as the theme">Use played theme</button></div>
          <span class="hint" id="input-label">Play along: the composer follows your key.</span>
        </div></details>
      </section></div>
      <section class="performance" aria-label="Performance">
        <div class="perf-head">
          <div class="perf-title"><span class="perf-kicker">Performance</span><span class="perf-target" id="perf-target">Next bar · Bar 1</span></div>
          <div class="perf-meta"><span class="perf-status" id="perf-status" role="status">Choose a change for the next bar</span><button class="perf-clear" id="perf-clear" hidden>Cancel</button></div>
        </div>
        <div class="perf-grid" id="perf-cues" role="group" aria-label="Next bar changes">${PERFORMANCE_CUES.map((cue, i) =>
          `<button class="cue" data-cue="${cue}" aria-pressed="false"><span class="cue-top"><span class="cue-name">${CUE_LABELS[cue]}</span><kbd class="cue-key">${i + 1}</kbd></span><small class="cue-hint" data-cue-hint="${cue}"></small></button>`
        ).join('')}</div>
      </section>
      <section class="score-section" aria-label="Phrase"><div class="score-meta" id="score-meta"></div><div class="roll-scroll" id="roll"></div><div class="chords" id="chords" role="toolbar" aria-label="Bars: choose one to play from it"></div><div class="legend">${PARTS.map(p => `<span style="--swatch:${COLOURS[p]}">${titleCase(p)}</span>`).join('')}</div></section>
      <div class="footer"><p class="reason" id="reason"></p><div class="buttons"><button id="midi">Export MIDI</button><button id="json" title="The displayed plan as JSON">Save score</button><button id="recording" title="Phrase snapshots and every MIDI message sent">Save performance log</button></div></div>
      <div class="colophon"><span>Seeded, symbolic music in 4/4 · v${GENERATOR_VERSION}</span><span id="output-label">Browser audition</span></div>
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'audiobus-composer': AudioBusComposer }
}
