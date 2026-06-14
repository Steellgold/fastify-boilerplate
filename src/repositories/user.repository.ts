import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/** Data-access layer for the `User` model. */
export const userRepository = {
  /** Return a paginated list of non-deleted users. */
  findAll: ({ skip, take }: { skip: number; take: number }) =>
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null },
    }),

  /** Count non-deleted users. */
  count: () => prisma.user.count({ where: { deletedAt: null } }),

  /** Find a user by primary key (excluding soft-deleted). */
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id, deletedAt: null } }),

  /** Find a user by email (included deleted records). */
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  /** Create a user inside a transaction. */
  create: (tx: Prisma.TransactionClient, data: { name: string; email: string }) =>
    tx.user.create({ data }),

  /** Partial update for an existing user. */
  update: (id: string, data: { name?: string; email?: string }) =>
    prisma.user.update({ where: { id }, data }),

  /** Soft-delete a user by setting `deletedAt`. */
  softDelete: (id: string) =>
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
}