import type { Prisma } from "@/generated/prisma/client"
import { ConflictError, NotFoundError } from "@/lib/errors"
import { prisma } from "@/lib/prisma"
import { userRepository } from "@/repositories/user.repository"
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from "@/schemas/users.schema"

/** Business logic for user management. */
export const usersService = {
  /** Paginated list of users. */
  findAll: async (query: ListUsersQuery) => {
    const skip = (query.page - 1) * query.limit

    const [data, total] = await Promise.all([
      userRepository.findAll({ skip, take: query.limit }),
      userRepository.count(),
    ])

    return { data, meta: { page: query.page, limit: query.limit, total } }
  },

  /** Single user by ID. Throws 404 if not found. */
  findById: async (id: string) => {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("User")
    return user
  },

  /** Create a new user. Throws 409 if the email is already taken. */
  create: async (input: CreateUserInput) => {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) throw new ConflictError("Email already in use")

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await userRepository.create(tx, {
        name: input.name,
        email: input.email,
      })
      return user
    })
  },

  /** Partial update. Throws 404 or 409 appropriately. */
  update: async (id: string, input: UpdateUserInput) => {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("User")

    if (input.email) {
      const emailOwner = await userRepository.findByEmail(input.email)
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictError("Email already in use")
      }
    }

    return userRepository.update(id, input)
  },

  /** Soft-delete a user. Throws 404 if not found. */
  remove: async (id: string) => {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("User")

    await userRepository.softDelete(id)
  },
}