import js from '@eslint/js';
import { parser, configs } from 'typescript-eslint';
import vuePlugin from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';

export default [
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        // Node globals
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...configs.recommended,
  prettier,
  {
    // Vue 3 files
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      ...vuePlugin.configs['flat/recommended'].rules,
    },
  },
  {
    // TypeScript files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
  },
  {
    // JavaScript files - no TypeScript parsing
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    // Ignore patterns
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.vite/**',
      '**/coverage/**',
      '**/.turbo/**',
      'pnpm-lock.yaml',
      'package-lock.json',
    ],
  },
];
