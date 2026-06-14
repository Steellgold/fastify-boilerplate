import { ValidationError } from "@/lib/errors"
import { createUserSchema, listUsersQuery, updateUserSchema, uuidParam } from "@/schemas/users.schema"
import { usersService } from "@/services/users.service"
import { paginatedResponse, successResponse } from "@/utils/response"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

/** Request handlers for user-related endpoints. */
export const usersController = {
  /** GET /user — current user profile. */
  getSelf: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await usersService.findById(request.userSession!.user.id)
    return reply.send(successResponse(user))
  },

  /** PATCH /user — update current user profile. */
  updateSelf: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = updateUserSchema.safeParse(request.body)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    const user = await usersService.update(request.userSession!.user.id, parsed.data)
    return reply.send(successResponse(user))
  },

  /** GET /users — paginated list. */
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = listUsersQuery.safeParse(request.query)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    const result = await usersService.findAll(parsed.data)
    return reply.send(paginatedResponse(result.data, result.meta))
  },

  /** GET /users/:id — single user. */
  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = uuidParam.safeParse(request.params)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    const user = await usersService.findById(parsed.data.id)
    return reply.send(successResponse(user))
  },

  /** POST /users — create a new user. */
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createUserSchema.safeParse(request.body)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    const user = await usersService.create(parsed.data)
    return reply.status(201).send(successResponse(user))
  },

  /** PATCH /users/:id — partial update. */
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsParsed = uuidParam.safeParse(request.params)
    if (!paramsParsed.success) throw new ValidationError(z.treeifyError(paramsParsed.error))

    const bodyParsed = updateUserSchema.safeParse(request.body)
    if (!bodyParsed.success) throw new ValidationError(z.treeifyError(bodyParsed.error))

    const user = await usersService.update(paramsParsed.data.id, bodyParsed.data)
    return reply.send(successResponse(user))
  },

  /** DELETE /users/:id — soft-delete. */
  remove: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = uuidParam.safeParse(request.params)
    if (!parsed.success) throw new ValidationError(z.treeifyError(parsed.error))

    await usersService.remove(parsed.data.id)
    return reply.status(204).send()
  },
}