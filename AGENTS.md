Shared Oxlint and Oxfmt configuration, authored in TypeScript and published as compiled JS + `.d.ts`.

## Layout

Each preset is a single TypeScript module under `src/`:

- `src/base.ts` — JavaScript baseline (core rules, Unicorn, Vitest overrides).
- `src/typescript.ts` — extends `base`, enables the `typescript` plugin and type-aware rules.
- `src/typescript-react.ts` — extends `typescript`, enables `react` and `jsx-a11y` plugins.
- `src/typescript-react-tailwind.ts` — extends `typescript-react`, enables the `oxlint-tailwindcss` JS plugin.
- `src/oxfmt.ts` — Oxfmt formatter preset (import + Tailwind sorting included).

`tsc` compiles `src/*.ts` to `dist/*.js` + `dist/*.d.ts`. Comments are stripped on emit; only `dist/` is published.

Each preset exports a typed config object via `default`. Sibling presets are composed at runtime through `extends: [parent]`.

The repo dogfoods its own presets via root-level `oxlint.config.ts` and `oxfmt.config.ts`, which import from `./src/*.ts` directly.

## Constraints

- `options.typeAware` and `options.typeCheck` only work in the consumer's **root** config file. Do not set them in extended presets — document instead that consumers must opt in themselves.
- Keep configs minimal: lean on `categories.correctness: "error"` and the built-in recommended sets; only override rules that diverge from those defaults.
- Source imports between presets must use the `.js` extension (`import base from './base.js'`) so that `tsc` under `NodeNext` resolution emits correct paths.

## When adding rules

- If a rule belongs to a category already enabled via `categories`, do not re-declare it.
- Preserve plugin lists across extending presets — `plugins` is one of the fields that merges through `extends`, but listing it in each preset keeps the file self-describing.
- For overrides scoped to test or config files, use the `overrides` array.
