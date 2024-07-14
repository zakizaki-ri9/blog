<script setup lang="ts">
import "@unocss/reset/tailwind.css"
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
</style>
