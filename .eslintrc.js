module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config', '@nuxt/eslint-config'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignoreWhenEmpty: true,
        ignores: ['NuxtLink'],
        allowEmptyLines: false
      }
    ]
  }
}
