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
  content: {},
  build: {},
  publicRuntimeConfig: {
    rootUrl,
  },
  // see. https://content.nuxtjs.org/ja/integrations#nuxtjsfeed
  feed() {
    const createFeedPosts = async function (feed: any) {
      feed.options = {
        title,
        description: descriptionContent,
        link: rootUrl,
      }

      const { $content } = require('@nuxt/content')
      const posts = await $content('posts', { deep: true }).fetch()
      posts.forEach((post: any) => {
        const url = `${rootUrl}${post.path}`
        feed.addItem({
          title: post.title,
          id: url,
          link: url,
          date: new Date(post.postedAt),
          description: post.description,
          content: post.description,
          author: post.authors,
        })
      })
    }

    const feedFormats = {
      rss: { type: 'rss2', file: 'rss.xml' },
      atom: { type: 'atom1', file: 'atom.xml' },
      json: { type: 'json1', file: 'feed.json' },
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
