import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const VehicleOwnerLink = sequelize.define(
  "VehicleOwnerLink",
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
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ownership_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 100.00 // Default to 100% if not specified
    },
    is_primary_owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ownership_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ownership_end_date: {
      type: DataTypes.DATE,
      allowNull: true // Null means current ownership
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
    tableName: "vehicle_owner_links",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['vehicle_id'] // For finding owners of a vehicle
      },
      {
        fields: ['owner_id'] // For finding vehicles of an owner
      },
      {
        fields: ['vehicle_id', 'owner_id'] // Composite for unique constraint checking
      },
      {
        fields: ['is_primary_owner'] // For finding primary owners
      }
    ]
  }
);

export default VehicleOwnerLink;

