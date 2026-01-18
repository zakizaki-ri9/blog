import js from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import astroEslintParser from 'astro-eslint-parser';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

import playwright from 'eslint-plugin-playwright';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // Playwrightテストの設定 (推奨設定を適用)
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },
  // グローバル設定
  js.configs.recommended,
  // .astroファイル用の設定
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin,
    },
    processor: astroPlugin.processors['.astro'],
    languageOptions: {
      // astro-eslint-parserを直接利用
      parser: astroEslintParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Astro特有のグローバル
        Astro: 'readonly',
        Fragment: 'readonly',
      },
    },
    rules: {
      // astroプラグインの推奨ルール
      ...astroPlugin.configs.recommended.rules,
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      // エラーを緩和するルール
      'no-unused-vars': 'warn', // 未使用変数を警告に変更
      'no-useless-escape': 'warn', // 不要なエスケープを警告に変更
    },
  },
  // TypeScriptファイル用の設定
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': 'warn', // 未使用変数を警告に変更
      // 型安全性はTypeScriptの型チェック（tsc --noEmit）で検証
      // Stylistic設定
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', "double"],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/keyword-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/type-annotation-spacing': 'error',
    },
  },
]; 