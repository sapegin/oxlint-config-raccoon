// Build step:
// 1. Copy each preset to ./dist/.
// 2. Strip JSONC comments.
// 3. Flatten `extends` chains.
//
// The published files are consumed via native `import ... with {type:'json'}`,
// where oxlint's JS-config validator rejects string entries in `extends`, so
// every preset must be self-contained.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const FILES = [
  ['base.json', 'base.json'],
  ['typescript.json', 'typescript.json'],
  ['typescript-react.json', 'typescript-react.json'],
  ['typescript-react-tailwind.json', 'typescript-react-tailwind.json'],
  ['.oxfmtrc.json', 'oxfmt.json'],
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

async function loadJsonc(file) {
  const source = await readFile(file, 'utf8');
  return JSON.parse(stripJsonComments(source));
}

function uniqueConcat(a = [], b = []) {
  return [...new Set([...a, ...b])];
}

function mergeObjects(a = {}, b = {}) {
  return { ...a, ...b };
}

// Merge a parent preset with a child. Child values win on conflicts.
function mergeConfigs(parent, child) {
  const merged = { ...parent, ...child };

  if (parent.plugins || child.plugins) {
    merged.plugins = uniqueConcat(parent.plugins, child.plugins);
  }
  if (parent.jsPlugins || child.jsPlugins) {
    merged.jsPlugins = uniqueConcat(parent.jsPlugins, child.jsPlugins);
  }
  if (parent.rules || child.rules) {
    merged.rules = mergeObjects(parent.rules, child.rules);
  }
  if (parent.categories || child.categories) {
    merged.categories = mergeObjects(parent.categories, child.categories);
  }
  if (parent.env || child.env) {
    merged.env = mergeObjects(parent.env, child.env);
  }
  if (parent.globals || child.globals) {
    merged.globals = mergeObjects(parent.globals, child.globals);
  }
  if (parent.settings || child.settings) {
    merged.settings = mergeObjects(parent.settings, child.settings);
  }
  if (parent.overrides || child.overrides) {
    merged.overrides = [
      ...(parent.overrides ?? []),
      ...(child.overrides ?? []),
    ];
  }

  return merged;
}

async function resolveConfig(file) {
  const config = await loadJsonc(file);
  const extendsList = Array.isArray(config.extends) ? config.extends : [];

  let resolved = {};
  for (const entry of extendsList) {
    if (typeof entry !== 'string') {
      throw new TypeError(
        `Unsupported \`extends\` entry in ${file}: only relative path strings are supported`
      );
    }
    const parent = await resolveConfig(resolve(dirname(file), entry));
    resolved = mergeConfigs(resolved, parent);
  }

  const { extends: _extends, $schema: _schema, ...own } = config;
  return mergeConfigs(resolved, own);
}

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const [sourceFile, distFile] of FILES) {
  const flattened = await resolveConfig(join(root, sourceFile));
  await writeFile(
    join(dist, distFile),
    `${JSON.stringify(flattened, null, 2)}\n`
  );
}
