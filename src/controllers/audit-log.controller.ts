import { ValidationError } from "@/lib/errors"
import { listAuditLogsQuery } from "@/schemas/audit-log.schema"
import { auditLogService } from "@/services/audit-log.service"
import { paginatedResponse } from "@/utils/response"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export const auditLogController = {
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = listAuditLogsQuery.safeParse(request.query)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    const result = await auditLogService.findAll(parsed.data)
    return reply.send(paginatedResponse(result.data, result.meta))
  },
}