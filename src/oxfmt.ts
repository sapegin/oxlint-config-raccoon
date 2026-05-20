import { type OxfmtConfig } from 'oxfmt';

const config: OxfmtConfig = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'es5',
  jsdoc: {
    commentLineStrategy: 'keep',
    lineWrappingStyle: 'balance',
  },
  sortImports: {
    newlinesBetween: false,
  },
  sortPackageJson: {},
  sortTailwindcss: {},
  overrides: [
    {
      files: ['*.md'],
      options: {
        arrowParens: 'avoid',
        printWidth: 70,
        proseWrap: 'never',
        trailingComma: 'none',
      },
    },
  ],
};

export default config;
