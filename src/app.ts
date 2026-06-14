import { env } from "@/config/env"
import { prisma } from "@/lib/prisma"
import { errorHandler } from "@/middlewares/error-handler"
import { autoRoutePlugin } from "@/plugins/auto-route"
import { betterAuthPlugin } from "@/plugins/better-auth"
import { corsPlugin } from "@/plugins/cors"
import { rateLimitPlugin } from "@/plugins/rate-limit"
import { swaggerPlugin } from "@/plugins/swagger"
import Fastify from "fastify"
import { asyncContextPlugin } from "./plugins/async-context"
import { auditLogPlugin } from "./plugins/audit-log"
import { healthPlugin } from "./plugins/health"
import { helmetPlugin } from "./plugins/helmet"
import { noiseRejectionPlugin } from "./plugins/noise-rejection"

/**
 * Create and configure the Fastify application.
 * Plugins are registered in order: CORS → Rate Limit → Better Auth → Swagger → Auto-route.
 */
 export const app = Fastify({
  forceCloseConnections: true,
  logger: {
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === "development"
      ? {
          transport: {
            target: "pino-pretty",
            options: { colorize: true },
          },
        }
      : {}),
  },
})

app.setErrorHandler(errorHandler)

app.addHook("onClose", async () => {
  await prisma.$disconnect()
})

await app.register(helmetPlugin)
await app.register(noiseRejectionPlugin)
await app.register(asyncContextPlugin)
await app.register(corsPlugin)
await app.register(rateLimitPlugin)
await app.register(healthPlugin)
await app.register(auditLogPlugin)
await app.register(betterAuthPlugin)
await app.register(swaggerPlugin)
await app.register(autoRoutePlugin)