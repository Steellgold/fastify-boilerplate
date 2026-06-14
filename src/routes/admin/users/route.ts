import { Permissions } from "@/constants/rbac"
import { usersController } from "@/controllers/users.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"
import { requirePermission } from "@/middlewares/require-role"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_USERS)] },
    usersController.list,
  )

  fastify.get(
    "/:id",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_USERS)] },
    usersController.getById,
  )

  fastify.post(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_USERS)] },
    usersController.create,
  )

  fastify.patch(
    "/:id",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_USERS)] },
    usersController.update,
  )

  fastify.delete(
    "/:id",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_USERS)] },
    usersController.remove,
  )
}

export default route