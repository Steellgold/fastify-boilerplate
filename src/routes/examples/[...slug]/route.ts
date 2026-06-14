import { authMiddleware } from "@/middlewares/auth.middleware"
import type { FastifyPluginAsync } from "fastify"

type RouteParams = {
  Params: {
    slug: string
  }
}

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get<RouteParams>(
    "/",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const { slug } = request.params
      return reply.send({
        success: true,
        data: { slug: slug?.split("/").filter(Boolean) ?? [] },
      })
    },
  )
}

export default route