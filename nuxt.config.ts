import { Site } from './constants'

export default defineNuxtConfig({
  typescript: {
    shim: false,
    strict: false,
  },
  app: {
    head: {
      title: Site.title,
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
  },
  components: true,
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  // target: '',

  // buildModules: ['@nuxtjs/google-analytics'],

  // content: {
  //   markdown: {
  //     // @ts-ignore
  //     remarkExternalLinks: {
  //       target: '_blank',
  //       rel: 'noopener',
  //     },
  //   },
  // },
  // feed() {
  //   const createFeedPosts = async function (feed: any) {
  //     feed.options = {
  //       id: Site.title,
  //       title: Site.title,
  //       description: 'トップページ',
  //       link: Site.rootUrl,
  //       author: {
  //         name: 'zaki',
  //       },
  //     }
  //     const posts = await fetchPosts($content)
  //     posts.forEach((post: any) => {
  //       const url = `${Site.rootUrl}${post.path}`
  //       feed.addItem({
  //         title: post.title,
  //         id: url,
  //         link: url,
  //         date: new Date(post.postedAt),
  //         description: post.description,
  //         content: post.description,
  //       })
  //     })
  //   }
  //   const feedFormats = {
  //     rss: { type: 'atom1', file: 'feed.xml' },
  //   }
  //   return Object.values(feedFormats).map(({ file, type }) => ({
  //     path: `/${file}`,
  //     type,
  //     create: createFeedPosts,
  //     cacheTime: 1000 * 60 * 15,
  //   }))
  // },
  // generate: {
  //   async routes() {
  //     const tags = [
  //       ...new Set(
  //         (await fetchPosts($content)).flatMap((post) => post.tags || [])
  //       ),
  //     ]
  //     return tags.map((tag) => `/tags/${tag}`)
  //   },
  // },
})
