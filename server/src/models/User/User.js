import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import UserRole from "./user_role.js";
import Role from "./Role.js";
import SACCO from "../Sacco/sacco.model.js";
import Stage from "../stage.model.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    full_name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), unique: true },
    phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    badge_number: { type: DataTypes.STRING(100), unique: true },
    license_number: { type: DataTypes.STRING(100), unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "active" },
    sacco_id: {
      type: DataTypes.UUID,
      allowNull: true, // SACCO required for operational users
      references: { model: SACCO, key: "id" }
    },
    stage_id: {
      type: DataTypes.UUID,
      allowNull: true, // stage optional for some roles
      references: { model: Stage, key: "id" }
    },
    license_expiry_date: { type: DataTypes.DATE },
    suspended_until: { type: DataTypes.DATE },
    incident_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_login_at: { type: DataTypes.DATE },
    profile_image_url: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
User.belongsTo(SACCO, { foreignKey: "sacco_id", as: "sacco" });
SACCO.hasMany(User, { foreignKey: "sacco_id", as: "users" });

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_uuid", otherKey: "role_id", as: "roles" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id", otherKey: "user_uuid", as: "users" });

UserRole.belongsTo(User, { foreignKey: "user_uuid", as: "user" });
UserRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });
UserRole.belongsTo(User, { foreignKey: "assigned_by_uuid", as: "assignedBy" });

export default User;
