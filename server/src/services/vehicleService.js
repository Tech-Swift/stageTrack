/**
 * Vehicle Service
 * Business logic for vehicle management with audit logging
 */
import { Op } from 'sequelize';
import { Vehicle, SACCO, Route, VehicleStatusHistory } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new vehicle
 * @param {Object} data - Vehicle data
 * @param {string} data.plate_no - Vehicle plate number
 * @param {number} data.capacity - Vehicle capacity
 * @param {string} data.sacco_id - SACCO ID
 * @param {string} data.route_id - Route ID (optional)
 * @param {string} data.status - Initial status (default: "active")
 * @param {string} userId - User ID creating the vehicle
 */
export async function createVehicle(data, user) {
  // Destructure data and fallback SACCO ID from user token
  const { plate_no, capacity, sacco_id: requestedSaccoId, route_id, status = 'active' } = data;

  // Determine which SACCO this vehicle belongs to
  const saccoId = requestedSaccoId || user.sacco_id; // token SACCO used if not provided

  // Debug log after declaration
  console.log('SERVICE SACCO ID:', saccoId, 'USER:', user);

  // Validate required fields
  if (!plate_no || !capacity || !saccoId) {
    throw new Error('Plate number, capacity, and SACCO ID are required');
  }

  // Check permission: non-super-admin can only create vehicles in their SACCO
  const isSuperAdmin = user.system_roles?.includes('super_admin');
  if (!isSuperAdmin && saccoId !== user.sacco_id) {
    throw new Error('Access denied: cannot create vehicle for another SACCO');
  }

  // Verify SACCO exists
  const sacco = await SACCO.findByPk(saccoId);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  // Verify route exists if provided and belongs to the SACCO
  if (route_id) {
    const route = await Route.findOne({
      where: { id: route_id, sacco_id: saccoId }
    });
    if (!route) {
      throw new Error('Route not found or does not belong to this SACCO');
    }
  }

  // Check if plate number already exists
  const existing = await Vehicle.findOne({ where: { plate_no } });
  if (existing) {
    throw new Error('Vehicle with this plate number already exists');
  }

  // Create vehicle
  const vehicle = await Vehicle.create({
    plate_no,
    capacity,
    sacco_id: saccoId,
    route_id: route_id || null,
    status
  });

  // Create initial status history entry
  await VehicleStatusHistory.create({
    vehicle_id: vehicle.id,
    old_status: null,
    new_status: status,
    changed_by: user.saccoId ? user.id : null,
    reason: 'Initial vehicle registration'
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: user.id,
    action: 'create_vehicle',
    entity: 'vehicle',
    entity_id: vehicle.id,
    metadata: { plate_no, capacity, route_id: route_id || null, status }
  });

  return vehicle;
}
/**
 * Get all vehicles for a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Filter options
 * @param {string} options.route_id - Filter by route ID
 * @param {string} options.status - Filter by status
 */

export async function getVehicles(filter = {}, user) {
  const { sacco_id: querySaccoId, route_id, status } = filter;

  const where = {};

  const isSuperAdmin = user.system_roles?.includes("super_admin");
  const isAdmin = user.system_roles?.includes("admin");

  // 🟢 SUPER ADMIN — full or filtered access
  if (isSuperAdmin) {
    if (querySaccoId) {
      where.sacco_id = querySaccoId;
    }
  }

  // 🔵 SACCO ADMIN — STRICT TENANT ISOLATION
  else if (isAdmin) {
    if (!user.sacco_id) {
      throw new Error("Admin account is not assigned to any SACCO");
    }

    // Ignore any sacco_id from query — enforce tenant boundary
    where.sacco_id = user.sacco_id;
  }

  // 🟡 Other roles (manager, director, etc.)
  else if (user.sacco_id) {
    where.sacco_id = user.sacco_id;
  } else {
    throw new Error("User is not assigned to a SACCO");
  }

  // Optional filters
  if (route_id) where.route_id = route_id;
  if (status) where.status = status;

  const vehicles = await Vehicle.findAll({
    where,
    include: [
      {
        model: SACCO,
        as: "sacco",
        attributes: ["id", "name", "status"],
      },
      {
        model: Route,
        as: "route",
        attributes: ["id", "route_code", "origin", "destination"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return vehicles;
}



/**
 * Get a single vehicle by ID
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 */
export async function getVehicleById(vehicleId, saccoId = null) {
  const whereClause = { id: vehicleId };

  // Only enforce SACCO isolation if saccoId is provided
  if (saccoId) {
    whereClause.sacco_id = saccoId;
  }

  const vehicle = await Vehicle.findOne({
    where: whereClause,
    include: [
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name', 'status']
      },
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'route_code', 'origin', 'destination'],
        required: false
      }
    ]
  });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  return vehicle;
}


/**
 * Update a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the update
 */
export async function updateVehicle(vehicleId, data, saccoId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  const whereClause = { id: vehicleId };
  if (!isSuperAdmin) {
    // Only enforce SACCO isolation for normal users
    whereClause.sacco_id = saccoId;
  }

  const vehicle = await Vehicle.findOne({ where: whereClause });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  const oldData = { ...vehicle.toJSON() };
  const oldStatus = vehicle.status;

  // Update allowed fields
  const allowedFields = ['plate_no', 'capacity', 'route_id', 'status'];
  const updateData = {};
  allowedFields.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  // Verify route exists
  if (updateData.route_id !== undefined && updateData.route_id !== null) {
    const routeWhere = { id: updateData.route_id };
    if (!isSuperAdmin) routeWhere.sacco_id = saccoId; // only restrict SACCO for normal users

    const route = await Route.findOne({ where: routeWhere });
    if (!route) throw new Error('Route not found or does not belong to this SACCO');
  }

  // Plate number uniqueness (optional: per SACCO or global)
  if (updateData.plate_no && updateData.plate_no !== vehicle.plate_no) {
    const plateWhere = { plate_no: updateData.plate_no };
    if (!isSuperAdmin) plateWhere.sacco_id = saccoId; // optional: restrict per SACCO

    const existing = await Vehicle.findOne({
      where: {
        ...plateWhere,
        id: { [Op.ne]: vehicleId }
      }
    });
    if (existing) throw new Error('Vehicle with this plate number already exists');
  }

  await vehicle.update(updateData);

  // Status history
  if (updateData.status && updateData.status !== oldStatus) {
    await VehicleStatusHistory.create({
      vehicle_id: vehicleId,
      old_status: oldStatus,
      new_status: updateData.status,
      changed_by: user.id,
      reason: data.status_change_reason || 'Status updated'
    });
  }

  // Audit log
  await createAuditLog({
    sacco_id: vehicle.sacco_id, // log the vehicle's SACCO, not necessarily the user's
    user_id: user.id,
    action: 'update_vehicle',
    entity: 'vehicle',
    entity_id: vehicleId,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return vehicle;
}


/**
 * Delete a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the deletion
 */
export async function deleteVehicle(vehicleId, saccoId, userId) {
  const vehicle = await Vehicle.findOne({
    where: {
      id: vehicleId,
      sacco_id: saccoId // Multi-tenancy isolation
    }
  });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  const plateNo = vehicle.plate_no;

  await vehicle.destroy();

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_vehicle',
    entity: 'vehicle',
    entity_id: vehicleId,
    metadata: { plate_no: plateNo }
  });

  return { message: 'Vehicle deleted successfully' };
}

/**
 * Update vehicle status (convenience method with status history logging)
 * @param {string} vehicleId - Vehicle ID
 * @param {string} newStatus - New status
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID changing the status
 * @param {string} reason - Reason for status change
 */
export async function updateVehicleStatus(vehicleId, newStatus, saccoId, userId, reason = null) {
  const vehicle = await Vehicle.findOne({
    where: {
      id: vehicleId,
      sacco_id: saccoId
    }
  });

  if (!vehicle) {
    throw new Error('Vehicle not found or access denied');
  }

  const oldStatus = vehicle.status;

  if (oldStatus === newStatus) {
    throw new Error('Vehicle is already in this status');
  }

  // Update status
  await vehicle.update({ status: newStatus });

  // Log status change
  await VehicleStatusHistory.create({
    vehicle_id: vehicleId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: userId,
    reason: reason || 'Status changed'
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_vehicle_status',
    entity: 'vehicle',
    entity_id: vehicleId,
    metadata: { old_status: oldStatus, new_status: newStatus, reason }
  });

  return vehicle;
}

