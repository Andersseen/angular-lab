import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import globals from 'globals';

export default defineConfig(
  {
    name: 'global-ignores',
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      '.nx/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.wrangler/**',
      'worker-configuration.d.ts',
    ],
  },
  {
    name: 'typescript',
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    name: 'templates',
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    name: 'workers',
    files: ['functions/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.worker,
      },
    },
    rules: {
      '@angular-eslint/no-angular-modules': 'off',
    },
  }
);
