<template>
  <header class="flex w-full my-6">
    <a class="ml-4 mr-auto text-xl font-medium" href="/">zaki blog</a>
    <div class="flex justify-end">
      <a
        v-for="profile in profiles"
        :key="profile.text"
        :href="profile.url"
        class="px-1 font-thin"
        target="_blank"
        rel="noopener"
        >{{ profile.text }}</a
      >
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

type Profile = {
  text: string
  url: string
}

export default defineComponent({
  setup() {
    const profiles: Profile[] = [
      { text: 'Twitter', url: 'https://twitter.com/zucky_zakizaki' },
      { text: 'GitHub', url: 'https://github.com/zakizaki-ri9' },
      { text: 'はてな', url: 'https://kic-yuuki.hatenablog.com/' },
    ]

    return { profiles }
  },
})
</script>
