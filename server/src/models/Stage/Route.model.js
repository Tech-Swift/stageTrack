import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const Route = sequelize.define(
  'Route',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sacco_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    county_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    route_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'routes',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['sacco_id', 'route_code'],
      },
      {
        name: 'idx_routes_sacco_id',
        fields: ['sacco_id'],
      },
      {
        name: 'idx_routes_county_id',
        fields: ['county_id'],
      },
      {
        name: 'idx_routes_is_active',
        fields: ['is_active'],
      },
      {
        name: 'idx_routes_sacco_active',
        fields: ['sacco_id', 'is_active'],
      },
    ],
  }
);

export default Route;
