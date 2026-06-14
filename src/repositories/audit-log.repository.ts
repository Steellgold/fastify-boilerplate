import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const auditLogRepository = {
  findAll: (args: { skip: number; take: number; where?: Prisma.AuditLogWhereInput }) =>
    prisma.auditLog.findMany({
      skip: args.skip,
      take: args.take,
      where: args.where,
      orderBy: { createdAt: "desc" },
    }),

  count: (where?: Prisma.AuditLogWhereInput) =>
    prisma.auditLog.count({ where }),
}