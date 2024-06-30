<script setup lang="ts">
const props = defineProps<{
  postedAt: string | null
}>()

const formattedPostedAt = props.postedAt
  ? new Date(props.postedAt).toISOString().substring(0, 10)
  : ""
</script>

<template>
  <time
    v-if="formattedPostedAt"
    :datetime="formattedPostedAt"
    class="font-thin text-xs text-gray-600"
  >
    {{ formattedPostedAt }}
  </time>
</template>
