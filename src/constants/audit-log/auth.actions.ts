export const AuthActions = {
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
} as const

export type AuthAuditPayloadMap = {
  "auth.login": { email: string; success: boolean }
  "auth.logout": { email: string }
}