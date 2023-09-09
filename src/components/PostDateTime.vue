<script setup lang="ts">
const props = defineProps<{
  postedAt: string | null
}>()

// const { dateFormat } = useDateFormat()
// const formattedPostedAt = props.postedAt ? dateFormat(props.postedAt) : ""
const formattedPostedAt = props.postedAt
</script>


<template>
  <time
    v-if="formattedPostedAt"
    :datetime="formattedPostedAt"
    class="font-thin text-xs text-gray-600"
    >{{ formattedPostedAt }}</time
  >
</template>

