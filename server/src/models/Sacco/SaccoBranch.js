import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const SaccoBranch = sequelize.define(
  "SaccoBranch",
  {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    sacco_id: { 
      type: DataTypes.UUID, 
      allowNull: false 
    },
    name: { 
      type: DataTypes.STRING(150), 
      allowNull: false 
    },
    town: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    main_stage_name: { 
      type: DataTypes.STRING(150) 
    },
    stage_cluster: { 
      type: DataTypes.BOOLEAN 
    }, // Indicates if this branch is a stage cluster
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  },
  {
    tableName: "sacco_branches",
    timestamps: false, // Only created_at, no updated_at
    createdAt: "created_at",
    updatedAt: false
  }
);

// Associations will be set up in associations.js

export default SaccoBranch;

