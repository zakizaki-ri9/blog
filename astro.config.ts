// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercelStatic from "@astrojs/vercel/static"
import { loadEnv } from 'vite'

const env = loadEnv("", process.cwd(), '');

// https://astro.build/config
export default defineConfig({
	output: "static",
	adapter: vercelStatic({}),
	site: env.VERCEL_URL || "http://localhost:3000",
	// site: "https://zaki-blog.vercel.app/",
	integrations: [mdx(), sitemap()],
	vite: {
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	}
});
