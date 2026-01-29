import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const TripLog = sequelize.define("TripLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  route_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  departure_stage_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  arrival_stage_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  crew_assignment_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  departed_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrived_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  trip_status: {
    type: DataTypes.STRING(20),
    defaultValue: "completed",
  },
}, {
  tableName: "trip_logs",
  timestamps: false,
});

export default TripLog;
