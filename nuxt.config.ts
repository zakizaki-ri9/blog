// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  // future: {
  //   // Nuxt4 の機能で問題ないか確認する
  //   compatibilityVersion: 4,
  // },
  /**
   * compatibilityVersion: 4 で自動追加されるプロパティ
   * 互換性を意味する
   * ref. https://github.com/nuxt/nuxt/issues/27992
   */
  // compatibilityDate: "2024-07-06",d

  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@unocss/nuxt",
    "nuxt-gtag",
    "@nuxt/eslint",
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
})
