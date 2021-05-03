<template>
  <header class="flex w-full">
    <h2 class="mr-auto"><a href="/">zaki blog</a></h2>
    <ul class="flex justify-end">
      <li v-for="profile in profiles" :key="profile.text">
        <a
          :href="profile.url"
          class="px-1 font-thin"
          target="_blank"
          rel="noopener"
          >{{ profile.text }}</a
        >
      </li>
    </ul>
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
