import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Stage = sequelize.define(
  "Stage",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    route_id: { 
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id'
      }
    },
    name: { type: DataTypes.STRING(150), allowNull: false },
    sequence_order: { type: DataTypes.INTEGER, allowNull: false }, // order in route
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "stages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
    indexes: [
      {
        name: 'idx_stages_route_sequence',
        fields: ['route_id', 'sequence_order'],
      },
      {
        name: 'idx_stages_route_id',
        fields: ['route_id'],
      },
    ],
  }
);

export default Stage;
