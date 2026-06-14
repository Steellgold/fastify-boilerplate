export const UserActions = {
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",
} as const

export type UserAuditPayloadMap = {
  "user.create": { email: string }
  "user.update": { changed: string }
  "user.delete": Record<string, never>
}