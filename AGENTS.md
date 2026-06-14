# AGENTS.md — Boilerplate API

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server with hot reload (`tsx watch src/server.ts`) |
| `pnpm build` | `tsc && tsc-alias` — resolves `@/*` path aliases for dist |
| `pnpm lint` / `pnpm typecheck` | `tsc --noEmit` (no ESLint/Prettier) |
| `pnpm prisma:generate` | Generate Prisma client (required before `build`) |
| `pnpm prisma:migrate` | Run `prisma migrate dev` |
| `pnpm prisma:seed` | `tsx prisma/seed.ts` |

**No test framework** — do not add tests or run `pnpm test`.

## Architecture

```
plugins/ (manually registered in app.ts)
  ├─ auto-route.ts  — discovers routes/ folder
  ├─ better-auth.ts — proxies /api/auth/* to Better Auth handler
  ├─ health.ts      — GET /health with DB check
  ├─ helmet.ts      — security headers
  ├─ async-context.ts — AsyncLocalStorage per-request context
  ├─ audit-log.ts   — fastify.auditLog.log() decorator
  ├─ cors.ts / rate-limit.ts / swagger.ts

routes/ (auto-discovered, must export default FastifyPluginAsync)
  → controllers/ (validation, response shape)
    → services/ (business logic, throws AppError subclasses)
      → repositories/ (Prisma queries)
```

## Routes

```
GET  /health          (health plugin, no auth)
GET  /user            auth → self profile
PATCH /user           auth → update self profile
GET  /users           USER_LIST   → paginated list
POST /users           USER_CREATE → create user
GET  /users/:id       USER_READ   → user by id
PATCH /users/:id      USER_UPDATE → update user
DELETE /users/:id     USER_DELETE → soft-delete user
GET  /users/me        auth → self profile (legacy, same as /user)
PATCH /users/me       auth → update self profile (legacy)
GET  /admin/users     ADMIN_MANAGE_USERS → list all
GET  /admin/users/:id ADMIN_MANAGE_USERS
POST /admin/users     ADMIN_MANAGE_USERS
PATCH /admin/users/:id ADMIN_MANAGE_USERS (can change role)
DELETE /admin/users/:id ADMIN_MANAGE_USERS (soft-delete)
GET  /admin/audit-logs ADMIN_MANAGE_SYSTEM → paginated, filterable
/api/auth/*          proxied to Better Auth handler
```

Route files: `[id]` → `:id`, `[[param]]` → `:param?`, `[...slug]` → `:slug*`

## Key facts

- **pnpm only** — never use npm/yarn
- **ESM** — `"type": "module"`, `verbatimModuleSyntax` in tsconfig (use `import type` for types)
- **Prisma 7** — multi-file schema in `prisma/schema/` (not `prisma/schema.prisma`), uses `prisma.config.ts` and `@prisma/adapter-pg`
- **Fastify 5** — `@fastify/*` scoped plugins, augment types in `src/types/fastify.d.ts`
- **Better Auth** — auth routes at `/api/auth/*` via plugin, email/password only, `role` as additional field
- **Zod 4** — use `z.treeifyError(error)` for validation errors, not `.flatten()`
- **Soft delete** — `User` model uses `deletedAt`, all queries exclude deleted records
- **RBAC** — roles: `user` → `member` → `admin`, permissions defined in `src/constants/rbac.ts`
- **Rate limit** — global 100 req/min via `@fastify/rate-limit`; pnpm may drop it on install, re-add if missing
- **Environment vars** — validated at startup via Zod in `src/config/env.ts`, fails fast with `process.exit(1)`
- **No ESLint/Prettier** — only `tsc --noEmit` for quality checks

## Async context

```ts
import { getContext } from "@/plugins/async-context"

getContext()  // { requestId, userId, userEmail, userRole, ipAddress, userAgent }
```

Available in any layer (services, repositories) without passing `request`. Plugin must be registered first in `app.ts`.

## Audit log

```ts
// In a controller, after the action succeeds:
request.server.auditLog.log("user.create", "User", user.id, { email: parsed.data.email })

// Actions defined in src/constants/audit-log/ with typed payload per action
// Auto-attaches actorId, IP, userAgent from async-context
```

Add new actions by creating a file in `src/constants/audit-log/` exporting a const object and `AuditPayloadMap` interface, then merging in `index.ts`.
