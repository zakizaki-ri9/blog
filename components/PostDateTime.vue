<template>
  <time
    v-if="formatedPostedAt"
    :datetime="formatedPostedAt"
    class="font-thin text-xs text-gray-600"
    >{{ formatedPostedAt }}</time
  >
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import dayjs from 'dayjs'

type Props = {
  postedAt: string
}

const format = (datetime?: string) => {
  return datetime ? dayjs(datetime).format('YYYY-MM-DD') : undefined
}

export default defineComponent({
  props: {
    postedAt: {
      type: String,
      required: true,
    },
  },
  setup({ postedAt }: Props) {
    return { formatedPostedAt: format(postedAt) }
  },
})
</script>
