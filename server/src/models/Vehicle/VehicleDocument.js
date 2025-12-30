import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const VehicleDocument = sequelize.define(
  "VehicleDocument",
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
    document_type: {
      type: DataTypes.STRING(50),
      allowNull: false // insurance, inspection, ntsa, registration, etc.
    },
    document_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false // Critical for compliance
    },
    document_url: {
      type: DataTypes.TEXT,
      allowNull: true // URL to stored document file
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "active", // active, expired, pending_renewal
      allowNull: false
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true // User ID who verified the document
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
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
    tableName: "vehicle_documents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ['vehicle_id'] // For finding all documents of a vehicle
      },
      {
        fields: ['document_type'] // For filtering by document type
      },
      {
        fields: ['expiry_date'] // For finding expiring/expired documents
      },
      {
        fields: ['status'] // For filtering by status
      },
      {
        fields: ['vehicle_id', 'document_type'] // For unique document type per vehicle
      }
    ]
  }
);

export default VehicleDocument;

