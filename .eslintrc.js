/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
const config = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [],
  rules: {},
  overrides: [
    {
      files: ['**/*ts', '**/*js'],
      rules: {
        'vue/script-setup-uses-vars': 'off',
      },
    },
  ],
}

module.exports = config
