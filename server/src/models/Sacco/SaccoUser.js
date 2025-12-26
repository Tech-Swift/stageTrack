import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js"; // default import matches your db export

const SaccoUser = sequelize.define(
  "SaccoUser",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    user_id: { 
      type: DataTypes.UUID,
      allowNull: false
    },
    sacco_id: { 
      type: DataTypes.UUID,
      allowNull: false
    },
    branch_id: { 
      type: DataTypes.UUID 
    },
    role: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    status: { 
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    },
    joined_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "sacco_users",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'sacco_id']
      }
    ]
  }
);

export default SaccoUser;
