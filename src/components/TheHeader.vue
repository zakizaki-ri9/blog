<template>
  <header
    class="flex w-full"
    :class="$style.header"
  >
    <h2 class="mr-auto">
      <NuxtLink href="/">
        zaki blog
      </NuxtLink>
    </h2>
    <div class="flex justify-end items-center">
      <NuxtLink
        href="https://twitter.com/zucky_sub"
        target="_blank"
      >
        <div class="i-tabler-brand-github" />
      </NuxtLink>
      <NuxtLink
        href="https://github.com/zakizaki-ri9"
        target="_blank"
      >
        <div class="i-tabler-brand-x" />
      </NuxtLink>
      <NuxtLink
        href="https://kic-yuuki.hatenablog.com/"
        target="_blank"
        rel="noopener"
      >
        Hatena
      </NuxtLink>
      <NuxtLink
        href="/feed.xml"
        target="_blank"
      >
        RSS
      </NuxtLink>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  h2 {
    @apply text-xl;
    @apply font-medium;
  }
  ul {
    @apply font-thin;
  }

  div a {
    @apply px-2;
    @apply font-thin;
  }

  a:hover {
    @apply transition;
    @apply delay-75;
    @apply text-gray-400;
  }
}
</style>
