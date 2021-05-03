import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  target: 'static',
  head: {
    title: 'zaki-blog',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'きままに更新するブログ',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/css/tailwind.css'],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
  ],
  modules: ['@nuxt/content'],
  content: {},
  build: {},
  publicRuntimeConfig: {
    rootUrl: 'https://zaki-blog.vercel.app',
  },
}

export default config
