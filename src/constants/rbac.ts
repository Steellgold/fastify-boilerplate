/** System-level roles. Extend as needed. */
export const SystemRole = {
  USER: "user",
  MEMBER: "member",
  ADMIN: "admin",
} as const

/** Union type of system role values. */
export type SystemRole = (typeof SystemRole)[keyof typeof SystemRole]

/** Granular permissions that can be assigned to roles. */
export const Permissions = {
  USER_LIST: "user:list",
  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  ADMIN_ACCESS: "admin:access",
  ADMIN_MANAGE_USERS: "admin:manage_users",
  ADMIN_MANAGE_SYSTEM: "admin:manage_system",
} as const

/** Union type of all permission values. */
export type Permission = (typeof Permissions)[keyof typeof Permissions]

/**
 * Static mapping of roles to their allowed permissions.
 * Used by `requirePermission` middleware.
 */
export const ROLE_PERMISSIONS: Record<SystemRole, readonly Permission[]> = {
  user: [Permissions.USER_READ],
  member: [Permissions.USER_READ, Permissions.USER_LIST, Permissions.USER_CREATE],
  admin: [
    Permissions.USER_LIST,
    Permissions.USER_READ,
    Permissions.USER_CREATE,
    Permissions.USER_UPDATE,
    Permissions.USER_DELETE,
    Permissions.ADMIN_ACCESS,
    Permissions.ADMIN_MANAGE_USERS,
    Permissions.ADMIN_MANAGE_SYSTEM,
  ],
}

/** Check whether a role has a specific permission. */
export const hasPermission = (role: SystemRole | undefined, permission: Permission): boolean => {
  if (!role) return false
  return ROLE_PERMISSIONS[role].includes(permission)
}

/** Check whether a role has all the given permissions. */
export const hasAllPermissions = (role: SystemRole | undefined, permissions: Permission[]): boolean => {
  if (!role) return false
  return permissions.every((p) => ROLE_PERMISSIONS[role].includes(p))
}