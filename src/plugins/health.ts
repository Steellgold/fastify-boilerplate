import { prisma } from "@/lib/prisma"
import type { FastifyPluginAsync } from "fastify"

export const healthPlugin: FastifyPluginAsync = async (fastify) => {
  let startTime = Date.now()

  fastify.addHook("onListen", () => {
    startTime = Date.now()
  })

  fastify.get("/health", async (_request, reply) => {
    let dbStatus = "connected"
    try {
      await prisma.$queryRawUnsafe("SELECT 1")
    } catch {
      dbStatus = "disconnected"
    }

    const status = dbStatus === "connected" ? "ok" : "degraded"
    const code = dbStatus === "connected" ? 200 : 503

    return reply.code(code).send({
      success: true,
      data: {
        status,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
    })
  })
}