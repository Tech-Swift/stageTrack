/**
 * Stage Log Service
 * Business logic for vehicle arrivals, departures, and queue management
 * This is the core matatu stage operational logic
 */
import { Op } from 'sequelize';
import { StageLog, Stage, Route, StageCapacityRule, StageAssignment, User } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';
import { getStageById } from './stageService.js';
import { getCurrentCapacityRule } from './capacityRuleService.js';
import { getActiveMarshals } from './stageAssignmentService.js';

/**
 * Log vehicle arrival at stage
 * @param {Object} data - Arrival data
 * @param {string} data.stage_id - Stage ID
 * @param {string} data.vehicle_id - Vehicle ID
 * @param {string} data.logged_by - Marshal user ID logging the event
 * @param {Date} data.timestamp - Event timestamp (optional, defaults to now)
 * @param {string} saccoId - SACCO ID
 */
export async function logArrival(data, saccoId) {
  const { stage_id, vehicle_id, logged_by, timestamp } = data;

  // Validate required fields
  if (!stage_id || !vehicle_id || !logged_by) {
    throw new Error('Stage ID, vehicle ID, and logged_by are required');
  }

  // Verify stage belongs to SACCO
  await getStageById(stage_id, saccoId);

  // Verify marshal is assigned to this stage
  const activeMarshals = await getActiveMarshals(stage_id, saccoId);
  const marshal = activeMarshals.find(m => m.marshal.id === logged_by);
  if (!marshal) {
    throw new Error('Marshal is not assigned to this stage or shift is not active');
  }

  // Check if vehicle is already at stage (has arrival but no departure)
  const existingArrival = await StageLog.findOne({
    where: {
      stage_id,
      vehicle_id,
      event_type: 'ARRIVAL',
      timestamp: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    order: [['timestamp', 'DESC']]
  });

  if (existingArrival) {
    // Check if there's a departure after this arrival
    const departure = await StageLog.findOne({
      where: {
        stage_id,
        vehicle_id,
        event_type: 'DEPARTURE',
        timestamp: { [Op.gt]: existingArrival.timestamp }
      }
    });

    if (!departure) {
      throw new Error('Vehicle is already at this stage');
    }
  }

  // Check capacity before allowing arrival
  const capacityCheck = await checkStageCapacity(stage_id, saccoId);
  if (!capacityCheck.can_arrive) {
    throw new Error(`Stage at capacity: ${capacityCheck.reason}`);
  }

  // Create arrival log
  const log = await StageLog.create({
    stage_id,
    vehicle_id,
    event_type: 'ARRIVAL',
    logged_by,
    timestamp: timestamp || new Date()
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: logged_by,
    action: 'log_arrival',
    entity: 'stage_log',
    entity_id: log.id,
    metadata: { stage_id, vehicle_id }
  });

  return {
    ...log.toJSON(),
    queue_position: await getQueuePosition(stage_id, vehicle_id),
    stage_status: await getStageStatus(stage_id, saccoId)
  };
}

/**
 * Log vehicle departure from stage
 * @param {Object} data - Departure data
 * @param {string} data.stage_id - Stage ID
 * @param {string} data.vehicle_id - Vehicle ID
 * @param {string} data.logged_by - Marshal user ID logging the event
 * @param {Date} data.timestamp - Event timestamp (optional, defaults to now)
 * @param {string} saccoId - SACCO ID
 */
export async function logDeparture(data, saccoId) {
  const { stage_id, vehicle_id, logged_by, timestamp } = data;

  // Validate required fields
  if (!stage_id || !vehicle_id || !logged_by) {
    throw new Error('Stage ID, vehicle ID, and logged_by are required');
  }

  // Verify stage belongs to SACCO
  await getStageById(stage_id, saccoId);

  // Verify marshal is assigned to this stage
  const activeMarshals = await getActiveMarshals(stage_id, saccoId);
  const marshal = activeMarshals.find(m => m.marshal.id === logged_by);
  if (!marshal) {
    throw new Error('Marshal is not assigned to this stage or shift is not active');
  }

  // Check if vehicle is actually at stage (has arrival but no departure)
  const lastArrival = await StageLog.findOne({
    where: {
      stage_id,
      vehicle_id,
      event_type: 'ARRIVAL',
      timestamp: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    order: [['timestamp', 'DESC']]
  });

  if (!lastArrival) {
    throw new Error('Vehicle has not arrived at this stage');
  }

  // Check if already departed
  const lastDeparture = await StageLog.findOne({
    where: {
      stage_id,
      vehicle_id,
      event_type: 'DEPARTURE',
      timestamp: { [Op.gt]: lastArrival.timestamp }
    }
  });

  if (lastDeparture) {
    throw new Error('Vehicle has already departed from this stage');
  }

  // Create departure log
  const log = await StageLog.create({
    stage_id,
    vehicle_id,
    event_type: 'DEPARTURE',
    logged_by,
    timestamp: timestamp || new Date()
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: logged_by,
    action: 'log_departure',
    entity: 'stage_log',
    entity_id: log.id,
    metadata: { stage_id, vehicle_id }
  });

  return {
    ...log.toJSON(),
    stage_status: await getStageStatus(stage_id, saccoId)
  };
}

/**
 * Check if stage can accept more vehicles (capacity check)
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function checkStageCapacity(stageId, saccoId) {
  // Get current capacity rule
  const capacityRule = await getCurrentCapacityRule(stageId, saccoId);
  
  if (!capacityRule) {
    // No capacity rule means unlimited capacity
    return { can_arrive: true, reason: null, current_count: 0, max_vehicles: null };
  }

  // Count vehicles currently at stage
  const currentVehicles = await getVehiclesAtStage(stageId);
  const currentCount = currentVehicles.length;

  if (currentCount >= capacityRule.max_vehicles) {
    return {
      can_arrive: false,
      reason: `Stage at capacity (${currentCount}/${capacityRule.max_vehicles})`,
      current_count: currentCount,
      max_vehicles: capacityRule.max_vehicles,
      overflow_action: capacityRule.overflow_action
    };
  }

  return {
    can_arrive: true,
    reason: null,
    current_count: currentCount,
    max_vehicles: capacityRule.max_vehicles,
    available_slots: capacityRule.max_vehicles - currentCount
  };
}

/**
 * Get vehicles currently at stage
 * @param {string} stageId - Stage ID
 */
export async function getVehiclesAtStage(stageId) {
  // Get all arrivals in last 24 hours
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const arrivals = await StageLog.findAll({
    where: {
      stage_id: stageId,
      event_type: 'ARRIVAL',
      timestamp: { [Op.gte]: yesterday }
    },
    order: [['timestamp', 'ASC']]
  });

  // Filter out vehicles that have departed
  const vehiclesAtStage = [];
  for (const arrival of arrivals) {
    const departure = await StageLog.findOne({
      where: {
        stage_id: stageId,
        vehicle_id: arrival.vehicle_id,
        event_type: 'DEPARTURE',
        timestamp: { [Op.gt]: arrival.timestamp }
      }
    });

    if (!departure) {
      vehiclesAtStage.push({
        vehicle_id: arrival.vehicle_id,
        arrived_at: arrival.timestamp,
        logged_by: arrival.logged_by
      });
    }
  }

  return vehiclesAtStage;
}

/**
 * Get queue position for a vehicle
 * @param {string} stageId - Stage ID
 * @param {string} vehicleId - Vehicle ID
 */
export async function getQueuePosition(stageId, vehicleId) {
  const vehiclesAtStage = await getVehiclesAtStage(stageId);
  const position = vehiclesAtStage.findIndex(v => v.vehicle_id === vehicleId);
  
  return position >= 0 ? position + 1 : null;
}

/**
 * Get stage status (real-time operational status)
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getStageStatus(stageId, saccoId) {
  const stage = await getStageById(stageId, saccoId);
  const capacityRule = await getCurrentCapacityRule(stageId, saccoId);
  const vehiclesAtStage = await getVehiclesAtStage(stageId);
  const activeMarshals = await getActiveMarshals(stageId, saccoId);

  const currentCount = vehiclesAtStage.length;
  const maxVehicles = capacityRule?.max_vehicles || null;
  const isAtCapacity = maxVehicles ? currentCount >= maxVehicles : false;

  return {
    stage_id: stageId,
    stage_name: stage.name,
    current_vehicles: currentCount,
    max_vehicles: maxVehicles,
    available_slots: maxVehicles ? maxVehicles - currentCount : null,
    is_at_capacity: isAtCapacity,
    queue_strategy: capacityRule?.queue_strategy || 'FIFO',
    overflow_action: capacityRule?.overflow_action || 'HOLD',
    active_marshals: activeMarshals.length,
    vehicles: vehiclesAtStage.map((v, index) => ({
      ...v,
      queue_position: index + 1
    }))
  };
}

/**
 * Get stage logs with filtering
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Filter options
 */
export async function getStageLogs(stageId, saccoId, options = {}) {
  const {
    vehicle_id,
    event_type,
    logged_by,
    start_date,
    end_date,
    limit = 100,
    offset = 0
  } = options;

  // Verify stage belongs to SACCO
  await getStageById(stageId, saccoId);

  const where = { stage_id: stageId };
  if (vehicle_id) where.vehicle_id = vehicle_id;
  if (event_type) where.event_type = event_type;
  if (logged_by) where.logged_by = logged_by;
  if (start_date || end_date) {
    where.timestamp = {};
    if (start_date) where.timestamp[Op.gte] = new Date(start_date);
    if (end_date) where.timestamp[Op.lte] = new Date(end_date);
  }

  const logs = await StageLog.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'loggedBy',
        attributes: ['id', 'username', 'first_name', 'last_name']
      },
      {
        model: Stage,
        as: 'stage',
        attributes: ['id', 'name']
      }
    ],
    order: [['timestamp', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  return {
    logs: logs.rows,
    total: logs.count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  };
}

/**
 * Get vehicle history across stages
 * @param {string} vehicleId - Vehicle ID
 * @param {string} saccoId - SACCO ID (optional, for filtering)
 */
export async function getVehicleHistory(vehicleId, saccoId = null) {
  const include = [
    {
      model: Stage,
      as: 'stage',
      include: [
        {
          model: Route,
          as: 'route',
          ...(saccoId ? { where: { sacco_id: saccoId } } : {}),
          attributes: ['id', 'route_code', 'origin', 'destination']
        }
      ],
      attributes: ['id', 'name', 'sequence_order']
    },
    {
      model: User,
      as: 'loggedBy',
      attributes: ['id', 'username', 'first_name', 'last_name']
    }
  ];

  const logs = await StageLog.findAll({
    where: { vehicle_id: vehicleId },
    include,
    order: [['timestamp', 'DESC']],
    limit: 100
  });

  return logs;
}


