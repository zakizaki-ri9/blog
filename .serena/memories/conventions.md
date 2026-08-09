# conventions

- Respond and document in Japanese (`AGENTS.md`, `CLAUDE.md`).
- Paths in docs/comments: repo-relative (`blog/...`), never absolute user paths.
- ESLint: 2-space indent, double quotes, semicolons required, 1tbs braces.
- Naming: files kebab-case; components PascalCase; vars/functions camelCase; constants UPPER_SNAKE_CASE.
- Prefer Serena symbolic tools over full-file reads for TypeScript/Astro code exploration.
- TDD workflow per `AGENTS.md`: Red→Green→Refactor with Vitest; E2E with Playwright.
- Architecture guidance: `docs/coding-guidelines/` (ports/adapters, testability).
- Minimize scope; match existing patterns; comments only for non-obvious logic.
