import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    title: "タイトル未設定",
    description: "日記の概要をここに書く",
    date: undefined,
    slug: undefined,
    devOnly: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--title" && next) {
      args.title = next;
      index += 1;
      continue;
    }
    if (token === "--description" && next) {
      args.description = next;
      index += 1;
      continue;
    }
    if (token === "--date" && next) {
      args.date = next;
      index += 1;
      continue;
    }
    if (token === "--slug" && next) {
      args.slug = next;
      index += 1;
      continue;
    }
    if (token === "--dev-only" && next) {
      args.devOnly = next === "true";
      index += 1;
      continue;
    }
    if (token === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

function toDateString(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(input) {
  if (!input) {
    return toDateString(new Date());
  }

  const matched = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) {
    throw new Error("--date は YYYY-MM-DD 形式で指定してください");
  }

  const [year, month, day] = matched.slice(1).map((value) => Number(value));
  const parsed = new Date(`${input}T00:00:00`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() + 1 !== month ||
    parsed.getDate() !== day
  ) {
    throw new Error(`不正な日付です: ${input}`);
  }

  return input;
}

function toSlug(rawTitle) {
  const ascii = rawTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return ascii || "daily-note";
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function renderTemplate({ title, description, date, devOnly }) {
  return `---\ntitle: "${title}"\ndescription: "${description}"\npubDate: "${date}"\nmood: ""\nweather: ""\nlocation: ""\ndevOnly: ${devOnly}\n---\n\n今日の出来事をここに書く。\n\n- 気づき\n- やったこと\n- 明日やること\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = normalizeDate(args.date);
  const [year, month] = date.split("-");
  const slug = args.slug ? toSlug(args.slug) : toSlug(args.title);

  const targetDir = path.join("src", "content", "diary", year, month);
  const fileName = `${date}-${slug}.mdx`;
  const filePath = path.join(targetDir, fileName);

  if (await exists(filePath)) {
    throw new Error(`既に存在します: ${filePath}`);
  }

  const content = renderTemplate({
    title: args.title,
    description: args.description,
    date,
    devOnly: args.devOnly,
  });

  if (args.dryRun) {
    console.log(`[dry-run] ${filePath}`);
    console.log(content);
    return;
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(filePath, content, "utf8");

  console.log(`作成しました: ${filePath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
