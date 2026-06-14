import { z } from "zod"

/** Validates the `:id` route parameter. */
export const uuidParam = z.object({
  id: z.string().min(1),
})

/** Payload to create a new user. */
export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

/** Partial payload to update an existing user. */
export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
})

/** Admin-only: partial payload to update any user, including role. */
export const adminUpdateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  role: z.string().min(1).max(50).optional(),
})

/** Query parameters for paginated user listing. */
export const listUsersQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type UuidParam = z.infer<typeof uuidParam>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuery>