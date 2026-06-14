import { env } from "@/config/env"
import { errorHandler } from "@/middlewares/error-handler"
import { autoRoutePlugin } from "@/plugins/auto-route"
import { betterAuthPlugin } from "@/plugins/better-auth"
import { corsPlugin } from "@/plugins/cors"
import { rateLimitPlugin } from "@/plugins/rate-limit"
import { swaggerPlugin } from "@/plugins/swagger"
import Fastify from "fastify"

/**
 * Create and configure the Fastify application.
 * Plugins are registered in order: CORS → Rate Limit → Better Auth → Swagger → Auto-route.
 */
export const buildApp = async () => {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      ...(env.NODE_ENV === "development"
        ? { transport: { target: "pino-pretty", options: { colorize: true } } }
        : {}),
    },
  })

  app.setErrorHandler(errorHandler)

  await app.register(corsPlugin)
  await app.register(rateLimitPlugin)
  await app.register(betterAuthPlugin)
  await app.register(swaggerPlugin)
  await app.register(autoRoutePlugin)

  return app
}