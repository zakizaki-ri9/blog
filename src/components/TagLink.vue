<script setup type="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    :to="`/tags/${props.label}`"
    target="_blank"
    class="text-gray-600 underline transition hover:text-gray-400"
  >
    #{{ props.label }}
  </NuxtLink>
</template>
