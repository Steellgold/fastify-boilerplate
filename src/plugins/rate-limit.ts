import rateLimit from "@fastify/rate-limit"
import type { FastifyPluginAsync } from "fastify"

/**
 * Rate limiting plugin.
 * Protects routes from brute-force / DDoS by limiting requests per time window.
 * Adjust `max` and `timeWindow` in production as needed.
 */
export const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  })
}