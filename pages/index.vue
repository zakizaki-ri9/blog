<template>
  <div>
    <section v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path" target="_blank" rel="noopener">
        <PostDateTime :posted-at="post.postedAt" />
        <h2 class="text-xl font-medium">{{ post.title }}</h2>
      </NuxtLink>
    </section>
  </div>
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
