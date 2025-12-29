import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const StageLog = sequelize.define(
  'StageLog',
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
    vehicle_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.ENUM('ARRIVAL', 'DEPARTURE'),
      allowNull: false,
    },
    logged_by: {
      type: DataTypes.UUID,
      allowNull: false, // marshal user id
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'stage_logs',
    underscored: true,
    indexes: [
      {
        name: 'idx_stage_logs_stage_id',
        fields: ['stage_id'],
      },
      {
        name: 'idx_stage_logs_vehicle_id',
        fields: ['vehicle_id'],
      },
      {
        name: 'idx_stage_logs_event_type',
        fields: ['event_type'],
      },
      {
        name: 'idx_stage_logs_logged_by',
        fields: ['logged_by'],
      },
      {
        name: 'idx_stage_logs_timestamp',
        fields: ['timestamp'],
      },
      {
        name: 'idx_stage_logs_stage_timestamp',
        fields: ['stage_id', 'timestamp'],
      },
      {
        name: 'idx_stage_logs_stage_event',
        fields: ['stage_id', 'event_type'],
      },
      {
        name: 'idx_stage_logs_vehicle_timestamp',
        fields: ['vehicle_id', 'timestamp'],
      },
      {
        name: 'idx_stage_logs_stage_vehicle',
        fields: ['stage_id', 'vehicle_id', 'timestamp'],
      },
      {
        name: 'idx_stage_logs_stage_event_timestamp',
        fields: ['stage_id', 'event_type', 'timestamp'],
      },
    ],
  }
);

export default StageLog;
