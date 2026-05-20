import { defineConfig } from 'oxlint';
import typescriptReact from '../../dist/typescript-react.js';

export default defineConfig({ extends: [typescriptReact] });
