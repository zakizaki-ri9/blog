<template>
  <article v-if="post">
    <PostDateTime :posted-at="post.postedAt" />
    <h1 class="text-3xl font-bold">{{ post.title }}</h1>
    <div class="pt-6"><NuxtContent :document="post" /></div>
  </article>
</template>

<script setup lang="ts">
import {
  defineComponent,
  useAsync,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { Site } from '@/constants'
import { fetchPost } from '@/composables/post'

const { params, $content } = useContext()
const { datetime, slug } = params.value
const post = useAsync(() =>
  fetchPost($content, {
    datetime,
    slug,
  })
)

useMeta(() => {
  if (!post.value) {
    return {}
  }
  return {
    title: post.value.title,
    meta: [
      {
        name: 'description',
        content: post.value.description,
      },
      {
        name: 'og:type',
        content: 'article',
      },
      {
        name: 'og:url',
        content: `${process.env.VERCEL_URL}${post.value.path}`.replace(
          '//',
          '/'
        ),
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:title',
        content: `${Site.title} - ${post.value.title}`,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: post.value.image || Site.defaultImage,
      },
      {
        name: 'og:description',
        content: post.value.description,
      },
    ],
  }
})
</script>

<script lang="ts">
export default defineComponent({
  head: {},
})
</script>

<style>
.nuxt-content h1 {
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 2rem;
  margin-top: 4rem;
  margin-bottom: 1rem;
}

.nuxt-content h2 {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin-top: 4rem;
  margin-bottom: 1rem;
}

.nuxt-content h3 {
  line-height: 1.75rem;
  margin-top: 4rem;
  margin-bottom: 1rem;
}

.nuxt-content h4 {
  font-size: 1rem;
  line-height: 1.5rem;
  margin-top: 4rem;
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
