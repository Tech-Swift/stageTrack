import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const VehicleOwner = sequelize.define(
  "VehicleOwner",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    id_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: "vehicle_owners",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['phone'] // For lookups by phone
      },
      {
        fields: ['id_number'] // Already unique, but explicit index
      },
      {
        fields: ['email'] // For lookups by email
      }
    ]
  }
);

export default VehicleOwner;

