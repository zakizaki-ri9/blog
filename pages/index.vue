<template>
  <div class="container m-4">
    <section v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path" target="_blank" rel="noopener">
        <h2 class="text-lg">{{ post.title }}</h2>
      </NuxtLink>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $content } = useContext()

    const posts = useAsync(() =>
      $content('posts', { deep: true }).sortBy('path', 'desc').fetch()
    )

    return { posts }
  },
})
</script>
