// Import models in the correct order to handle associations
// Base models first (no dependencies)
import SACCO from './Sacco/sacco.model.js';
import SaccoBranch from './Sacco/SaccoBranch.js';
import SaccoUser from './Sacco/SaccoUser.js';
import SaccoSettings from './Sacco/SaccoSettings.js';
import SaccoAuditLog from './Sacco/SaccoAuditLog.js';
// Stage models
import County from './Stage/County.model.js';
import Route from './Stage/Route.model.js';
import Stage from './Stage/stage.model.js';
import StageAssignment from './Stage/StageAssignment.js';
import StageCapacityRule from './Stage/CapacityRule.js';
import StageLog from './Stage/Stagelog.js';
import Role from './User/Role.js';
import Permission from './User/Permission.js';
import UserRole from './User/user_role.js';
import RolePermission from './User/role_permission.js';
import UserSession from './User/UserSession.js';

// Models with dependencies last
import User from './User/User.js';

// Import and set up all associations
import './associations.js';

// Export all models
export {
  SACCO,
  SaccoBranch,
  SaccoUser,
  SaccoSettings,
  SaccoAuditLog,
  County,
  Route,
  Stage,
  StageAssignment,
  StageCapacityRule,
  StageLog,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserSession,
  User
};

// This ensures all models are loaded and associations are set up
export default {
  SACCO,
  SaccoBranch,
  SaccoUser,
  SaccoSettings,
  SaccoAuditLog,
  County,
  Route,
  Stage,
  StageAssignment,
  StageCapacityRule,
  StageLog,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserSession,
  User
};

