import { Permissions } from "@/constants/rbac"
import { auditLogController } from "@/controllers/audit-log.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"
import { requirePermission } from "@/middlewares/require-role"
import type { FastifyPluginAsync } from "fastify"

const route: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/",
    { preHandler: [authMiddleware, requirePermission(Permissions.ADMIN_MANAGE_SYSTEM)] },
    auditLogController.list,
  )
}

export default route