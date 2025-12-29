import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const StageAssignment = sequelize.define(
  'StageAssignment',
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shift_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    shift_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'stage_assignments',
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'idx_stage_assignments_unique',
        fields: ['stage_id', 'user_id', 'shift_start'],
      },
      {
        name: 'idx_stage_assignments_stage_id',
        fields: ['stage_id'],
      },
      {
        name: 'idx_stage_assignments_user_id',
        fields: ['user_id'],
      },
      {
        name: 'idx_stage_assignments_active',
        fields: ['active'],
      },
      {
        name: 'idx_stage_assignments_stage_active',
        fields: ['stage_id', 'active'],
      },
      {
        name: 'idx_stage_assignments_user_active',
        fields: ['user_id', 'active'],
      },
      {
        name: 'idx_stage_assignments_shift_times',
        fields: ['shift_start', 'shift_end'],
      },
      {
        name: 'idx_stage_assignments_active_shift',
        fields: ['stage_id', 'active', 'shift_start', 'shift_end'],
      },
    ],
  }
);

export default StageAssignment;
