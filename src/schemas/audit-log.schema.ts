import { z } from "zod"

export const listAuditLogsQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  action: z.string().optional(),
  actorId: z.string().optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
})

export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuery>