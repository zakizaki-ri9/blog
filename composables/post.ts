import { QueryBuilderWhere, ParsedContentInternalMeta } from '@nuxt/content/dist/runtime/types'

export type Post = {
  postedAt: string
  image?: string
  description: string
  tags: string[]
} & ParsedContentInternalMeta

type UrlParameter = {
  datetime: string
  slug: string
}

type WhereParameter = {
  tag: string
}

export async function fetchPost(
  urlParameter: UrlParameter
) {
  const { datetime, slug } = urlParameter
  return queryContent<Post>(`posts/${datetime}/${slug}`).findOne()
}

export async function fetchPosts(
  whereParameter?: WhereParameter
) {
  return await queryContent<Post>('posts')
    .sort({
      path: -1
    })
    .where(generateWhereParameter(whereParameter))
    .find()
}

const generateWhereParameter = (whereParameter?: WhereParameter): QueryBuilderWhere => {
  if (!whereParameter) return {}
  return {
    tags: { $in: [whereParameter.tag] },
  }
}
