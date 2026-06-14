import { env } from "@/config/env"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import type { FastifyPluginAsync } from "fastify"

/**
 * Swagger / OpenAPI documentation plugin.
 * Serves:
 * - JSON spec at `GET /docs/json`
 * - Interactive UI at `GET /docs`
 */
export const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Boilerplate API",
        description: "Fastify + Prisma + Better Auth backend",
        version: "0.1.0",
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  })

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  })
}