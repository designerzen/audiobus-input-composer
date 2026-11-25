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
  return normalizeOptions(patch);
}
