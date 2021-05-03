<template>
  <article v-if="post" class="container m-4">
    <h1 class="text-lg font-medium">{{ post.title }}</h1>
    <NuxtContent :document="post" />
  </article>
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { params, $content } = useContext()
    const { datetime, slug } = params.value

    const post = useAsync(() =>
      $content(`posts/${datetime}/${slug}`, { deep: true }).fetch()
    )

    return { post }
  },
})
</script>
