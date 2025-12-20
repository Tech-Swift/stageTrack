import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const UserSession = sequelize.define(
  "UserSession",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    user_uuid: { 
      type: DataTypes.UUID, 
      allowNull: false 
    },
    token: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
      unique: true 
    }, // JWT token or session token
    token_hash: { 
      type: DataTypes.TEXT 
    }, // Hashed version for security
    device_info: { 
      type: DataTypes.STRING(255) 
    }, // e.g., "Chrome on Windows", "Mobile App"
    ip_address: { 
      type: DataTypes.STRING(45) 
    }, // IPv4 or IPv6
    user_agent: { 
      type: DataTypes.TEXT 
    },
    expires_at: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    revoked: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    revoked_at: { 
      type: DataTypes.DATE 
    },
    last_used_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
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
    tableName: "user_sessions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['user_uuid']
      },
      {
        fields: ['token']
      },
      {
        fields: ['expires_at']
      }
    ]
  }
);

// Associations will be set up in associations.js to avoid circular dependencies

export default UserSession;

