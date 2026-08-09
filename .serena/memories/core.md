# core

- Personal Astro blog (`zaki-blog`), deployed to Vercel static.
- Site: https://zaki-blog.vercel.app/ ; dev: http://localhost:3000
- Content: MDX/Markdown via Astro Content Collections (`src/content/blog`, `src/content/pages`).
- Features: tags, RSS, sitemap, Pagefind search, OGP image generation, TIL pages.
- Agent docs: `mem:conventions`, `mem:tech_stack`, `mem:suggested_commands`, `mem:task_completion`.
- Layout map:
  - `src/pages/` routes (blog, tags, tils)
  - `src/components/`, `src/layouts/` UI
  - `src/utils/` (ogp, generateOgImage, tags)
  - `src/config/site.ts` site metadata
  - `astro.config.ts`, `content.config.ts` build/content config
- Tests: Vitest unit tests + Playwright E2E (`tests/`).
- Docs for agents: `AGENTS.md`, `docs/coding-guidelines/`.
