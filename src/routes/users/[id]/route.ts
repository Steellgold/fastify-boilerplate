import { Permissions } from "@/constants/rbac"
import { usersController } from "@/controllers/users.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"
import { requirePermission } from "@/middlewares/require-role"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.USER_READ)] },
    usersController.getById,
  )

  fastify.patch(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.USER_UPDATE)] },
    usersController.update,
  )

  fastify.delete(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.USER_DELETE)] },
    usersController.remove,
  )
}

export default route