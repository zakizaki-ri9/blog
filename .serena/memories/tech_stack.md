# tech_stack

- Runtime/build: Astro 6.x, TypeScript 6.x, Vite 8.x
- Package manager: pnpm 9.4.0 (use `pnpm`, not npm/yarn)
- Content: `@astrojs/mdx`, Content Collections
- Deploy: `@astrojs/vercel` (static), Vercel
- Search: Pagefind (`postbuild` indexes `dist/`)
- OGP: satori + resvg-js + sharp (`src/utils/generateOgImage.ts`)
- Lint/format gate: ESLint 10 + `@typescript-eslint` + `eslint-plugin-astro`
- E2E: Playwright (`@playwright/test`)
- Path alias: `@/*` → `src/*` (tsconfig)
- Language backend for Serena: typescript only
