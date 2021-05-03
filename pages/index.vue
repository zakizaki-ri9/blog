<template>
  <ul class="grid gap-y-4">
    <li v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path" target="_blank" rel="noopener">
        <PostDateTime :posted-at="post.postedAt" />
        <h2 class="text-xl font-medium">{{ post.title }}</h2>
        <span v-if="post.description" class="font-thin text-sm text-gray-600">{{
          post.description
        }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $content } = useContext()
    return {
      posts: useAsync(() =>
        $content('posts', { deep: true }).sortBy('path', 'desc').fetch()
      ),
    }
  },
})
</script>
