import { getCollection } from "astro:content";

export async function getTagCount(): Promise<number> {
  const posts = await getCollection("blog");
  const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];
  return tags.length;
} 
