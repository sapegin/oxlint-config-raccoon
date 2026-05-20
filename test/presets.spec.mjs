import { spawnSync } from 'node:child_process';
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
])('oxlint loads %s preset', (name) => {
  const { status, stdout, stderr } = run('npx', [
    'oxlint',
    '--print-config',
    '-c',
    `test/fixtures/${name}.config.ts`,
  ]);
  expect(
    status,
    `oxlint exited with ${status}\nstderr:\n${stderr}\nstdout:\n${stdout}`
  ).toBe(0);
});

test.each([
  'base',
  'typescript',
  'typescript-react',
  'typescript-react-tailwind',
  'oxfmt',
])('dist/%s.js exports a config object', async (name) => {
  const module_ = await import(`../dist/${name}.js`);
  expect(module_.default).toBeTypeOf('object');
  expect(module_.default).not.toBeNull();
});

test('oxfmt loads the local preset', () => {
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
