# Stage 1 — Build
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma/ prisma/
COPY prisma.config.ts ./
RUN pnpm prisma generate

COPY tsconfig.json ./
COPY src/ src/
RUN pnpm build

# Stage 2 — Production
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY prisma.config.ts ./
COPY prisma/ prisma/
COPY --from=builder /app/dist/ dist/
COPY --from=builder /app/src/generated/ src/generated/

EXPOSE 3000

CMD ["node", "dist/server.js"]
