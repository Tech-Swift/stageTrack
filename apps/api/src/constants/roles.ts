import { UserRole } from "@prisma/client";

export const REGISTRATION_REVIEW_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.DIRECTOR,
  UserRole.MANAGER,
];

export const REGISTRATION_APPROVAL_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.MANAGER,
];

export const SYSTEM_ADMIN_ROLES = [
  UserRole.SUPER_ADMIN,
];

export const TENANT_ADMIN_ROLES = [
  UserRole.SACCO_ADMIN,
  UserRole.DIRECTOR,
  UserRole.MANAGER,
];

export const USER_STATUS_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.DIRECTOR,
];

export const ROLE_ASSIGNMENT_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.DIRECTOR,
];

export const VEHICLE_REVIEW_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.MANAGER,
]

export const VEHICLE_APPROVAL_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SACCO_ADMIN,
  UserRole.DIRECTOR,
];