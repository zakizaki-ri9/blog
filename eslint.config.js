import js from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import astroEslintParser from 'astro-eslint-parser';
import globals from 'globals';
import stylisticTs from '@stylistic/eslint-plugin-ts';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
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
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      'no-unused-vars': 'warn', // 未使用変数を警告に変更
      // Stylistic設定
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', "double"],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/ts/brace-style': ['error', '1tbs'],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/space-infix-ops': 'error',
      '@stylistic/ts/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/ts/no-extra-semi': 'error',
      '@stylistic/ts/keyword-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/ts/type-annotation-spacing': 'error',
    },
  },
]; 