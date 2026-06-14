import type { Prisma } from "@/generated/prisma/client"

export type { Prisma }

/** User model type from Prisma */
export type { UserModel as User } from "@/generated/prisma/models/User"

/** Session model type from Prisma */
export type { SessionModel as Session } from "@/generated/prisma/models/Session"

/** Account model type from Prisma */
export type { AccountModel as Account } from "@/generated/prisma/models/Account"

/** Verification model type from Prisma */
export type { VerificationModel as Verification } from "@/generated/prisma/models/Verification"

/** Transaction client used for Prisma interactive transactions */
export type PrismaTransactionClient = Prisma.TransactionClient;