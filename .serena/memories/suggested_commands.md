# suggested_commands

- Install: `pnpm install`
- Dev server: `pnpm dev` (port 3000)
- Build: `pnpm build` (runs `pagefind --site dist` via postbuild)
- Preview prod build: `pnpm preview`
- Lint: `pnpm lint` / fix: `pnpm lint:fix`
- Type check: `pnpm type-check`
- Full review gate: `pnpm review` (lint + type-check + security-check)
- E2E: `pnpm test:e2e`
- Daily script: `pnpm daily`
- Serena memory lint: `uvx --from serena-agent==1.6.1 serena memories check` (from repo root)
