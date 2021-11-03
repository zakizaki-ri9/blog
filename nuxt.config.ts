import { NuxtConfig } from '@nuxt/types'
import { Site } from './constants'
require('dotenv').config()

const config: NuxtConfig = {
  target: 'static',
  head: {
    title: Site.title,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      { name: 'twitter:site', content: '@zucky_sub' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/css/tailwind.css', '@/assets/css/main.css'],
  plugins: [],
  components: true,
  buildModules: [
    ['@nuxt/typescript-build', { typeCheck: false }],
    '@nuxtjs/tailwindcss',
    'unplugin-vue2-script-setup/nuxt',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-analytics',
  ],
  modules: ['@nuxt/content', '@nuxtjs/feed'],
  content: {
    markdown: {
      // @ts-ignore
      remarkExternalLinks: {
        target: '_blank',
        rel: 'noopener',
      },
    },
  },
  build: {},
  // see. https://content.nuxtjs.org/ja/integrations#nuxtjsfeed
  feed() {
    const createFeedPosts = async function (feed: any) {
      feed.options = {
        id: Site.title,
        title: Site.title,
        description: 'トップページ',
        link: Site.rootUrl,
        author: {
          name: 'zaki',
        },
      }

      const { $content } = require('@nuxt/content')
      const posts = await $content('posts', { deep: true })
        .sortBy('path', 'desc')
        .fetch()
      posts.forEach((post: any) => {
        const url = `${Site.rootUrl}${post.path}`
        feed.addItem({
          title: post.title,
          id: url,
          link: url,
          date: new Date(post.postedAt),
          description: post.description,
          content: post.description,
        })
      })
    }

    const feedFormats = {
      rss: { type: 'atom1', file: 'feed.xml' },
    }
    return Object.values(feedFormats).map(({ file, type }) => ({
      path: `/${file}`,
      type,
      create: createFeedPosts,
      cacheTime: 1000 * 60 * 15,
    }))
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
}

export default config
