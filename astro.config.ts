// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercelStatic from "@astrojs/vercel/static";
import createOgImages from "./src/integrations/og-image";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercelStatic({}),
  site: "https://zaki-blog.vercel.app/",
  integrations: [
    mdx(), 
    sitemap(),
    createOgImages(),
    pagefind(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
