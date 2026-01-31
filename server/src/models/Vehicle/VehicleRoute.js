import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const VehicleRoute = sequelize.define(
  "VehicleRoute",
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

    sacco_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active"
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "vehicle_routes",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["vehicle_id", "route_id"]
      },
      {
        fields: ["vehicle_id"]
      },
      {
        fields: ["route_id"]
      },
      {
        fields: ["sacco_id"]
      }
    ]
  }
);

export default VehicleRoute;
