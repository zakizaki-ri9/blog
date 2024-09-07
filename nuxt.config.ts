// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@unocss/nuxt",
    "nuxt-gtag",
    "@nuxt/eslint",
    "@nuxt/image",
  ],
  content: {},
  srcDir: "src/",

  gtag: {
    id: "G-SX3SFV4BQL",
  },

  experimental: {
    typedPages: true,
  },

  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: "double",
      },
    },
  },

  compatibilityDate: "2024-07-28",
})
