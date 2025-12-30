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
// Stage models
import County from './Stage/County.model.js';
import Route from './Stage/Route.model.js';
import Stage from './Stage/stage.model.js';
import StageAssignment from './Stage/StageAssignment.js';
import StageCapacityRule from './Stage/CapacityRule.js';
import StageLog from './Stage/Stagelog.js';
// Vehicle models
import Vehicle from './Vehicle/Vehicle.js';
import VehicleOwner from './Vehicle/VehicleOwner.js';
import VehicleOwnerLink from './Vehicle/VehicleOwnerLink.js';
import VehicleDocument from './Vehicle/VehicleDocument.js';
import VehicleStatusHistory from './Vehicle/VehicleStatusHistory.js';

// -------------------- Role & Permission --------------------

// Role <-> Permission (Many-to-Many)
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

// -------------------- User Session --------------------
UserSession.belongsTo(User, { foreignKey: 'user_uuid', as: 'user' });
User.hasMany(UserSession, { foreignKey: 'user_uuid', as: 'sessions' });

// -------------------- SACCO Multi-Tenancy --------------------

// SACCO ↔ Branch
SACCO.hasMany(SaccoBranch, { foreignKey: 'sacco_id', as: 'branches' });
SaccoBranch.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// SACCO ↔ Settings
SACCO.hasOne(SaccoSettings, { foreignKey: 'sacco_id', as: 'settings' });
SaccoSettings.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// SACCO ↔ User (many-to-many through SaccoUser)
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

// -------------------- User ↔ SaccoUser (for login and role checks) --------------------

// User has many SACCO memberships (for login)
User.hasMany(SaccoUser, { as: 'sacco_memberships', foreignKey: 'user_id' });

// SaccoUser belongs to User (alias changed to avoid conflicts)
SaccoUser.belongsTo(User, { foreignKey: 'user_id', as: 'member_user' });

// SaccoUser belongs to SACCO and optionally branch
SaccoUser.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });
SaccoUser.belongsTo(SaccoBranch, { foreignKey: 'branch_id', as: 'branch' });

// -------------------- SACCO Audit Logs --------------------

// SACCO has many audit logs
SACCO.hasMany(SaccoAuditLog, { foreignKey: 'sacco_id', as: 'auditLogs' });
SaccoAuditLog.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// User has many audit logs (as the actor)
User.hasMany(SaccoAuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
SaccoAuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Branch has many SACCO users
SaccoBranch.hasMany(SaccoUser, { foreignKey: 'branch_id', as: 'users' });

// -------------------- Route, Stage & Geography --------------------

// County ↔ Route (one-to-many)
County.hasMany(Route, { foreignKey: 'county_id', as: 'routes' });
Route.belongsTo(County, { foreignKey: 'county_id', as: 'county' });

// SACCO ↔ Route (one-to-many)
SACCO.hasMany(Route, { foreignKey: 'sacco_id', as: 'routes' });
Route.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// Route ↔ Stage (one-to-many)
Route.hasMany(Stage, { foreignKey: 'route_id', as: 'stages' });
Stage.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

// Stage ↔ StageAssignment (one-to-many)
Stage.hasMany(StageAssignment, { foreignKey: 'stage_id', as: 'assignments' });
StageAssignment.belongsTo(Stage, { foreignKey: 'stage_id', as: 'stage' });

// User ↔ StageAssignment (one-to-many) - which marshal works which stage
User.hasMany(StageAssignment, { foreignKey: 'user_id', as: 'assignments' });
StageAssignment.belongsTo(User, { foreignKey: 'user_id', as: 'marshal' });

// Stage ↔ StageCapacityRule (one-to-many) - max vehicles, queue logic
Stage.hasMany(StageCapacityRule, { foreignKey: 'stage_id', as: 'capacityRules' });
StageCapacityRule.belongsTo(Stage, { foreignKey: 'stage_id', as: 'stage' });

// Stage ↔ StageLog (one-to-many) - arrivals, departures, timestamps
Stage.hasMany(StageLog, { foreignKey: 'stage_id', as: 'logs' });
StageLog.belongsTo(Stage, { foreignKey: 'stage_id', as: 'stage' });

// User ↔ StageLog (one-to-many) - who logged the event
User.hasMany(StageLog, { foreignKey: 'logged_by', as: 'stageLogs' });
StageLog.belongsTo(User, { foreignKey: 'logged_by', as: 'loggedBy' });

// -------------------- Vehicle & Ownership --------------------

// SACCO ↔ Vehicle (one-to-many)
SACCO.hasMany(Vehicle, { foreignKey: 'sacco_id', as: 'vehicles' });
Vehicle.belongsTo(SACCO, { foreignKey: 'sacco_id', as: 'sacco' });

// Route ↔ Vehicle (one-to-many)
Route.hasMany(Vehicle, { foreignKey: 'route_id', as: 'vehicles' });
Vehicle.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

// Vehicle ↔ VehicleOwner (many-to-many through VehicleOwnerLink)
Vehicle.belongsToMany(VehicleOwner, {
  through: VehicleOwnerLink,
  foreignKey: 'vehicle_id',
  otherKey: 'owner_id',
  as: 'owners'
});
VehicleOwner.belongsToMany(Vehicle, {
  through: VehicleOwnerLink,
  foreignKey: 'owner_id',
  otherKey: 'vehicle_id',
  as: 'vehicles'
});

// VehicleOwnerLink associations
VehicleOwnerLink.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
VehicleOwnerLink.belongsTo(VehicleOwner, { foreignKey: 'owner_id', as: 'owner' });

// Vehicle ↔ VehicleDocument (one-to-many)
Vehicle.hasMany(VehicleDocument, { foreignKey: 'vehicle_id', as: 'documents' });
VehicleDocument.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// User ↔ VehicleDocument (one-to-many) - who verified the document
User.hasMany(VehicleDocument, { foreignKey: 'verified_by', as: 'verifiedDocuments' });
VehicleDocument.belongsTo(User, { foreignKey: 'verified_by', as: 'verifiedBy' });

// Vehicle ↔ VehicleStatusHistory (one-to-many)
Vehicle.hasMany(VehicleStatusHistory, { foreignKey: 'vehicle_id', as: 'statusHistory' });
VehicleStatusHistory.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// User ↔ VehicleStatusHistory (one-to-many) - who changed the status
User.hasMany(VehicleStatusHistory, { foreignKey: 'changed_by', as: 'vehicleStatusChanges' });
VehicleStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// -------------------- Export Models --------------------
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
  County,
  Route,
  Stage,
  StageAssignment,
  StageCapacityRule,
  StageLog,
  Vehicle,
  VehicleOwner,
  VehicleOwnerLink,
  VehicleDocument,
  VehicleStatusHistory
};
