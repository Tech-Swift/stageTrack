import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Permission = sequelize.define(
  "Permission",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    name: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true 
    }, // e.g., "register_vehicle", "view_reports", "manage_users"
    description: { 
      type: DataTypes.STRING(255) 
    },
    resource: { 
      type: DataTypes.STRING(50) 
    }, // e.g., "vehicle", "report", "user"
    action: { 
      type: DataTypes.STRING(50) 
    }, // e.g., "create", "read", "update", "delete"
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    updated_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations will be set up in User.js to avoid circular dependencies

export default Permission;

