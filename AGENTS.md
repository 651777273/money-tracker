# Repository Guidelines

## Project Structure & Module Organization

This is a small Next.js app using the App Router, React, Tailwind CSS, and Prisma with SQLite. Application UI lives in `app/`, with the main page at `app/page.tsx`, shared layout in `app/layout.tsx`, global styles in `app/globals.css`, and feature UI in `app/components/`. API handlers are under `app/api/records/`, including `route.ts` for collection operations and `[id]/route.ts` for single-record operations. Prisma configuration is in `prisma/schema.prisma`, and the shared Prisma client helper is in `lib/prisma.ts`.

## Build, Test, and Development Commands

- `npm run dev`: generates the Prisma client, then starts the local Next.js dev server.
- `npm run build`: generates the Prisma client and creates a production build.
- `npm run start`: serves the production build after `npm run build`.
- `npm run lint`: runs Next.js linting.
- `npm run db:push`: applies the Prisma schema to the configured SQLite database.
- `npm run db:studio`: opens Prisma Studio for local data inspection.

Keep `DATABASE_URL` in `.env`; use `.env.example` as the template for required local variables.

## Coding Style & Naming Conventions

Use TypeScript with strict mode enabled. Prefer functional React components and hooks, as in `app/components/MoneyTracker.tsx`. Use PascalCase for components and exported types, camelCase for functions and variables, and kebab-free route folders that follow Next.js conventions. Keep imports grouped by external packages first, then local modules. Use two-space indentation in JSON and config files; match the existing style in TSX files. Prefer the `@/*` path alias from `tsconfig.json` for root-relative imports when paths become nested.

## Testing Guidelines

No test framework is currently configured. When adding tests, colocate component tests near the relevant component or add route tests under a clear `__tests__/` folder. Name tests after the behavior under test, for example `records-api.test.ts` or `MoneyTracker.test.tsx`. Until automated tests are added, run `npm run lint` and manually verify record creation, deletion, filtering, and chart updates in the browser.

## Commit & Pull Request Guidelines

The current history uses concise, imperative commit messages, for example `Initialize money tracker app`. Continue that style: describe the change in present tense and keep the subject focused. Pull requests should include a short summary, verification steps such as `npm run lint` or `npm run build`, screenshots for UI changes, and notes for any Prisma schema or environment variable changes.

## Agent-Specific Instructions

Avoid committing generated build output such as `.next/`, `node_modules/`, local SQLite files, or log files. Do not overwrite `.env` values; update `.env.example` when configuration requirements change.
