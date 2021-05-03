<template>
  <article v-if="post">
    <PostDateTime :posted-at="post.postedAt" />
    <h1 class="text-xl">{{ post.title }}</h1>
    <div class="pt-6"><NuxtContent :document="post" /></div>
  </article>
</template>

<script lang="ts">
import { defineComponent, useAsync, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { params, $content } = useContext()
    const { datetime, slug } = params.value

    return {
      post: useAsync(() =>
        $content(`posts/${datetime}/${slug}`, { deep: true }).fetch()
      ),
    }
  },
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
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
