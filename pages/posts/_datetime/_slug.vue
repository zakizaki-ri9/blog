<template>
  <article v-if="post">
    <PostDateTime :posted-at="post.postedAt" />
    <h1 class="text-3xl font-bold">{{ post.title }}</h1>
    <div class="pt-6"><NuxtContent :document="post" /></div>
  </article>
</template>

<script lang="ts">
import {
  defineComponent,
  useAsync,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { params, $content, $config } = useContext()
    const { datetime, slug } = params.value
    const post = useAsync(() =>
      $content(`posts/${datetime}/${slug}`, { deep: true }).fetch()
    )

    useMeta(() => ({
      title: $config.title,
      meta: [
        {
          name: 'og:url',
          // @ts-ignore
          content: `${$config.rootUrl}${post.value.path}`.replace('//', '/'),
        },
        {
          name: 'og:type',
          content: 'article',
        },
        {
          name: 'og:title',
          // @ts-ignore
          content: `${$config.title} - ${post.value.title}`,
        },
        {
          name: 'og:description',
          // @ts-ignore
          content: post.value.description,
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
      ],
    }))

    return {
      post,
    }
  },
  head: {},
})
</script>

<style>
.nuxt-content h1 {
  font-size: 1.5rem;
  line-height: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.nuxt-content h2 {
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.nuxt-content h3 {
  line-height: 1.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.nuxt-content h4 {
  font-size: 1rem;
  line-height: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.nuxt-content p {
  margin-top: 1rem;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.nuxt-content ul {
  padding-left: 1rem;
}

.nuxt-content li {
  list-style: inside;
  list-style-type: circle;
  line-height: 1.7;
}

.nuxt-content .footnotes {
  font-weight: 200;
  font-size: 0.75rem;
  line-height: 1rem;
}

.nuxt-content .footnotes ol {
  margin-top: 1rem;
  counter-reset: count;
}

.nuxt-content .footnotes li {
  list-style-type: none;
}

.nuxt-content .footnotes li:before {
  list-style-type: none;
  counter-increment: count;
  content: counter(count);
  margin-right: 0.5rem;
}

.nuxt-content a {
  color: #007fb1;
}

.nuxt-content a:hover {
  color: #99cfe5;
}
</style>
