// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import createOgImages from "./src/integrations/og-image";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercel({}),
  site: "https://zaki-blog.vercel.app/",
  integrations: [
    mdx(), 
    sitemap(),
    createOgImages(),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
