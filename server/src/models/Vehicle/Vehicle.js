import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    plate_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sacco_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    route_id: {
      type: DataTypes.UUID,
      allowNull: true // Optional, vehicle might not be assigned to a route initially
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active", // active, inactive, suspended, maintenance
      allowNull: false
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
    tableName: "vehicles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['sacco_id'] // Multi-tenancy and filtering
      },
      {
        fields: ['route_id'] // Filtering by route
      },
      {
        fields: ['status'] // Filtering by status
      },
      {
        fields: ['plate_no'] // Already unique, but explicit index for lookups
      },
      {
        fields: ['sacco_id', 'status'] // Composite for active vehicles by SACCO
      }
    ]
  }
);

export default Vehicle;

