import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const StageCapacityRule = sequelize.define(
  'StageCapacityRule',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stage_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    max_vehicles: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    queue_strategy: {
      type: DataTypes.ENUM('FIFO', 'PRIORITY', 'TIME_BASED'),
      defaultValue: 'FIFO',
    },
    overflow_action: {
      type: DataTypes.ENUM('HOLD', 'REDIRECT', 'DENY'),
      defaultValue: 'HOLD',
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'stage_capacity_rules',
    underscored: true,
    indexes: [
      {
        name: 'idx_capacity_rules_stage_id',
        fields: ['stage_id'],
      },
      {
        name: 'idx_capacity_rules_effective_dates',
        fields: ['effective_from', 'effective_to'],
      },
      {
        name: 'idx_capacity_rules_stage_effective',
        fields: ['stage_id', 'effective_from', 'effective_to'],
      },
    ],
  }
);

export default StageCapacityRule;
