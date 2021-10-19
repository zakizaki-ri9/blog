import { contentFunc } from '@nuxt/content/types/content'

export type Post = {
  postedAt: Date
  title: string
  description: string
  tags?: string[]
  image?: string
}

type UrlParameter = {
  datetime: string
  slug: string
}

export async function fetchPost(
  $content: contentFunc,
  urlParameter: UrlParameter
) {
  const { datetime, slug } = urlParameter
  const fetchedPost = await $content(`posts/${datetime}/${slug}`, {
    deep: true,
  }).fetch<Post>()
  if (!fetchedPost || Array.isArray(fetchedPost)) {
    return null
  }
  return fetchedPost
}

export async function fetchPosts($content: contentFunc) {
  const contents = await $content('posts', { deep: true })
    .sortBy('path', 'desc')
    .fetch<Post>()
  if (contents && Array.isArray(contents)) return contents
  return []
}
