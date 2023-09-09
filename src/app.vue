<script>
import "modern-css-reset/dist/reset.min.css"
</script>

<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
body {
  @apply bg-gray-100;
  @apply text-gray-800;
  @apply text-sm;
  @apply font-light;
}

header {
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
