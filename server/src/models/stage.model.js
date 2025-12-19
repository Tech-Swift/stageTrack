import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Stage = sequelize.define(
  "Stage",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(150), allowNull: false },
    town: { type: DataTypes.STRING(100) }, // optional
    county: { type: DataTypes.STRING(100) }, // optional
    sequence_order: { type: DataTypes.INTEGER }, // order in route
    max_vehicles: { type: DataTypes.INTEGER, defaultValue: 10 },
    queue_logic: { type: DataTypes.STRING(50), defaultValue: "FIFO" }, // first in, first out
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "stages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Stage;
