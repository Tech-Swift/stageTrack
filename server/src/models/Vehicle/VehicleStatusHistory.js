import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const VehicleStatusHistory = sequelize.define(
  "VehicleStatusHistory",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    vehicle_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    old_status: {
      type: DataTypes.STRING(50),
      allowNull: true // Null for initial status
    },
    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: true // User ID who changed the status
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true // Reason for status change
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    tableName: "vehicle_status_history",
    timestamps: false, // Only changed_at, no created_at/updated_at
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        fields: ['vehicle_id'] // For finding status history of a vehicle
      },
      {
        fields: ['changed_at'] // For time-based queries
      },
      {
        fields: ['new_status'] // For filtering by status
      },
      {
        fields: ['vehicle_id', 'changed_at'] // Composite for chronological order
      }
    ]
  }
);

export default VehicleStatusHistory;

