/**
 * Stage Service
 * Business logic for Stage management
 */
import { Op } from 'sequelize';
import { Stage, Route, StageCapacityRule, StageLog, StageAssignment } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';
import { getRouteById } from './routeService.js';

/**
 * Create a new stage
 * @param {Object} data - Stage data
 * @param {string} data.route_id - Route ID
 * @param {string} data.name - Stage name
 * @param {number} data.sequence_order - Sequence order in route
 * @param {string} saccoId - SACCO ID (for multi-tenancy)
 * @param {string} userId - User ID creating the stage
 */
export async function createStage(data, saccoId, userId) {
  const { route_id, name, sequence_order } = data;

  // Validate required fields
  if (!route_id || !name || sequence_order === undefined) {
    throw new Error('Route ID, name, and sequence order are required');
  }

  // Verify route exists and belongs to SACCO
  const route = await getRouteById(route_id, saccoId);
  if (!route) {
    throw new Error('Route not found or does not belong to this SACCO');
  }

  // Check if sequence_order already exists for this route
  const existingSequence = await Stage.findOne({
    where: {
      route_id,
      sequence_order
    }
  });

  if (existingSequence) {
    throw new Error(`Stage with sequence order ${sequence_order} already exists for this route`);
  }

  // Create stage
  const stage = await Stage.create({
    route_id,
    name,
    sequence_order
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'create_stage',
    entity: 'stage',
    entity_id: stage.id,
    metadata: { route_id, name, sequence_order }
  });

  return stage;
}

/**
 * Get all stages for a route
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Additional options
 */
export async function getStagesByRoute(routeId, saccoId, options = {}) {
  // Verify route belongs to SACCO
  await getRouteById(routeId, saccoId);

  const stages = await Stage.findAll({
    where: { route_id: routeId },
    include: [
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'route_code', 'origin', 'destination']
      }
    ],
    order: [['sequence_order', 'ASC']]
  });

  return stages;
}

/**
 * Get stage by ID
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getStageById(stageId, saccoId) {
  const stage = await Stage.findOne({
    where: { id: stageId },
    include: [
      {
        model: Route,
        as: 'route',
        where: { sacco_id: saccoId },
        attributes: ['id', 'route_code', 'origin', 'destination', 'sacco_id']
      }
    ]
  });

  if (!stage) {
    throw new Error('Stage not found or does not belong to this SACCO');
  }

  return stage;
}

/**
 * Update stage
 * @param {string} stageId - Stage ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function updateStage(stageId, data, saccoId, userId) {
  const stage = await getStageById(stageId, saccoId);

  // If sequence_order is being updated, check for conflicts
  if (data.sequence_order !== undefined && data.sequence_order !== stage.sequence_order) {
    const existing = await Stage.findOne({
      where: {
        route_id: stage.route_id,
        sequence_order: data.sequence_order,
        id: { [Op.ne]: stageId }
      }
    });

    if (existing) {
      throw new Error(`Stage with sequence order ${data.sequence_order} already exists for this route`);
    }
  }

  // Update stage
  await stage.update(data);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_stage',
    entity: 'stage',
    entity_id: stageId,
    metadata: data
  });

  return stage;
}

/**
 * Delete stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function deleteStage(stageId, saccoId, userId) {
  const stage = await getStageById(stageId, saccoId);

  // Check for dependencies
  const [assignments, capacityRules, logs] = await Promise.all([
    StageAssignment.count({ where: { stage_id: stageId } }),
    StageCapacityRule.count({ where: { stage_id: stageId } }),
    StageLog.count({ where: { stage_id: stageId } })
  ]);

  if (assignments > 0 || capacityRules > 0 || logs > 0) {
    throw new Error('Cannot delete stage with existing assignments, capacity rules, or logs');
  }

  await stage.destroy();

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_stage',
    entity: 'stage',
    entity_id: stageId,
    metadata: { name: stage.name }
  });

  return { message: 'Stage deleted successfully' };
}

/**
 * Get stage statistics
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getStageStats(stageId, saccoId) {
  const stage = await getStageById(stageId, saccoId);

  // Get current capacity rule
  const currentCapacityRule = await StageCapacityRule.findOne({
    where: {
      stage_id: stageId,
      effective_from: { [Op.lte]: new Date() },
      [Op.or]: [
        { effective_to: null },
        { effective_to: { [Op.gte]: new Date() } }
      ]
    },
    order: [['effective_from', 'DESC']]
  });

  // Get current assignments
  const activeAssignments = await StageAssignment.count({
    where: {
      stage_id: stageId,
      active: true,
      shift_start: { [Op.lte]: new Date() },
      [Op.or]: [
        { shift_end: null },
        { shift_end: { [Op.gte]: new Date() } }
      ]
    }
  });

  // Get recent logs (last 24 hours)
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  
  const recentLogs = await StageLog.count({
    where: {
      stage_id: stageId,
      timestamp: { [Op.gte]: yesterday }
    }
  });

  return {
    stage_id: stage.id,
    stage_name: stage.name,
    sequence_order: stage.sequence_order,
    max_vehicles: currentCapacityRule?.max_vehicles || null,
    queue_strategy: currentCapacityRule?.queue_strategy || null,
    active_marshals: activeAssignments,
    recent_activity: recentLogs
  };
}


