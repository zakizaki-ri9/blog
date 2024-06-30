<template>
  <article :class="$style.article">
    <ContentDoc v-slot="{ doc }">
      <PostDateTime :posted-at="doc.postedAt" />
      <h1 class="text-3xl font-bold">
        {{ doc.title }}
      </h1>
      <div
        v-if="doc.tags"
        class="flex flex-wrap gap-1 text-sm my-1"
      >
        <TagLink
          v-for="tag in doc.tags"
          :key="tag"
          :label="tag"
        />
      </div>
      <ContentRenderer :value="doc" />
    </ContentDoc>
  </article>
</template>

<script setup lang="ts">
import { Site } from "@/constants"

const { path } = useRoute()
const { data } = await useAsyncData(path, () => {
  return queryContent().where({ _path: path }).findOne()
})

useHead(() => {
  if (!data.value) {
    return {}
  }
  return {
    title: data.value.title,
    meta: [
      {
        name: "description",
        content: data.value.description,
      },
      {
        name: "og:type",
        content: "article",
      },
      {
        name: "og:url",
        content: `${Site.rootUrl}${data.value.path}`.replace("//", "/"),
      },
      {
        name: "og:type",
        content: "website",
      },
      {
        name: "og:title",
        content: `${Site.title} - ${data.value.title}`,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: data.value.image || Site.defaultImage,
      },
      {
        name: "og:description",
        content: data.value.description,
      },
    ],
    script: [
      data.value?.iframely
        ? {
            async: true,
            src: "//iframely.net/embed.js",
          }
        : {},
    ],
  }
})
</script>

<style lang="scss" module>
.article {
  h1 {
    font-weight: 900;
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.75rem;
    margin-top: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    line-height: 1.75rem;
    margin-top: 4rem;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1rem;
    line-height: 1.5rem;
    margin-top: 4rem;
    margin-bottom: 1rem;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  ul {
    padding-left: 1rem;
  }

  li {
    list-style: inside;
    list-style-type: circle;
    line-height: 1.7;
  }

  .footnotes {
    font-weight: 200;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .footnotes ol {
    margin-top: 1rem;
    counter-reset: count;
  }

  .footnotes li {
    list-style-type: none;
  }

  .footnotes li:before {
    list-style-type: none;
    counter-increment: count;
    content: counter(count);
    margin-right: 0.5rem;
  }

  a {
    color: #007fb1;
  }

  a:hover {
    color: #99cfe5;
  }
}
</style>
