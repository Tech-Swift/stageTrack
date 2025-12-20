import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const SaccoAuditLog = sequelize.define(
  "SaccoAuditLog",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    sacco_id: { 
      type: DataTypes.UUID 
    }, // Which SACCO this action relates to (for multi-tenancy)
    user_id: { 
      type: DataTypes.UUID 
    }, // Who performed the action
    action: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    }, // e.g., "create_vehicle", "update_fare", "suspend_user"
    entity: { 
      type: DataTypes.STRING(50) 
    }, // e.g., "vehicle", "user", "fare"
    entity_id: { 
      type: DataTypes.UUID 
    }, // ID of the affected entity
    metadata: { 
      type: DataTypes.JSONB 
    }, // Additional context as JSON (e.g., {"old_value": "...", "new_value": "..."})
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "sacco_audit_logs",
    timestamps: false, // Only created_at
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        fields: ['sacco_id'] // For filtering by SACCO (multi-tenancy)
      },
      {
        fields: ['user_id'] // For filtering by user
      },
      {
        fields: ['entity', 'entity_id'] // For finding logs for specific entities
      },
      {
        fields: ['created_at'] // For time-based queries
      }
    ]
  }
);

// Associations will be set up in associations.js

export default SaccoAuditLog;

