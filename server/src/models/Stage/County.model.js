import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const County = sequelize.define(
  'County',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'counties',
    underscored: true,
  }
);

export default County;
