import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    role_id: { 
      type: DataTypes.UUID, 
      allowNull: false 
    },
    permission_id: { 
      type: DataTypes.UUID, 
      allowNull: false 
    },
    granted_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    granted_by_uuid: { 
      type: DataTypes.UUID 
    }, // Who granted this permission to the role
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
    tableName: "role_permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id']
      }
    ]
  }
);

// Associations will be set up in associations.js to avoid circular dependencies

export default RolePermission;

