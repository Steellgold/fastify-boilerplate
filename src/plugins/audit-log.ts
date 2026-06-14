import type { AuditAction, AuditPayloadFor } from "@/constants/audit-log"
import { prisma } from "@/lib/prisma"
import { getContext } from "@/plugins/async-context"
import type { FastifyPluginAsync } from "fastify"

export const auditLogPlugin: FastifyPluginAsync = async (fastify) => {
  const log = async <A extends AuditAction>(
    action: A,
    entity: string,
    entityId?: string,
    metadata?: AuditPayloadFor<A>,
  ): Promise<void> => {
    try {
      const ctx = getContext()

      await prisma.auditLog.create({
        data: {
          action,
          entity,
          entityId: entityId ?? null,
          actorId: ctx.userId,
          actorEmail: ctx.userEmail,
          actorRole: ctx.userRole,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
          metadata: metadata ?? undefined,
        },
      })
    } catch (err) {
      fastify.log.error({ err, action }, "Failed to write audit log")
    }
  }

  fastify.decorate("auditLog", { log })
}

declare module "fastify" {
  interface FastifyInstance {
    auditLog: {
      log: <A extends AuditAction>(
        action: A,
        entity: string,
        entityId?: string,
        metadata?: AuditPayloadFor<A>,
      ) => Promise<void>
    }
  }
}