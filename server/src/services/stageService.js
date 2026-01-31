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
 
export async function createStage(data, user) {
  const { route_id, name, sequence_order } = data;

  // Validate required fields
  if (!route_id || !name || sequence_order === undefined) {
    throw new Error('Route ID, name, and sequence order are required');
  }

  // Verify route exists and belongs to user's SACCO (or super_admin)
  const route = await getRouteById(route_id, user);
  if (!route) {
    throw new Error('Route not found or does not belong to your SACCO');
  }

  // Check sequence uniqueness for this route
  const existing = await Stage.findOne({ where: { route_id, sequence_order } });
  if (existing) {
    throw new Error(`Stage with sequence order ${sequence_order} already exists for this route`);
  }

  // Create stage
  const stage = await Stage.create({ route_id, name, sequence_order });

  // Audit log
  await createAuditLog({
    sacco_id: user.sacco_id,
    user_id: user.id,
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
 export async function getStagesByRoute(routeId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  // 🔎 Fetch route with SACCO info
  const route = await Route.findByPk(routeId);

  if (!route) {
    throw new Error('Route not found');
  }


  if (!isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('User is not assigned to any SACCO');
    }

    if (route.sacco_id !== user.sacco_id) {
      throw new Error('Access denied: Route does not belong to your SACCO');
    }
  }

  // ✅ Fetch stages
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
 export async function getStageById(stageId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  const stage = await Stage.findByPk(stageId, {
    include: [
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'route_code', 'origin', 'destination', 'sacco_id']
      }
    ]
  });

  if (!stage) {
    throw new Error('Stage not found');
  }

  // 🔒 SACCO restriction (unless super admin)
  if (!isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('User is not assigned to any SACCO');
    }

    if (stage.route.sacco_id !== user.sacco_id) {
      throw new Error('Access denied: Stage does not belong to your SACCO');
    }
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
export async function updateStage(stageId, routeId, data, user) {
  const { name, sequence_order } = data;

  // Ensure stage exists and belongs to this route
  const stage = await Stage.findOne({
    where: { id: stageId, route_id: routeId }
  });

  if (!stage) {
    throw new Error('Stage not found for this route');
  }

  // 🔒 SAME ACCESS LOGIC AS CREATE
  const route = await getRouteById(routeId, user);
  if (!route) {
    throw new Error('Route not found or does not belong to your SACCO');
  }

  // Prevent duplicate sequence order
  if (sequence_order !== undefined) {
    const existing = await Stage.findOne({
      where: {
        route_id: routeId,
        sequence_order,
        id: { [Op.ne]: stageId }
      }
    });

    if (existing) {
      throw new Error(`Stage with sequence order ${sequence_order} already exists for this route`);
    }

    stage.sequence_order = sequence_order;
  }

  if (name !== undefined) {
    stage.name = name;
  }

  await stage.save();

  await createAuditLog({
    sacco_id: route.sacco_id,
    user_id: user.id,
    action: 'update_stage',
    entity: 'stage',
    entity_id: stage.id,
    metadata: { updated_fields: data }
  });

  return stage;
}

/**
 * Delete stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function deleteStage(stageId, routeId, user) {
  // Ensure stage belongs to the route
  const stage = await Stage.findOne({
    where: { id: stageId, route_id: routeId }
  });

  if (!stage) {
    throw new Error('Stage not found for this route');
  }

  // 🔒 Ensure route belongs to user's SACCO (or super_admin)
  const route = await getRouteById(routeId, user);
  if (!route) {
    throw new Error('Route not found or does not belong to your SACCO');
  }

  // Check dependencies before deletion
  const [assignments, capacityRules, logs] = await Promise.all([
    StageAssignment.count({ where: { stage_id: stageId } }),
    StageCapacityRule.count({ where: { stage_id: stageId } }),
    StageLog.count({ where: { stage_id: stageId } })
  ]);

  if (assignments > 0 || capacityRules > 0 || logs > 0) {
    throw new Error('Cannot delete stage with existing assignments, capacity rules, or logs');
  }

  await stage.destroy();

  await createAuditLog({
    sacco_id: route.sacco_id,
    user_id: user.id,
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

 
export async function getStageStats(stageId, user) {
  if (!user) throw new Error('User is required to fetch stage stats');

  const isSuperAdmin = user.system_roles?.includes('super_admin');

  // 🔒 SACCO isolation: get stage, restrict to user’s SACCO unless super admin
  const stage = await Stage.findOne({
    where: { id: stageId },
    include: [
      {
        model: Route,
        as: 'route',
        attributes: ['id', 'route_code', 'origin', 'destination', 'sacco_id']
      }
    ]
  });

  if (!stage) throw new Error('Stage not found');

  if (!isSuperAdmin && stage.route.sacco_id !== user.sacco_id) {
    throw new Error('Stage does not belong to your SACCO');
  }

  const now = new Date();

  // CURRENT CAPACITY RULE
  const currentCapacityRule = await StageCapacityRule.findOne({
    where: {
      stage_id: stageId,
      effective_from: { [Op.lte]: now },
      [Op.or]: [{ effective_to: null }, { effective_to: { [Op.gte]: now } }]
    },
    order: [['effective_from', 'DESC']]
  });

  // ACTIVE ASSIGNMENTS
  const activeAssignments = await StageAssignment.count({
    where: {
      stage_id: stageId,
      active: true,
      shift_start: { [Op.lte]: now },
      [Op.or]: [{ shift_end: null }, { shift_end: { [Op.gte]: now } }]
    }
  });

  // RECENT LOGS (LAST 24 HOURS)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentLogs = await StageLog.count({
    where: { stage_id: stageId, timestamp: { [Op.gte]: yesterday } }
  });

  return {
    stage_id: stage.id,
    stage_name: stage.name,
    sequence_order: stage.sequence_order,
    route_code: stage.route.route_code,
    sacco_id: stage.route.sacco_id,
    max_vehicles: currentCapacityRule?.max_vehicles || null,
    queue_strategy: currentCapacityRule?.queue_strategy || null,
    active_marshals: activeAssignments,
    recent_activity: recentLogs
  };
}


