import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.error) {
    throw result.error;
  }
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

test.each([
  'base',
  'typescript',
  'typescript-react',
  'typescript-react-tailwind',
])('oxlint loads %s.json', (name) => {
  const { status, stdout, stderr } = run('npx', [
    'oxlint',
    '--print-config',
    '-c',
    `${name}.json`,
  ]);
  expect(
    status,
    `oxlint exited with ${status}\nstderr:\n${stderr}\nstdout:\n${stdout}`
  ).toBe(0);
});

test.each([
  'base.json',
  'typescript.json',
  'typescript-react.json',
  'typescript-react-tailwind.json',
  'oxfmt.json',
])('dist/%s parses as strict JSON', async (name) => {
  const source = await readFile(
    new URL(`../dist/${name}`, import.meta.url),
    'utf8'
  );
  expect(() => JSON.parse(source)).not.toThrow();
});

test.each([
  'base.json',
  'typescript.json',
  'typescript-react.json',
  'typescript-react-tailwind.json',
])('dist/%s is self-contained (no extends, no $schema)', async (name) => {
  const source = await readFile(
    new URL(`../dist/${name}`, import.meta.url),
    'utf8'
  );
  const config = JSON.parse(source);
  expect(config).not.toHaveProperty('extends');
  expect(config).not.toHaveProperty('$schema');
});

test('oxfmt loads .oxfmtrc.json', () => {
  const { status, stdout, stderr } = run('npx', [
    'oxfmt',
    '--check',
    'package.json',
  ]);
  expect(
    status,
    `oxfmt exited with ${status}\nstderr:\n${stderr}\nstdout:\n${stdout}`
  ).toBe(0);
});
