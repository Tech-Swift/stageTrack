import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const SaccoUser = sequelize.define(
  "SaccoUser",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    user_id: { 
      type: DataTypes.UUID 
    },
    sacco_id: { 
      type: DataTypes.UUID 
    },
    branch_id: { 
      type: DataTypes.UUID 
    }, // Optional: user can be assigned to a specific branch
    role: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    }, // Role within the SACCO (may differ from global roles)
    status: { 
      type: DataTypes.STRING(20) 
    }, // active, suspended, inactive
    joined_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "sacco_users",
    timestamps: false, // Only joined_at, no created_at/updated_at
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'sacco_id'] // A user can only be in a SACCO once
      }
    ]
  }
);

// Associations will be set up in associations.js

export default SaccoUser;

