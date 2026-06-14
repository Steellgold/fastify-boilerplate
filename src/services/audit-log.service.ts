import type { Prisma } from "@/generated/prisma/client"
import { auditLogRepository } from "@/repositories/audit-log.repository"
import type { ListAuditLogsQuery } from "@/schemas/audit-log.schema"

export const auditLogService = {
  findAll: async (query: ListAuditLogsQuery) => {
    const skip = (query.page - 1) * query.limit

    const where: Prisma.AuditLogWhereInput = {}
    if (query.action) where.action = query.action
    if (query.actorId) where.actorId = query.actorId
    if (query.entity) where.entity = query.entity
    if (query.entityId) where.entityId = query.entityId

    const [data, total] = await Promise.all([
      auditLogRepository.findAll({ skip, take: query.limit, where }),
      auditLogRepository.count(where),
    ])

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total
      }
    }
  },
}