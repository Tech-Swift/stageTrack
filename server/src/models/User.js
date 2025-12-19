import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
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

    email: {
      type: DataTypes.STRING(150),
      unique: true
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },

    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    badge_number: {
      type: DataTypes.STRING(100),
      unique: true
    },

    license_number: {
      type: DataTypes.STRING(100),
      unique: true
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default User;
