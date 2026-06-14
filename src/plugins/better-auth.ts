import { auth } from "@/auth"
import { env } from "@/config/env"
import { fromNodeHeaders } from "better-auth/node"
import type { FastifyPluginAsync } from "fastify"

/**
 * Better Auth Fastify plugin.
 * - Decorates `fastify.auth` with the Better Auth instance.
 * - Proxies `/api/auth/*` to Better Auth's request handler.
 */
export const betterAuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("auth", auth)

  fastify.route({
    method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    url: "/api/auth/*",
    async handler(request, reply) {
      const url = new URL(request.url, env.BETTER_AUTH_URL)
      const headers = fromNodeHeaders(request.headers)

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      })

      const response = await auth.handler(req)

      reply.status(response.status)
      response.headers.forEach((value, key) => reply.header(key, value))
      return reply.send(response.body ? await response.text() : null)
    },
  })
}