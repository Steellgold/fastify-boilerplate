export { AuthActions } from "./auth.actions"
import type { AuthAuditPayloadMap } from "./auth.actions"
import type { UserAuditPayloadMap } from "./user.actions"

type PayloadMap = UserAuditPayloadMap & AuthAuditPayloadMap

export type AuditAction = keyof PayloadMap
export type AuditPayloadFor<A extends AuditAction> = PayloadMap[A]