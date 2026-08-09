# task_completion

Before marking a task done:
1. `pnpm lint`
2. `pnpm type-check`
3. Run relevant tests (unit and/or `pnpm test:e2e` if UI/routing affected)
4. Update Serena memories if design decisions changed (`mem:core` graph)
5. Offer `/all-commit` workflow for branch/commit/PR when implementation complete

Security: run `pnpm security-check` for dependency changes.
Do not commit unless user explicitly requests.
