# oxlint-config-raccoon

[![npm](https://img.shields.io/npm/v/oxlint-config-raccoon.svg)](https://www.npmjs.com/package/oxlint-config-raccoon) [![Node.js CI status](https://github.com/sapegin/oxlint-config-raccoon/workflows/Node.js%20CI/badge.svg)](https://github.com/sapegin/oxlint-config-raccoon/actions)

Shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) configurations that I use on all my projects.

- All linter presets rely on Oxlint’s built-in plugins (`eslint`, `unicorn`, `vitest`, `import`, `jsdoc`, `promise`, `typescript`, `react`, and `jsx-a11y` where appropriate).
- Type-aware TypeScript rules are provided through [`oxlint-tsgolint`](https://github.com/oxc-project/tsgolint).
- Tailwind CSS support is opt-in through [`oxlint-tailwindcss`](https://github.com/sergioazoc/oxlint-tailwindcss). The formatter preset uses Oxfmt’s built-in import, `package.json`, and Tailwind class sorting.

## Presets

| Preset | Extends | Adds |
| --- | --- | --- |
| `oxlint-config-raccoon/base` | — | JavaScript baseline (core + Unicorn + Vitest) |
| `oxlint-config-raccoon/typescript` | `base` | `typescript` plugin and type-aware rules |
| `oxlint-config-raccoon/typescript-react` | `typescript` | `react` and `jsx-a11y` plugins |
| `oxlint-config-raccoon/typescript-react-tailwind` | `typescript-react` | `oxlint-tailwindcss` JS plugin |
| `oxlint-config-raccoon/oxfmt` | — | Oxfmt formatter preset |

## Installation

```sh
npm install --save-dev oxlint oxlint-tsgolint oxfmt oxlint-config-raccoon
```

For the Tailwind preset, also install:

```sh
npm install --save-dev oxlint-tailwindcss
```

## Usage

### Oxlint

#### JavaScript

Create `oxlint.config.ts`:

```ts
import { defineConfig } from 'oxlint';
import base from 'oxlint-config-raccoon/base';

export default defineConfig({
  extends: [base]
});
```

To ignore files:

```ts
import { defineConfig } from 'oxlint';
import base from 'oxlint-config-raccoon/base';

export default defineConfig({
  extends: [base],
  ignorePatterns: ['plugins/*/main.js']
});
```

#### TypeScript

Create `oxlint.config.ts`:

```ts
import { defineConfig } from 'oxlint';
import typescript from 'oxlint-config-raccoon/typescript';

export default defineConfig({
  extends: [typescript],
  options: {
    typeAware: true,
    typeCheck: true
  }
});
```

> [!IMPORTANT] `options.typeAware` and `options.typeCheck` are only honoured in the **root** config file, so the presets do not set them — you must enable type-aware linting yourself when extending the `typescript`, `typescript-react`, or `typescript-react-tailwind` presets.

> [!IMPORTANT] Type-aware linting requires `tsconfig.json` and TypeScript 7+ via [`typescript-go`](https://github.com/microsoft/typescript-go); some legacy options like `baseUrl` are not supported. See the [Oxlint type-aware guide](https://oxc.rs/docs/guide/usage/linter/type-aware.html).

#### React

Create `oxlint.config.ts`:

```ts
import { defineConfig } from 'oxlint';
import typescriptReact from 'oxlint-config-raccoon/typescript-react';

export default defineConfig({
  extends: [typescriptReact],
  options: {
    typeAware: true,
    typeCheck: true
  }
});
```

#### Tailwind CSS

The Tailwind lint preset targets **Tailwind CSS v4** (the constraint comes from `oxlint-tailwindcss`). Tell the plugin where to find your Tailwind entry point in your root config:

```ts
import { defineConfig } from 'oxlint';
import typescriptReactTailwind from 'oxlint-config-raccoon/typescript-react-tailwind';

export default defineConfig({
  extends: [typescriptReactTailwind],
  options: { typeAware: true },
  settings: {
    tailwindcss: {
      entryPoint: 'src/styles/app.css'
    }
  }
});
```

Class sorting is intentionally left to Oxfmt (`sortTailwindcss` in `oxfmt.config.ts`) to avoid two tools fighting over the order.

### Oxfmt

Create `oxfmt.config.ts`:

```ts
import { defineConfig } from 'oxfmt';
import oxfmt from 'oxlint-config-raccoon/oxfmt';

export default defineConfig(oxfmt);
```

To ignore files:

```ts
import { defineConfig } from 'oxfmt';
import oxfmt from 'oxlint-config-raccoon/oxfmt';

export default defineConfig({
  ...oxfmt,
  ignorePatterns: ['plugins/*/main.js']
});
```

## Npm scripts

`package.json`:

```json
{
  "scripts": {
    "test": "oxlint && vitest run",
    "lint": "oxlint --fix",
    "format": "oxfmt"
  }
}
```

## Editor setup

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.codeActionsOnSave": {
    "source.format.oxc": "always",
    "source.fixAll.oxc": "always"
  }
}
```

`.vscode/extensions.json`:

```json
{
  "recommendations": ["oxc.oxc-vscode"]
}
```

## Code style at a glance

- Two-space indentation.
- Single quotes, semicolons, 80-char lines (enforced by Oxfmt).
- Declare variables just before their first use.
- One variable per `const`/`let` statement; no `var`.
- Strict equality (`===`, `!==`).
- Return early.

```js
function eatFood(food) {
  if (food.length === 0) {
    return ['No food'];
  }

  return food.map(dish => `No ${dish.toLowerCase()}`);
}

const food = ['Pizza', 'Burger', 'Coffee'];
console.log(eatFood(food));
```
