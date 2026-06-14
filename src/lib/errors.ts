/**
 * Base application error. All custom errors extend this class.
 * The global error handler reads `statusCode` and `code` to build consistent API responses.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

/** 400 — Invalid request payload or parameters. */
export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(400, "BAD_REQUEST", message, details)
  }
}

/** 401 — Missing or invalid authentication. */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, "UNAUTHORIZED", message)
  }
}

/** 403 — Authenticated but insufficient permissions. */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, "FORBIDDEN", message)
  }
}

/** 404 — Requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(404, "NOT_FOUND", `${resource} not found`)
  }
}

/** 409 — Conflict with current state (e.g. duplicate email). */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, "CONFLICT", message)
  }
}

/** 422 — Zod validation failure. */
export class ValidationError extends AppError {
  constructor(details: unknown) {
    super(422, "VALIDATION_ERROR", "Validation failed", details)
  }
}