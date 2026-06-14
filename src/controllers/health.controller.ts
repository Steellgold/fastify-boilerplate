import type { FastifyReply, FastifyRequest } from "fastify"

/** Simple health-check endpoint. Returns current server timestamp. */
export const healthController = {
  check: async (_request: FastifyRequest, reply: FastifyReply) =>
    reply.send({
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    }),
}