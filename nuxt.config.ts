// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@unocss/nuxt', 'nuxt-gtag'],
  content: {},
  srcDir: 'src/',
  gtag: {
    id: 'G-SX3SFV4BQL'
  }
})
