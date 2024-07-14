<template>
  <header
    class="flex w-full"
    :class="$style.header"
  >
    <h2 class="mr-auto text-xl font-medium">
      <NuxtLink to="/">
        zaki blog
      </NuxtLink>
    </h2>
    <div class="flex justify-end items-center">
      <NuxtLink
        to="https://twitter.com/zucky_sub"
        target="_blank"
      >
        <div class="i-tabler-brand-github" />
      </NuxtLink>
      <NuxtLink
        to="https://github.com/zakizaki-ri9"
        target="_blank"
      >
        <div class="i-tabler-brand-x" />
      </NuxtLink>
      <NuxtLink
        to="https://kic-yuuki.hatenablog.com/"
        target="_blank"
      >
        Hatena
      </NuxtLink>
      <!-- <NuxtLink
        href="/feed.xml"
        target="_blank"
      >
        RSS
      </NuxtLink> -->
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  a {
    @apply px-2 font-thin;

    &:hover {
      @apply transition delay-75 text-gray-400;
    }
  }
}
</style>
