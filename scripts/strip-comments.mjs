// Build step: copy each preset to ./dist/ with JSONC comments stripped so the
// published files parse with native `import ... with { type: 'json' }`.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const FILES = [
  'base.json',
  'typescript.json',
  'typescript-react.json',
  'typescript-react-tailwind.json',
  'oxfmt.json',
];

function stripJsonComments(json) {
  return (
    json
      // Remove /* */ comments
      .replaceAll(/\/\*[\s\S]*?\*\//g, '')
      // Remove // comments (but not in URLs)
      .replaceAll(/(?<!:)\/\/.*/g, '')
  );
}

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of FILES) {
  const source = await readFile(join(root, file), 'utf8');
  const stripped = stripJsonComments(source);

  // Validate that the result is strict JSON.
  JSON.parse(stripped);

  await writeFile(join(dist, file), stripped);
}
