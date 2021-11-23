<template>
  <ul v-if="posts" class="grid gap-y-4">
    <li v-for="post in posts" :key="post.path">
      <div class="transition hover:bg-gray-300">
        <NuxtLink :to="post.path" target="_blank" rel="noopener">
          <PostDateTime :posted-at="post.postedAt" />
          <h2 class="text-xl font-medium">{{ post.title }}</h2>
          <span
            v-if="post.description"
            class="font-thin text-sm text-gray-600"
            >{{ post.description }}</span
          >
        </NuxtLink>
      </div>
      <div v-if="post.tags" class="flex flex-wrap gap-1 text-sm my-1">
        <TagLink v-for="tag in post.tags" :key="tag" :label="tag" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  defineComponent,
  useAsync,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { Site } from '@/constants'
import { fetchPosts } from '@/composables/post'

const { params, $content } = useContext()
const posts = useAsync(() => fetchPosts($content, { tag: params.value.tag }))

useMeta(() => ({
  title: 'zaki-blog',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'きままに更新するブログ',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'og:url',
      content: Site.rootUrl,
    },
    {
      name: 'og:title',
      content: Site.title,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: Site.defaultImage,
    },
    {
      name: 'og:description',
      content: 'きままに更新するブログ',
    },
  ],
}))
</script>

<script lang="ts">
export default defineComponent({
  head: {},
})
</script>
