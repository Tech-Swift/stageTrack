import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const SaccoSettings = sequelize.define(
  "SaccoSettings",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    sacco_id: { 
      type: DataTypes.UUID, 
      allowNull: false, 
      unique: true 
    }, // One settings record per SACCO
    default_fare: { 
      type: DataTypes.DECIMAL(10, 2) 
    }, // Default fare amount
    max_stage_queue: { 
      type: DataTypes.INTEGER 
    }, // Maximum vehicles in queue at a stage
    late_departure_penalty: { 
      type: DataTypes.DECIMAL(10, 2) 
    }, // Penalty for late departure
    crew_misconduct_penalty: { 
      type: DataTypes.DECIMAL(10, 2) 
    }, // Penalty for crew misconduct
    operating_hours: { 
      type: DataTypes.JSONB 
    }, // Operating hours as JSON (e.g., {"monday": {"open": "06:00", "close": "22:00"}})
    enforce_documents: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    }, // Whether to enforce document verification
    max_incidents_before_suspension: { 
      type: DataTypes.INTEGER 
    }, // Maximum incidents before automatic suspension
    updated_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "sacco_settings",
    timestamps: false // Only updated_at, no created_at - handled manually
  }
);

// Associations will be set up in associations.js

export default SaccoSettings;

