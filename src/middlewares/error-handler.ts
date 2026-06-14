import { AppError } from "@/lib/errors"
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify"

/**
 * Global Fastify error handler.
 * - `AppError` subclasses → structured JSON with the matching status code.
 * - Fastify validation errors → 400 with details.
 * - Unknown errors → 500 (logged server-side).
 */
export const errorHandler = (
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    })
  }

  if ("validation" in error && error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.validation,
      },
    })
  }

  request.log.error(error)
  return reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  })
}