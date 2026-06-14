# Fastify API Boilerplate

Production-ready TypeScript API starter with Fastify 5, Prisma, Better Auth, clean architecture, and file-system routing.

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Fastify 5](https://fastify.dev/) |
| **Language** | TypeScript (strict) |
| **ORM** | [Prisma](https://www.prisma.io/) + PostgreSQL |
| **Auth** | [Better Auth](https://better-auth.better-auth.com/) (email/password) |
| **Validation** | [Zod](https://zod.dev/) |
| **Runtime** | Node.js 22 + pnpm |

## Features

- **File-system routing** — Next.js-style directory-based route discovery (`[param]`, `[[optional]]`, `[...catchAll]`)
- **Clean architecture** — routes → controllers → services → repositories
- **RBAC** — granular permission system with role-to-permission mapping
- **Authentication** — session-based auth via Better Auth with email/password
- **Swagger / OpenAPI** — auto-generated API documentation
- **Error handling** — typed error hierarchy (`AppError` → `BadRequestError`, `NotFoundError`, etc.) with consistent JSON responses
- **Request validation** — environment variables validated at startup via Zod
- **Rate limiting** — built-in Fastify rate limiter
- **CORS** — configurable origins
- **Docker** — multi-stage production build + docker-compose (API + PostgreSQL)

## Project Structure

```
src/
├── config/           # Environment variables & app configuration
├── constants/        # System constants (RBAC roles/permissions)
├── controllers/      # Request handling & response formatting
├── lib/              # Shared utilities (Prisma client, custom errors)
├── middlewares/       # Fastify preHandlers (auth, RBAC, error handler)
├── plugins/          # Fastify plugins (CORS, rate-limit, Swagger, auth, auto-route)
├── repositories/     # Data access layer (Prisma queries)
├── routes/           # Route definitions (file-system based discovery)
│   ├── health/
│   ├── auth/
│   ├── users/
│   ├── admin/
│   └── examples/
├── schemas/          # Zod schemas (request/response validation)
├── services/         # Business logic layer
├── types/            # TypeScript type augmentation (Fastify declarations)
└── utils/            # Response helpers (success, paginated)
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL 17+

### Setup

```bash
# Clone & install
pnpm install

# Copy environment variables
cp .env.example .env

# Start PostgreSQL (Docker)
docker compose up -d postgres

# Apply migrations & generate Prisma client
pnpm prisma:migrate

# Seed the database
pnpm prisma:seed

# Start development server
pnpm dev
```

Server starts at `http://localhost:3000`.

### Docker (full stack)

```bash
docker compose up --build
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run compiled production build |
| `pnpm lint` | Type-check without emitting |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:studio` | Open Prisma Studio |
| `pnpm prisma:seed` | Seed database |

## Environment Variables

See `.env.example` for all variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `BETTER_AUTH_SECRET` | Auth secret (min 32 chars) | — |
| `BETTER_AUTH_URL` | Public URL of the API | `http://localhost:3000` |
| `CORS_ORIGIN` | Allowed origin (frontend URL) | `http://localhost:5173` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `127.0.0.1` |
| `LOG_LEVEL` | Logger level | `info` |

## API Documentation

When the server is running, Swagger UI is available at:

```
http://localhost:3000/docs
```

## Routing Convention

Routes are auto-discovered from `src/routes/` using the file-system:

```
src/routes/
├── health/
│   └── route.ts          →  GET /health
├── users/
│   └── route.ts          →  GET /users, POST /users
├── admin/
│   └── users/
│       └── route.ts      →  GET /admin/users
└── examples/
    └── [...slug]/
        └── route.ts      →  GET /examples/*
```

Dynamic segments: `[id]` → `:id`, `[[param]]` → `:param?`, `[...slug]` → `:slug*`

## Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

## License

MIT