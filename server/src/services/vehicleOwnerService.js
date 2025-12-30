/**
 * Vehicle Owner Service
 * Business logic for vehicle owner management with audit logging
 */
import { Op } from 'sequelize';
import { VehicleOwner, VehicleOwnerLink, Vehicle, SACCO } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new vehicle owner
 * @param {Object} data - Owner data
 * @param {string} data.full_name - Owner full name
 * @param {string} data.phone - Owner phone number
 * @param {string} data.email - Owner email (optional)
 * @param {string} data.id_number - Owner ID number (optional)
 * @param {string} data.address - Owner address (optional)
 * @param {string} userId - User ID creating the owner
 */
export async function createVehicleOwner(data, userId) {
  const { full_name, phone, email, id_number, address } = data;

  // Validate required fields
  if (!full_name || !phone) {
    throw new Error('Full name and phone are required');
  }

  // Check if owner with same phone or ID number already exists
  const where = {};
  if (phone) where.phone = phone;
  if (id_number) where.id_number = id_number;

  if (Object.keys(where).length > 0) {
    const existing = await VehicleOwner.findOne({ where });
    if (existing) {
      throw new Error('Owner with this phone number or ID number already exists');
    }
  }

  // Create owner
  const owner = await VehicleOwner.create({
    full_name,
    phone,
    email: email || null,
    id_number: id_number || null,
    address: address || null
  });

  // Note: Audit log will be created when linking owner to vehicle
  // This is because we need sacco_id which comes from the vehicle

  return owner;
}

/**
 * Get all vehicle owners
 * @param {Object} options - Filter options
 * @param {string} options.phone - Filter by phone
 * @param {string} options.id_number - Filter by ID number
 */
export async function getVehicleOwners(options = {}) {
  const { phone, id_number } = options;

  const where = {};
  if (phone) where.phone = phone;
  if (id_number) where.id_number = id_number;

  const owners = await VehicleOwner.findAll({
    where,
    order: [['created_at', 'DESC']]
  });

  return owners;
}

/**
 * Get a single owner by ID
 * @param {string} ownerId - Owner ID
 */
export async function getVehicleOwnerById(ownerId) {
  const owner = await VehicleOwner.findByPk(ownerId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicles',
        through: {
          attributes: ['ownership_percentage', 'is_primary_owner', 'ownership_start_date', 'ownership_end_date']
        },
        required: false
      }
    ]
  });

  if (!owner) {
    throw new Error('Owner not found');
  }

  return owner;
}

/**
 * Update a vehicle owner
 * @param {string} ownerId - Owner ID
 * @param {Object} data - Update data
 * @param {string} userId - User ID performing the update
 */
export async function updateVehicleOwner(ownerId, data, userId) {
  const owner = await VehicleOwner.findByPk(ownerId);

  if (!owner) {
    throw new Error('Owner not found');
  }

  const oldData = { ...owner.toJSON() };

  // Update allowed fields
  const allowedFields = ['full_name', 'phone', 'email', 'id_number', 'address'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // Check phone uniqueness if being updated
  if (updateData.phone && updateData.phone !== owner.phone) {
    const existing = await VehicleOwner.findOne({
      where: {
        phone: updateData.phone,
        id: { [Op.ne]: ownerId }
      }
    });
    if (existing) {
      throw new Error('Owner with this phone number already exists');
    }
  }

  // Check ID number uniqueness if being updated
  if (updateData.id_number && updateData.id_number !== owner.id_number) {
    const existing = await VehicleOwner.findOne({
      where: {
        id_number: updateData.id_number,
        id: { [Op.ne]: ownerId }
      }
    });
    if (existing) {
      throw new Error('Owner with this ID number already exists');
    }
  }

  await owner.update(updateData);

  // Get vehicles owned by this owner to get sacco_id for audit log
  const vehicles = await VehicleOwnerLink.findAll({
    where: { owner_id: ownerId },
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['sacco_id']
      }
    ]
  });

  // Audit log for each SACCO this owner has vehicles in
  const saccoIds = [...new Set(vehicles.map(v => v.vehicle?.sacco_id).filter(Boolean))];
  
  for (const saccoId of saccoIds) {
    await createAuditLog({
      sacco_id: saccoId,
      user_id: userId,
      action: 'update_vehicle_owner',
      entity: 'vehicle_owner',
      entity_id: ownerId,
      metadata: { old_data: oldData, new_data: updateData }
    });
  }

  return owner;
}

/**
 * Link owner to vehicle (create ownership relationship)
 * @param {string} vehicleId - Vehicle ID
 * @param {string} ownerId - Owner ID
 * @param {Object} data - Link data
 * @param {number} data.ownership_percentage - Ownership percentage (default: 100)
 * @param {boolean} data.is_primary_owner - Is primary owner (default: false)
 * @param {Date} data.ownership_start_date - Start date (default: now)
 * @param {string} saccoId - SACCO ID (for audit log)
 * @param {string} userId - User ID creating the link
 */
export async function linkOwnerToVehicle(vehicleId, ownerId, data, saccoId, userId) {
  const { ownership_percentage = 100.00, is_primary_owner = false, ownership_start_date } = data;

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

  // Verify owner exists
  const owner = await VehicleOwner.findByPk(ownerId);
  if (!owner) {
    throw new Error('Owner not found');
  }

  // Check if link already exists (active ownership)
  const existingLink = await VehicleOwnerLink.findOne({
    where: {
      vehicle_id: vehicleId,
      owner_id: ownerId,
      ownership_end_date: null // Active ownership
    }
  });

  if (existingLink) {
    throw new Error('Owner is already linked to this vehicle');
  }

  // If this is primary owner, remove primary status from other owners
  if (is_primary_owner) {
    await VehicleOwnerLink.update(
      { is_primary_owner: false },
      {
        where: {
          vehicle_id: vehicleId,
          ownership_end_date: null
        }
      }
    );
  }

  // Create link
  const link = await VehicleOwnerLink.create({
    vehicle_id: vehicleId,
    owner_id: ownerId,
    ownership_percentage,
    is_primary_owner,
    ownership_start_date: ownership_start_date ? new Date(ownership_start_date) : new Date()
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'link_owner_to_vehicle',
    entity: 'vehicle_owner_link',
    entity_id: link.id,
    metadata: { vehicle_id: vehicleId, owner_id: ownerId, ownership_percentage, is_primary_owner }
  });

  return link;
}

/**
 * Unlink owner from vehicle (end ownership)
 * @param {string} linkId - Link ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID removing the link
 */
export async function unlinkOwnerFromVehicle(linkId, saccoId, userId) {
  const link = await VehicleOwnerLink.findByPk(linkId, {
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: ['sacco_id', 'plate_no']
      }
    ]
  });

  if (!link) {
    throw new Error('Ownership link not found');
  }

  // Verify vehicle belongs to SACCO
  if (link.vehicle.sacco_id !== saccoId) {
    throw new Error('Access denied');
  }

  // End ownership by setting end date
  await link.update({
    ownership_end_date: new Date(),
    is_primary_owner: false // Remove primary status when ending ownership
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'unlink_owner_from_vehicle',
    entity: 'vehicle_owner_link',
    entity_id: linkId,
    metadata: { vehicle_id: link.vehicle_id, owner_id: link.owner_id }
  });

  return { message: 'Owner unlinked from vehicle successfully' };
}

/**
 * Get vehicles for an owner
 * @param {string} ownerId - Owner ID
 */
export async function getVehiclesByOwner(ownerId) {
  const links = await VehicleOwnerLink.findAll({
    where: {
      owner_id: ownerId,
      ownership_end_date: null // Only active ownerships
    },
    include: [
      {
        model: Vehicle,
        as: 'vehicle',
        include: [
          {
            model: SACCO,
            as: 'sacco',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  return links;
}

/**
 * Get owners for a vehicle
 * @param {string} vehicleId - Vehicle ID
 */
export async function getOwnersByVehicle(vehicleId) {
  const links = await VehicleOwnerLink.findAll({
    where: {
      vehicle_id: vehicleId,
      ownership_end_date: null // Only active ownerships
    },
    include: [
      {
        model: VehicleOwner,
        as: 'owner'
      }
    ],
    order: [['is_primary_owner', 'DESC'], ['ownership_percentage', 'DESC']]
  });

  return links;
}

