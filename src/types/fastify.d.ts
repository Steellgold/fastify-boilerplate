import type { auth } from "@/auth"
import "fastify"

declare module "fastify" {
  interface FastifyInstance {
    /** Better Auth instance, decorated by the `betterAuthPlugin`. */
    auth: typeof auth
  }

  interface FastifyRequest {
    /**
     * Authenticated user session, injected by `authMiddleware`.
     * `null` when no valid session is present.
     */
    auth: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> extends infer S
      ? {
          user: Omit<S["user"], "name"> & { name: string | null }
          session: S["session"]
        }
      : never
    | null
  }
}