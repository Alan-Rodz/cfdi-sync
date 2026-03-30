import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
 { ignores: ['dist'] },
 js.configs.recommended,
 ...tseslint.configs.recommended,
 {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
   ecmaVersion: 2020,
   globals: globals.browser,
   parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
   },
  },
  plugins: {},
  rules: {
   // General
   'semi': 'warn',
   'eol-last': 'warn',
   'no-var': 'off',
   'no-extra-semi': 'error',
   'no-duplicate-imports': 'error',
   'no-unused-labels': 'error',
   'no-unused-vars': 'off',
   'no-trailing-spaces': 'warn',
   'no-multi-spaces': 'off',
   'no-unreachable': 'warn',
   'no-multiple-empty-lines': 'warn',
   'linebreak-style': ['warn', 'unix'],
   'no-constant-condition': 'warn',
   'comma-spacing': 'warn',
   'prefer-const': 'off',
   'object-curly-spacing': ['warn', 'always'],
   'no-unsafe-negation': 'error',
   'no-nested-ternary': 'off',

   // TypeScript
   '@typescript-eslint/no-use-before-define': 'off',
   '@typescript-eslint/no-empty-interface': 'off',
   '@typescript-eslint/no-empty-function': 'off',
   '@typescript-eslint/interface-name-prefix': 'off',
   '@typescript-eslint/camelcase': 'off',
   '@typescript-eslint/no-explicit-any': 'off',
   '@typescript-eslint/ban-ts-comment': 'off',
   '@typescript-eslint/ban-types': 'off',
   '@typescript-eslint/require-array-sort-compare': 'off',
   '@typescript-eslint/explicit-member-accessibility': 'off',
   '@typescript-eslint/explicit-function-return-type': 'off',
   '@typescript-eslint/no-object-literal-type-assertion': 'off',
   '@typescript-eslint/indent': 'off',
   '@typescript-eslint/array-type': 'off',
   '@typescript-eslint/no-non-null-assertion': 'off',
   '@typescript-eslint/no-inferrable-types': 'off',
   '@typescript-eslint/no-unused-vars': ['warn', {
    args: 'none',
   }],

   // Comma dangle
   'comma-dangle': ['warn', {
    arrays: 'always-multiline',
    objects: 'always-multiline',
    imports: 'always-multiline',
    exports: 'always-multiline',
    functions: 'never',
   }],
  },
 },
]
