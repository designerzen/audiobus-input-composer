import { cp, mkdir, writeFile } from 'node:fs/promises';

await mkdir('site/library', { recursive: true });
await cp('dist', 'site/library', { recursive: true });
await cp('THIRD_PARTY_NOTICES.md', 'site/THIRD_PARTY_NOTICES.md');
await writeFile('site/.nojekyll', '');
console.log('Included standalone ESM library and component in site/library.');
