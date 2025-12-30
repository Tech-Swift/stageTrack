/**
 * Vehicle Status History Service
 * Business logic for vehicle status history queries
 * Note: Status history entries are automatically created when vehicle status changes
 */
import { VehicleStatusHistory, Vehicle, User } from '../models/index.js';

/**
 * Get status history for a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to return
 * @param {number} options.offset - Offset for pagination
 */
export async function getVehicleStatusHistory(vehicleId, saccoId, options = {}) {
  const { limit = 50, offset = 0 } = options;

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

  const history = await VehicleStatusHistory.findAndCountAll({
    where: { vehicle_id: vehicleId },
    include: [
      {
        model: User,
        as: 'changedBy',
        attributes: ['id', 'full_name', 'email'],
        required: false
      }
    ],
    order: [['changed_at', 'DESC']],
    limit,
    offset
  });

  return {
    history: history.rows,
    total: history.count,
    limit,
    offset
  };
}

/**
 * Get latest status for a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 */
export async function getLatestVehicleStatus(vehicleId, saccoId) {
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

  const latestStatus = await VehicleStatusHistory.findOne({
    where: { vehicle_id: vehicleId },
    include: [
      {
        model: User,
        as: 'changedBy',
        attributes: ['id', 'full_name', 'email'],
        required: false
      }
    ],
    order: [['changed_at', 'DESC']]
  });

  return latestStatus;
}

