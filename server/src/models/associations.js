// This file sets up all model associations
// Import all models
import User from './User/User.js';
import Role from './User/Role.js';
import Permission from './User/Permission.js';
import UserRole from './User/user_role.js';
import RolePermission from './User/role_permission.js';
import UserSession from './User/UserSession.js';
import SACCO from './Sacco/sacco.model.js';
import SaccoBranch from './Sacco/SaccoBranch.js';
import SaccoUser from './Sacco/SaccoUser.js';
import SaccoSettings from './Sacco/SaccoSettings.js';
import SaccoAuditLog from './Sacco/SaccoAuditLog.js';
import Stage from './stage.model.js';

// Role <-> Permission (Many-to-Many through RolePermission)
Role.belongsToMany(Permission, { 
  through: RolePermission, 
  foreignKey: 'role_id', 
  otherKey: 'permission_id', 
  as: 'permissions' 
});

Permission.belongsToMany(Role, { 
  through: RolePermission, 
  foreignKey: 'permission_id', 
  otherKey: 'role_id', 
  as: 'roles' 
});

// RolePermission associations
RolePermission.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' });
RolePermission.belongsTo(User, { foreignKey: 'granted_by_uuid', as: 'grantedBy' });

// UserSession associations
UserSession.belongsTo(User, { foreignKey: 'user_uuid', as: 'user' });
User.hasMany(UserSession, { foreignKey: 'user_uuid', as: 'sessions' });

// SACCO Multi-Tenancy Associations
// SACCO has many branches
SACCO.hasMany(SaccoBranch, { foreignKey: 'sacco_id', as: 'branches' });
SaccoBranch.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// SACCO has one settings record
SACCO.hasOne(SaccoSettings, { foreignKey: 'sacco_id', as: 'settings' });
SaccoSettings.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// SACCO has many users (through sacco_users)
SACCO.belongsToMany(User, { 
  through: SaccoUser, 
  foreignKey: 'sacco_id', 
  otherKey: 'user_id', 
  as: 'saccoUsers' 
});
User.belongsToMany(SACCO, { 
  through: SaccoUser, 
  foreignKey: 'user_id', 
  otherKey: 'sacco_id', 
  as: 'saccos' 
});

// SaccoUser associations
SaccoUser.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SaccoUser.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });
SaccoUser.belongsTo(SaccoBranch, { foreignKey: 'branch_id', as: 'branch' });

// SACCO has many audit logs
SACCO.hasMany(SaccoAuditLog, { foreignKey: 'sacco_id', as: 'auditLogs' });
SaccoAuditLog.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// User has many audit logs (as the actor)
User.hasMany(SaccoAuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
SaccoAuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Branch has many users
SaccoBranch.hasMany(SaccoUser, { foreignKey: 'branch_id', as: 'users' });

// Note: User <-> Role associations are already set up in User.js
// Note: User <-> SACCO (direct) and User <-> Stage associations are already set up in User.js

export default {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserSession,
  SACCO,
  SaccoBranch,
  SaccoUser,
  SaccoSettings,
  SaccoAuditLog,
  Stage
};

