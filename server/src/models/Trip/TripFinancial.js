// models/TripFinancial.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const TripFinancial = sequelize.define(
  "TripFinancial",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    trip_operation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    stage_marshal_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    trip_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    trip_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    vehicle_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trip_revenue: {
      type: DataTypes.DECIMAL(12, 2) // computed in DB
    }
  },
  {
    tableName: "trip_financials",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["trip_operation_id"] },
      { fields: ["stage_marshal_id"] }
    ]
  }
);

export default TripFinancial;
