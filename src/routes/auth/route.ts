import type { FastifyPluginAsync } from "fastify"

/**
 * Placeholder route to register the `/auth` prefix.
 * Actual auth handling is done by `betterAuthPlugin` at `/api/auth/*`.
 */
const route: FastifyPluginAsync = async (_fastify) => {}

export default route