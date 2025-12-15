import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// 画像の幅と高さ
const WIDTH = 1200;
const HEIGHT = 630;

// フォントデータを読み込む
const loadFonts = async () => {
  const notoSansJPRegular = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.17/files/noto-sans-jp-japanese-500-normal.woff",
  ).then((res) => res.arrayBuffer());

  const notoSansJPBold = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.0.17/files/noto-sans-jp-japanese-700-normal.woff",
  ).then((res) => res.arrayBuffer());

  return {
    regular: notoSansJPRegular,
    bold: notoSansJPBold,
  };
};

export const generateOgImage = async (
  slug: string,
  title: string,
  description: string,
) => {
  // 出力先のディレクトリを作成
  const outputDir = join(process.cwd(), "public", "og-images");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // フォントを読み込む
  const fonts = await loadFonts();

  // SVGを生成
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f6f6f6",
          fontFamily: "Noto Sans JP",
          padding: "40px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                padding: "25px",
                width: "100%",
                height: "100%",
                borderRadius: "15px",
                backgroundColor: "white",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "48px",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "20px",
                      lineHeight: 1.4,
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#666",
                      marginBottom: "30px",
                      lineHeight: 1.6,
                    },
                    children: description,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginTop: "auto",
                      color: "#2337ff", // アクセントカラー
                      fontSize: "20px",
                    },
                    children: "zaki-blog.vercel.app",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fonts.regular,
          weight: 500,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: fonts.bold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  // SVGをPNGに変換
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // 出力ファイルパス
  const outputFilePath = join(outputDir, `${slug}.png`);

  // PNGファイルとして保存
  await sharp(pngBuffer)
    .png()
    .toFile(outputFilePath);

  // 相対パスを返す
  return `/og-images/${slug}.png`;
}; 