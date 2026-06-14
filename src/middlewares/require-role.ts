import { hasAllPermissions, type Permission, type SystemRole } from "@/constants/rbac"
import { ForbiddenError } from "@/lib/errors"
import type { FastifyRequest } from "fastify"

/**
 * Factory that returns a Fastify `preHandler` guard.
 * Fails with 403 if the authenticated user lacks **all** the required permissions.
 */
export const requirePermission = (...permissions: Permission[]) =>
  async (request: FastifyRequest) => {
    const role = request.auth?.user.role as SystemRole | undefined
    if (!role || !hasAllPermissions(role, permissions)) {
      throw new ForbiddenError()
    }
  }

/**
 * Factory that returns a Fastify `preHandler` guard.
 * Fails with 403 if the authenticated user"s role is not in the allowed list.
 */
export const requireRole = (...roles: SystemRole[]) =>
  async (request: FastifyRequest) => {
    const role = request.auth?.user.role as SystemRole | undefined
    if (!role || !roles.includes(role)) {
      throw new ForbiddenError()
    }
  }