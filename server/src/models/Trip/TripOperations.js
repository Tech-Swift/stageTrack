// models/TripOperation.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const TripOperation = sequelize.define(
  "TripOperation",
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
    route_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    departure_stage_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    arrival_stage_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    crew_assignment_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    departed_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrived_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trip_status: {
      type: DataTypes.ENUM("queued", "departed", "arrived", "completed", "cancelled"),
      defaultValue: "queued",
      allowNull: false
    }
  },
  {
    tableName: "trip_operations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["vehicle_id"] },
      { fields: ["route_id"] },
      { fields: ["departure_stage_id"] },
      { fields: ["trip_status"] },
      { fields: ["departed_at"] }
    ]
  }
);

export default TripOperation;
