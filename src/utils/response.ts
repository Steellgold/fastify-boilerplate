/** Build a standard success response. */
export const successResponse = <T>(data: T): { success: true; data: T } => ({
  success: true as const,
  data,
})

/** Build a paginated response with meta information. */
export const paginatedResponse = <T>(
  data: T[],
  meta: { page: number; limit: number; total: number },
) => ({
  success: true as const,
  data,
  meta,
})