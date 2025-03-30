import type { AstroConfig, AstroIntegration } from "astro";
import fs from "fs";
import path from "path";
import { generateOgImage } from "../utils/generateOgImage";

export default function createOgImages(): AstroIntegration {
  return {
    name: "astro-og-images",
    hooks: {
      "astro:build:done": async ({ logger }) => {
        try {
          logger.info("🖼️ OGP画像の生成を開始します...");
          
          // contentディレクトリのパス
          const contentDir = path.join(process.cwd(), "src", "content", "blog");
          
          // OGP画像の出力先ディレクトリ
          const ogImageDir = path.join(process.cwd(), "public", "og-images");
          
          // OGP画像ディレクトリが存在しない場合は作成
          if (!fs.existsSync(ogImageDir)) {
            fs.mkdirSync(ogImageDir, { recursive: true });
          }
          
          // ブログ記事のファイル一覧を取得
          const files = fs.readdirSync(contentDir).filter(file => file.endsWith(".mdx") || file.endsWith(".md"));
          
          let generatedCount = 0;
          let skippedCount = 0;
          
          for (const file of files) {
            // ファイルの内容を読み込む
            const filePath = path.join(contentDir, file);
            const content = fs.readFileSync(filePath, "utf-8");
            
            // slugを生成（ファイル名から拡張子を削除）
            const slug = file.replace(/\.mdx?$/, "");
            
            // OGP画像のパス
            const ogImagePath = path.join(ogImageDir, `${slug}.png`);
            
            // 画像がすでに存在するかチェック
            if (fs.existsSync(ogImagePath)) {
              logger.info(`⏭️ "${slug}" のOGP画像はすでに存在するためスキップします`);
              skippedCount++;
              continue;
            }
            
            // frontmatterからtitleとdescriptionを抽出
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
              logger.warn(`${file}からfrontmatterを抽出できませんでした`);
              continue;
            }
            
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title: ["'](.+?)["']/);
            const descriptionMatch = frontmatter.match(/description: ["'](.+?)["']/);
            
            if (!titleMatch || !descriptionMatch) {
              logger.warn(`${file}からtitleまたはdescriptionを抽出できませんでした`);
              continue;
            }
            
            const title = titleMatch[1];
            const description = descriptionMatch[1];
            
            logger.info(`📝 "${title}" のOGP画像を生成中...`);
            
            // OGP画像を生成して保存し、パスを取得
            await generateOgImage(slug, title, description);
            generatedCount++;
            
            logger.info(`✅ OGP画像を生成しました: /og-images/${slug}.png`);
          }
          
          logger.info(`🎉 OGP画像の生成が完了しました！(生成: ${generatedCount}件, スキップ: ${skippedCount}件)`);
        } catch (error) {
          logger.error("OGP画像の生成中にエラーが発生しました");
          if (error instanceof Error) {
            logger.error(error.message);
          } else {
            logger.error(String(error));
          }
        }
      },
    },
  };
} 