/**
 * Vehicle Document Service
 * Business logic for vehicle document management with audit logging
 */
import { Op } from 'sequelize';
import { VehicleDocument, Vehicle, User } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new vehicle document
 * @param {Object} data - Document data
 * @param {string} data.vehicle_id - Vehicle ID
 * @param {string} data.document_type - Document type (insurance, inspection, ntsa, etc.)
 * @param {string} data.document_number - Document number (optional)
 * @param {Date} data.issue_date - Issue date (optional)
 * @param {Date} data.expiry_date - Expiry date (required)
 * @param {string} data.document_url - Document file URL (optional)
 * @param {string} data.notes - Notes (optional)
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID creating the document
 */
export async function createVehicleDocument(data, saccoId, userId) {
  const { vehicle_id, document_type, document_number, issue_date, expiry_date, document_url, notes } = data;

  // Validate required fields
  if (!vehicle_id || !document_type || !expiry_date) {
    throw new Error('Vehicle ID, document type, and expiry date are required');
  }

  // Verify vehicle exists and belongs to SACCO
  const vehicle = await Vehicle.findOne({
    where: {
      id: vehicle_id,
      sacco_id: saccoId
    }
  });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  // Check if document of this type already exists for this vehicle (active documents)
  const existing = await VehicleDocument.findOne({
    where: {
      vehicle_id,
      document_type,
      status: 'active'
    }
  });

  if (existing) {
    // Update existing document to expired/pending_renewal if new one is being added
    await existing.update({ status: 'expired' });
  }

  // Determine status based on expiry date
  const expiryDate = new Date(expiry_date);
  const now = new Date();
  const status = expiryDate < now ? 'expired' : 'active';

  // Create document
  const document = await VehicleDocument.create({
    vehicle_id,
    document_type,
    document_number: document_number || null,
    issue_date: issue_date ? new Date(issue_date) : null,
    expiry_date: expiryDate,
    document_url: document_url || null,
    status,
    notes: notes || null
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'create_vehicle_document',
    entity: 'vehicle_document',
    entity_id: document.id,
    metadata: { vehicle_id, document_type, expiry_date, status }
  });

  return document;
}

/**
 * Get all documents for a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {Object} options - Filter options
 * @param {string} options.document_type - Filter by document type
 * @param {string} options.status - Filter by status
 */
export async function getVehicleDocuments(vehicleId, saccoId, options = {}) {
  const { document_type, status } = options;

  // Verify vehicle exists and belongs to SACCO
  const vehicle = await Vehicle.findOne({
    where: {
      id: vehicleId,
      sacco_id: saccoId
    }
  });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  const where = { vehicle_id: vehicleId };
  if (document_type) where.document_type = document_type;
  if (status) where.status = status;

  const documents = await VehicleDocument.findAll({
    where,
    include: [
      {
        model: User,
        as: 'verifiedBy',
        attributes: ['id', 'full_name', 'email'],
        required: false
      }
    ],
    order: [['expiry_date', 'DESC']]
  });

  return documents;
}

/**
 * Get a single document by ID
 * @param {string} documentId - Document ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 */
export async function getVehicleDocumentById(documentId, saccoId) {
  const document = await VehicleDocument.findByPk(documentId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['id', 'plate_no', 'sacco_id']
      },
      {
        model: User,
        as: 'verifiedBy',
        attributes: ['id', 'full_name', 'email'],
        required: false
      }
    ]
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Verify vehicle belongs to SACCO
  if (document.vehicle.sacco_id !== saccoId) {
    throw new Error('Access denied');
  }

  return document;
}

/**
 * Update a vehicle document
 * @param {string} documentId - Document ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the update
 */
export async function updateVehicleDocument(documentId, data, saccoId, userId) {
  const document = await VehicleDocument.findByPk(documentId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['sacco_id']
      }
    ]
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Verify vehicle belongs to SACCO
  if (document.vehicle.sacco_id !== saccoId) {
    throw new Error('Access denied');
  }

  const oldData = { ...document.toJSON() };

  // Update allowed fields
  const allowedFields = ['document_number', 'issue_date', 'expiry_date', 'document_url', 'notes', 'status'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // If expiry_date is updated, recalculate status
  if (updateData.expiry_date) {
    const expiryDate = new Date(updateData.expiry_date);
    const now = new Date();
    updateData.status = expiryDate < now ? 'expired' : 'active';
  }

  await document.update(updateData);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_vehicle_document',
    entity: 'vehicle_document',
    entity_id: documentId,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return document;
}

/**
 * Verify a vehicle document
 * @param {string} documentId - Document ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID verifying the document
 */
export async function verifyVehicleDocument(documentId, saccoId, userId) {
  const document = await VehicleDocument.findByPk(documentId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['sacco_id']
      }
    ]
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Verify vehicle belongs to SACCO
  if (document.vehicle.sacco_id !== saccoId) {
    throw new Error('Access denied');
  }

  await document.update({
    verified_by: userId,
    verified_at: new Date()
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'verify_vehicle_document',
    entity: 'vehicle_document',
    entity_id: documentId,
    metadata: { document_type: document.document_type, vehicle_id: document.vehicle_id }
  });

  return document;
}

/**
 * Delete a vehicle document
 * @param {string} documentId - Document ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the deletion
 */
export async function deleteVehicleDocument(documentId, saccoId, userId) {
  const document = await VehicleDocument.findByPk(documentId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['sacco_id']
      }
    ]
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Verify vehicle belongs to SACCO
  if (document.vehicle.sacco_id !== saccoId) {
    throw new Error('Access denied');
  }

  const documentType = document.document_type;
  const vehicleId = document.vehicle_id;

  await document.destroy();

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_vehicle_document',
    entity: 'vehicle_document',
    entity_id: documentId,
    metadata: { document_type: documentType, vehicle_id }
  });

  return { message: 'Document deleted successfully' };
}

/**
 * Get expiring documents (for compliance checks)
 * @param {string} saccoId - SACCO ID
 * @param {number} daysAhead - Number of days ahead to check (default: 30)
 */
export async function getExpiringDocuments(saccoId, daysAhead = 30) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);

  const vehicles = await Vehicle.findAll({
    where: { sacco_id: saccoId },
    include: [
      {
        model: VehicleDocument,
        as: 'documents',
        where: {
          expiry_date: {
            [Op.between]: [now, futureDate]
          },
          status: 'active'
        },
        required: true
      }
    ]
  });

  return vehicles;
}

