// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@unocss/nuxt",
    "nuxt-gtag",
    "@nuxt/eslint",
    "@nuxt/image",
  ],
  devtools: { enabled: true },
  content: {},

  runtimeConfig: {
    public: {
      baseURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.VERCEL_URL,
    },
  },
  srcDir: "src/",

  experimental: {
    typedPages: true,
  },

  compatibilityDate: "2024-07-28",

  eslint: {
    config: {
      stylistic: {
        semi: false,
        quotes: "double",
      },
    },
  },

  gtag: {
    id: "G-SX3SFV4BQL",
  },
})
