import { NuxtConfig } from '@nuxt/types'

const title = 'zaki-blog'
const rootUrl = 'https://zaki-blog.vercel.app'
const descriptionContent = 'きままに更新するブログ'

const config: NuxtConfig = {
  target: 'static',
  head: {
    title,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: descriptionContent,
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: title,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: rootUrl,
      },
      { hid: 'og:title', property: 'og:title', content: title },
      {
        hid: 'og:description',
        property: 'og:description',
        content: descriptionContent,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://i.imgur.com/Y7nlVbM.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@zucky_sub' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@/assets/css/tailwind.css', '@/assets/css/main.css'],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
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
  publicRuntimeConfig: {
    rootUrl,
  },
  // see. https://content.nuxtjs.org/ja/integrations#nuxtjsfeed
  feed() {
    const createFeedPosts = async function (feed: any) {
      feed.options = {
        id: title,
        title,
        description: descriptionContent,
        link: rootUrl,
        author: {
          name: 'zaki',
        },
      }

      const { $content } = require('@nuxt/content')
      const posts = await $content('posts', { deep: true })
        .sortBy('path', 'desc')
        .fetch()
      posts.forEach((post: any) => {
        const url = `${rootUrl}${post.path}`
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
}

export default config
