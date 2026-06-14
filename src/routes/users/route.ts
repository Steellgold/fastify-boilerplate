import { Permissions } from "@/constants/rbac"
import { usersController } from "@/controllers/users.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"
import { requirePermission } from "@/middlewares/require-role"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.USER_LIST)] },
    usersController.list,
  )

  fastify.post(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.USER_CREATE)] },
    usersController.create,
  )
}

export default route