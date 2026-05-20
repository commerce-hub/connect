# Repository Guidelines

## Project Structure & Module Organization

This repository is a Lit-based TypeScript SDK for the `<commerce-hub-connect>` web component. Main source lives in `src/commerce-hub-connect.ts`; shared implementation details are under `src/internal/`. Generated OpenAPI types live in `src/generated/openapi.ts` and should be regenerated, not hand-edited. Browser tests are colocated in `src/test/*_test.ts`. The local demo is in `dev/`, documentation sources are in `docs-src/`, and generated static docs are checked in under `docs/`.

## Build, Test, and Development Commands

- `npm i` installs project dependencies from `package-lock.json`.
- `npm run build` compiles TypeScript and emits package files at the repository root.
- `npm run build:watch` runs the compiler in watch mode while editing.
- `npm run serve` starts the web dev server; open `/dev/index.html` for the demo.
- `npm test` runs both development and production-mode browser tests.
- `npm run lint` runs `lit-analyzer` and ESLint.
- `npm run format` applies Prettier formatting.
- `npm run generate:client` regenerates `src/generated/openapi.ts` after `swagger.json` changes.
- `npm run docs` rebuilds generated docs and bundled documentation assets.

## Coding Style & Naming Conventions

Use TypeScript modules and Lit idioms already present in `src/`. Prettier enforces 2-space indentation, single quotes, trailing commas where valid in ES5, no bracket spacing, and always-parenthesized arrow parameters. ESLint and `tsconfig.json` enforce strict TypeScript settings, including no implicit `any`, no unused locals, and consistent casing. Keep private implementation in `src/internal/`, exported SDK types and public APIs in `src/commerce-hub-connect.ts`, and tests named with the `*_test.ts` suffix.

## Testing Guidelines

Tests use `@web/test-runner`, Playwright browsers, Mocha TDD style (`suite`, `test`), and `@open-wc/testing`. Add or update `src/test/*_test.ts` coverage for SDK behavior, rendering, API calls, and event contracts. Use `BROWSERS=chromium npm run test:dev` to narrow local runs when iterating, then run `npm test` before submitting.

## Commit & Pull Request Guidelines

Recent commits use short, direct subjects such as `SDK style updates`, `update models`, and `wip`; prefer concise imperative summaries that identify the changed surface. For pull requests, include a brief behavior summary, testing commands run, linked issue or ticket when available, and screenshots or recordings for visible widget or demo changes. Call out regenerated files such as `src/generated/openapi.ts` or `docs/` explicitly.

## Security & Configuration Tips

Do not commit secrets, merchant tokens, or real customer data. Keep API fixtures synthetic. The SDK has localhost-oriented defaults for local interaction flows; document any environment-specific URL or header assumptions in the PR.

## Codex Learnings

- 2026-05-20: Npm run lint passed: lit-analyzer 0 problems, ESLint clean.

- 2026-05-18: Verification: `npm run build passed`.

- 2026-05-18: Npm run build completed successfully.

- 2026-05-18: Npm run build && `npm test passed`.

- 2026-05-18: `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test`.js → 31 passed.

- 2026-05-16: Npm run build passed.

- 2026-05-15: Npm run build && `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test`.js passed: 23 passed, 0 failed.

- 2026-05-15: `BROWSERS=chromium npm run test:dev → 36 passed, 0 failed`.

- 2026-05-15: A mountCommerceHubConnect(...) helper would only be a convenience SDK API for consumers who want a React/Stripe-like imperative entrypoint:.

- 2026-05-15: If the helper is not intended to exist, then the concern is different: the tests are stale or were added ahead of an API decision and should be removed/rewritten to test the supported custom element API.
