# AGENTS.md — Boilerplate API

## Quick start

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev          # tsx watch src/server.ts → http://localhost:3000
```

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Dev server with hot reload (`tsx watch`) |
| `pnpm build` | `tsc && tsc-alias` — resolves `@/*` path aliases for dist |
| `pnpm lint` / `pnpm typecheck` | Both = `tsc --noEmit` (no ESLint/Prettier) |
| `pnpm prisma:generate` | Generate Prisma client (required before build) |
| `pnpm prisma:migrate` | Run migrations |
| `pnpm prisma:seed` | `tsx prisma/seed.ts` |

**No test framework** is configured — do not add tests or run `pnpm test`.

## Key facts

- **pnpm** only — never use npm/yarn
- **Prisma 7** — schema lives in `prisma/schema/*.prisma`, uses `prisma.config.ts` (not `prisma/schema.prisma`)
- **ESM** — `"type": "module"` in package.json, `verbatimModuleSyntax` in tsconfig
- **Better Auth** — auth routes served at `/api/auth/*` by the better-auth plugin (not file-system routing)
- **Fastify 5** — `@fastify/*` scoped plugins, file-system routing via `plugins/auto-route.ts`

## Architecture

```
routes/ (HTTP verbs + path)
  → controllers/ (validation, response shape)
    → services/ (business logic, throws typed errors)
      → repositories/ (Prisma queries)
```

Route files in `src/routes/` are auto-discovered. Directory naming conventions:
- `[id]` → `:id`, `[[param]]` → `:param?`, `[...slug]` → `:slug*`

## Notable

- `User` model has **soft delete** (`deletedAt` field)
- Environment vars validated at startup via Zod in `src/config/env.ts`
- Swagger UI at `http://localhost:3000/docs`
- `prisma:generate` must run before `build` (Prisma types needed at compile time)
