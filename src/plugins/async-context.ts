import { AsyncLocalStorage } from "async_hooks"
import type { FastifyPluginAsync, FastifyRequest } from "fastify"

export type RequestContext = {
  requestId: string
  userId: string | null
  userEmail: string | null
  userRole: string | null
  ipAddress: string
  userAgent: string
}

const storage = new AsyncLocalStorage<RequestContext>()

export const getContext = (): RequestContext => {
  const ctx = storage.getStore()
  if (!ctx) throw new Error("RequestContext not available — are you using asyncContextPlugin?")
  return ctx
}

export const asyncContextPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", (request: FastifyRequest, _reply, done) => {
    const ctx: RequestContext = {
      requestId: request.id,
      userId: request.auth.user.id ?? null,
      userEmail: request.auth.user.email ?? null,
      userRole: request.auth.user.role ?? null,
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"] ?? "",
    }

    storage.run(ctx, () => done())
  })
}