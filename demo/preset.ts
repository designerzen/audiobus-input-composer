import { DEFAULT_OPTIONS, normalizeOptions } from '../src/composer.js';
import type { ComposerOptions } from '../src/types.js';

const NUMERIC = ['intensity', 'energy', 'tempo', 'root', 'swing'] as const;
const TEXT = ['seed', 'emotion', 'mode', 'algorithm', 'genre'] as const;

/** Only settings that differ from the defaults go into the link, so links stay short. */
export function presetToHash(options: ComposerOptions): string {
  const params = new URLSearchParams();
  for (const key of [...TEXT, ...NUMERIC]) if (options[key] !== DEFAULT_OPTIONS[key]) params.set(key, String(options[key]));
  if (options.parts.join() !== DEFAULT_OPTIONS.parts.join()) params.set('parts', options.parts.join(','));
  if (options.programs) params.set('programs', '1');
  if (options.motif) params.set('motif', options.motif.join(''));
  if (options.tuning) params.set('tuning', options.tuning);
  if (options.groove) params.set('groove', options.groove);
  if (options.dynamics) params.set('dynamics', String(options.dynamics));
  if (options.genreMix) {
    params.set('mixGenre', options.genreMix.genre);
    if (options.genreMix.mode && options.genreMix.mode !== 'blend') params.set('mixMode', options.genreMix.mode);
    if (options.genreMix.amount !== undefined && options.genreMix.amount !== .5) params.set('mixAmount', String(options.genreMix.amount));
  }
  if (options.algorithmMix) {
    params.set('mixAlgo', options.algorithmMix.secondary);
    params.set('mixAlgoMode', options.algorithmMix.mode);
    if (options.algorithmMix.weight !== undefined && options.algorithmMix.weight !== .5) params.set('mixAlgoWeight', String(options.algorithmMix.weight));
  }
  const text = params.toString();
  return text ? `#${text}` : location.pathname + location.search;
}

/** Throws on an invalid link; returns undefined when there is none. */
export function presetFromHash(hash: string): ComposerOptions | undefined {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (![...params.keys()].length) return undefined;
  const patch: Partial<ComposerOptions> = {};
  for (const key of TEXT) { const v = params.get(key); if (v !== null) (patch as Record<string, unknown>)[key] = v; }
  for (const key of NUMERIC) { const v = params.get(key); if (v !== null) patch[key] = Number(v); }
  const parts = params.get('parts');
  if (parts !== null) patch.parts = parts ? parts.split(',') as ComposerOptions['parts'] : [];
  if (params.get('programs') === '1') patch.programs = true;
  const motif = params.get('motif');
  if (motif) patch.motif = [...motif].map(Number);
  const tuning = params.get('tuning');
  if (tuning) patch.tuning = tuning as ComposerOptions['tuning'];
  const groove = params.get('groove');
  if (groove) patch.groove = groove as ComposerOptions['groove'];
  const dynamics = params.get('dynamics');
  if (dynamics !== null) patch.dynamics = Number(dynamics);
  const mixGenre = params.get('mixGenre');
  if (mixGenre) {
    patch.genreMix = {
      genre: mixGenre as NonNullable<ComposerOptions['genreMix']>['genre'],
      mode: (params.get('mixMode') ?? 'blend') as NonNullable<ComposerOptions['genreMix']>['mode'],
      amount: params.get('mixAmount') !== null ? Number(params.get('mixAmount')) : .5,
    };
  }
  const mixAlgo = params.get('mixAlgo');
  if (mixAlgo) {
    patch.algorithmMix = {
      secondary: mixAlgo as NonNullable<ComposerOptions['algorithmMix']>['secondary'],
      mode: (params.get('mixAlgoMode') ?? 'pipeline') as NonNullable<ComposerOptions['algorithmMix']>['mode'],
      weight: params.get('mixAlgoWeight') !== null ? Number(params.get('mixAlgoWeight')) : .5,
    };
  }
  return normalizeOptions(patch);
}
