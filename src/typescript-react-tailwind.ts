import { type OxlintConfig } from 'oxlint';
import typescriptReact from './typescript-react.js';

const config: OxlintConfig = {
  extends: [typescriptReact],
  plugins: [],
  jsPlugins: ['oxlint-tailwindcss'],
  rules: {
    // Reports classes not recognized by Tailwind CSS
    'tailwindcss/no-unknown-classes': 'error',
    // Detects classes that set the same CSS property
    'tailwindcss/no-conflicting-classes': 'error',
    // Detects repeated classes in the same string
    'tailwindcss/no-duplicate-classes': 'warn',
    // Disallows Tailwind's default palette (bg-red-500, etc.)
    'tailwindcss/no-default-palette': 'error',
    // Detects classes deprecated in Tailwind CSS v4
    'tailwindcss/no-deprecated-classes': 'warn',
    // Disallows dynamic classes (bg-${color}-500, etc.)
    'tailwindcss/no-dynamic-classes': 'error',
    // Requires a base (light) utility when using the dark: variant on the same
    // element
    'tailwindcss/no-dark-without-light': 'warn',
    // Detects variant-prefixed classes that are redundant
    'tailwindcss/no-contradicting-variants': 'warn',
    // Enforces a consistent order for Tailwind CSS variant prefixes
    'tailwindcss/consistent-variant-order': 'warn',
    // Disallow unnecessary whitespace in Tailwind CSS class strings
    'tailwindcss/no-unnecessary-whitespace': 'warn',
    // Enforces canonical Tailwind CSS class names
    'tailwindcss/enforce-canonical': 'warn',
    // Suggests shorthand classes when all axes have the same value
    'tailwindcss/enforce-shorthand': 'warn',
    // Enforces a consistent position for the ! (important) modifier
    'tailwindcss/enforce-consistent-important-position': 'warn',
    // Moves the negative sign inside arbitrary value brackets for consistency
    'tailwindcss/enforce-negative-arbitrary-values': 'warn',
    // Enforces consistent CSS variable syntax
    'tailwindcss/enforce-consistent-variable-syntax': 'warn',
    // Flags hardcoded color values in arbitrary brackets
    'tailwindcss/no-hardcoded-colors': 'warn',
    // Detects arbitrary values that have a named Tailwind equivalent
    'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
    // Prefer the scale step or theme token a hardcoded value is numerically
    // equal to
    'tailwindcss/prefer-scale-token': 'warn',
    // Suggests replacing raw CSS variable references like border-(--border)
    // with the equivalent named theme-token utility
    'tailwindcss/prefer-theme-tokens': 'warn',
  },
};

export default config;
