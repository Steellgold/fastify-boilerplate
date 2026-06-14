import { UnauthorizedError } from "@/lib/errors"
import { fromNodeHeaders } from "better-auth/node"
import type { FastifyRequest } from "fastify"

/**
 * Fastify `preHandler` that extracts the current user session via Better Auth.
 * Injects `request.userSession` on success, throws 401 otherwise.
 */
export const authMiddleware = async (request: FastifyRequest) => {
  const session = await request.server.auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  })

  if (!session) throw new UnauthorizedError()

  request.userSession = {
    user: {
      ...session.user,
      name: session.user.name ?? null,
      role: (session.user as { role?: string }).role ?? "user",
    },
    session: session.session,
  }
}