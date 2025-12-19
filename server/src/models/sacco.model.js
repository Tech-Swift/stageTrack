import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SACCO = sequelize.define(
  "SACCO",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    registration_no: { type: DataTypes.STRING(100), unique: true },
    county: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.STRING(20), defaultValue: "active" }, // active, suspended
    operating_hours: { type: DataTypes.STRING(50) }, // optional
    fare_rules: { type: DataTypes.TEXT },
    penalties: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "saccos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default SACCO;
