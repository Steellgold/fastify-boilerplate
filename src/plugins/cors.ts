import { env } from "@/config/env"
import fastifyCors from "@fastify/cors"
import type { FastifyPluginAsync } from "fastify"

/** CORS configuration using `@fastify/cors`. */
export const corsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  })
}