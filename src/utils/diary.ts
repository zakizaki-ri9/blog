import { type CollectionEntry, getCollection } from "astro:content";

type DiaryEntry = CollectionEntry<"diary">;

const isDevOrTest = import.meta.env.DEV || import.meta.env.MODE === "test";

export function toDiarySlug(entry: DiaryEntry): string {
  const idWithoutExtension = entry.id.replace(/\.mdx?$/, "");
  const parts = idWithoutExtension.split("/");
  return parts.at(-1) ?? idWithoutExtension;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function validateUniquePubDate(entries: DiaryEntry[]): void {
  const grouped = new Map<string, string[]>();

  for (const entry of entries) {
    const key = toDateKey(entry.data.pubDate);
    const ids = grouped.get(key) ?? [];
    ids.push(entry.id);
    grouped.set(key, ids);
  }

  const duplicates = [...grouped.entries()].filter(([, ids]) => ids.length > 1);
  if (duplicates.length === 0) {
    return;
  }

  const details = duplicates
    .map(([date, ids]) => `${date}: ${ids.join(", ")}`)
    .join(" | ");

  throw new Error(`diaryのpubDateが重複しています。${details}`);
}

export function sortDiaryEntries(entries: DiaryEntry[]): DiaryEntry[] {
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function shouldIncludeDiaryEntry(entry: DiaryEntry): boolean {
  return !entry.data.devOnly || isDevOrTest;
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  const entries = await getCollection("diary");
  validateUniquePubDate(entries);
  return sortDiaryEntries(entries.filter(shouldIncludeDiaryEntry));
}
