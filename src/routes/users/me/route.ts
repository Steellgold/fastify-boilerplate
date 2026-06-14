import { usersController } from "@/controllers/users.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { preHandler: [authMiddleware] },
    usersController.getSelf,
  )

  fastify.patch(
    "/",
    { preHandler: [authMiddleware] },
    usersController.updateSelf,
  )
}

export default route