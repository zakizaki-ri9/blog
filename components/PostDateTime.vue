<template>
  <time
    v-if="formatedPostedAt"
    :datetime="formatedPostedAt"
    class="font-thin text-xs text-gray-600"
    >{{ formatedPostedAt }}</time
  >
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const { postedAt } = defineProps({
  postedAt: {
    type: String,
    required: true,
  },
})

const format = (datetime?: string) => {
  return datetime ? dayjs(datetime).format('YYYY-MM-DD') : undefined
}

const formatedPostedAt = format(postedAt)
</script>
