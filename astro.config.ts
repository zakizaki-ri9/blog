// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercelStatic from "@astrojs/vercel/static"

// https://astro.build/config
export default defineConfig({
	output: "static",
	adapter: vercelStatic({}),
	site: "https://zaki-blog.vercel.app/",
	integrations: [mdx(), sitemap()],
	vite: {
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	}
});
