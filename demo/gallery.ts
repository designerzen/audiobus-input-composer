import { compose } from '../src/composer.js';
import { GENRE_PROFILES, genreTempo } from '../src/genres.js';
import { scoreMetrics, type ScoreMetrics } from '../src/metrics.js';
import { Transport } from '../src/transport.js';
import { FAMILIES, GENRES, type Genre, type Score } from '../src/types.js';
import { PreviewSynth } from '../src/component/preview-synth.js';

const COLOURS = { melody: '#d0e9aa', bass: '#88abd9', harmony: '#b9a0d9', percussion: '#e8b780' };
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const synth = new PreviewSynth();
const transport = new Transport(synth, { onStop: () => setPlaying(undefined) });
let playing: string | undefined;

const genreSelect = $<HTMLSelectElement>('genre'), energyInput = $<HTMLInputElement>('energy'), seedSelect = $<HTMLSelectElement>('seed');
genreSelect.innerHTML = GENRES.map(g => `<option value="${g}">${GENRE_PROFILES[g].label}</option>`).join('');

const scoreFor = (genre: Genre, emotion: typeof FAMILIES[number], energy: number, seed: string) =>
  compose({ genre, emotion, energy, seed, tempo: genreTempo(genre), bars: 32 });

/** First phrase as a small piano roll: pitched parts above, drums below. */
function roll(score: Score): string {
  const phrase = score.phrases[0], w = 320, h = 96;
  const pitched = phrase.events.filter(e => e.part !== 'percussion' && e.start < 32);
  const low = Math.min(36, ...pitched.map(e => e.pitch)), high = Math.max(84, ...pitched.map(e => e.pitch));
  const y = (p: number) => 4 + (high - p) / (high - low) * 72;
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Piano roll of the first eight bars">`;
  for (let b = 0; b <= 8; b++) svg += `<line x1="${b * w / 8}" x2="${b * w / 8}" y1="0" y2="${h}" stroke="#232734"/>`;
  for (const e of pitched) svg += `<rect x="${e.start / 32 * w}" y="${y(e.pitch) - 1}" width="${Math.max(1.5, Math.min(e.duration, 32 - e.start) / 32 * w)}" height="2.4" fill="${COLOURS[e.part]}" opacity="${.45 + e.velocity * .55}"/>`;
  for (const d of phrase.events.filter(e => e.part === 'percussion' && e.start < 32)) svg += `<circle cx="${d.start / 32 * w}" cy="${d.pitch === 36 ? 90 : d.pitch <= 40 ? 85 : 81}" r="1.3" fill="${COLOURS.percussion}" opacity="${.4 + d.velocity * .6}"/>`;
  return `${svg}</svg>`;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;
function metricRows(m: ScoreMetrics, tempo: number): string {
  const rows: [string, string][] = [
    ['Chord tones on strong beats', pct(m.chordTones)], ['Syncopation', pct(m.syncopation)], ['Repeated bars', pct(m.repetition)],
    ['Pitch variety', pct(m.pitchEntropy)], ['Range / widest leap', `${m.range} / ${m.maxLeap} st`], ['Parallel 5ths/8ves', m.parallels.toFixed(2)],
    ['Loosest part, mean offset', `${Math.round(Math.max(0, ...Object.values(m.looseness)) * 60000 / tempo)} ms`],
  ];
  return `<dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
}

function setPlaying(id: string | undefined): void {
  playing = id;
  document.querySelectorAll<HTMLButtonElement>('button[data-play]').forEach(b => {
    const on = b.dataset.play === id;
    b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '■ Stop' : '▶ Play';
  });
}

const scores = new Map<string, Score>();
function render(): void {
  transport.stop();
  const genre = genreSelect.value as Genre, energy = Number(energyInput.value), seed = seedSelect.value;
  scores.clear();
  $('cards').innerHTML = FAMILIES.map(emotion => {
    const score = scoreFor(genre, emotion, energy, seed), id = `${genre}:${emotion}`;
    scores.set(id, score);
    const chords = score.phrases[0].bars.map(b => b.chord).join(' ');
    return `<article class="card"><header><div><h2>${title(emotion)}</h2><div class="sub">${score.phrases[0].mode} · ${score.options.tempo} BPM · ${score.phrases.map(p => p.cadence).join(', ')}</div></div><button data-play="${id}" aria-pressed="false">▶ Play</button></header>${roll(score)}<div class="chords">${chords}</div>${metricRows(scoreMetrics(score), score.options.tempo)}</article>`;
  }).join('');
}

function summary(): void {
  const keys = ['chordTones', 'syncopation', 'repetition', 'pitchEntropy', 'range', 'maxLeap', 'parallels'] as const;
  const heads = ['Chord tones', 'Syncopation', 'Repeated', 'Variety', 'Range', 'Leap', 'Parallels'];
  let html = `<thead><tr><th>Genre</th>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
  for (const genre of GENRES) {
    const ms = FAMILIES.map(emotion => scoreMetrics(scoreFor(genre, emotion, .6, 'gallery')));
    const avg = (k: typeof keys[number]) => ms.reduce((a, m) => a + m[k], 0) / ms.length;
    html += `<tr><td>${GENRE_PROFILES[genre].label}</td>${keys.map(k => `<td>${['range', 'maxLeap'].includes(k) ? avg(k).toFixed(1) : k === 'parallels' ? avg(k).toFixed(2) : pct(avg(k))}</td>`).join('')}</tr>`;
  }
  $('summary').insertAdjacentHTML('beforeend', `${html}</tbody>`);
}

$('cards').addEventListener('click', async event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-play]');
  if (!button) return;
  const id = button.dataset.play!;
  if (playing === id) { transport.stop(); return; }
  await synth.resume();
  const score = scores.get(id);
  if (!score) return;
  transport.start(score);
  setPlaying(id);
});
for (const el of [genreSelect, energyInput, seedSelect]) el.addEventListener('change', render);
document.addEventListener('visibilitychange', () => { if (document.hidden) transport.stop(); });

render();
// The table composes every genre; let the cards paint first.
setTimeout(summary, 50);
