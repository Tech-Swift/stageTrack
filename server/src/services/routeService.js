/**
 * Route Service
 * Business logic for Route management
 */
import { Op } from 'sequelize';
import { Route, County, SACCO, Stage } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new route
 * @param {Object} data - Route data
 * @param {string} data.sacco_id - SACCO ID
 * @param {string} data.county_id - County ID
 * @param {string} data.route_code - Route code
 * @param {string} data.origin - Origin point
 * @param {string} data.destination - Destination point
 * @param {string} userId - User ID creating the route
 */
export async function createRoute(data, userId) {
  const { sacco_id, county_id, route_code, origin, destination, is_active = true } = data;

  // Validate required fields
  if (!sacco_id || !county_id || !route_code || !origin || !destination) {
    throw new Error('SACCO ID, county ID, route code, origin, and destination are required');
  }

  // Check if route code already exists for this SACCO
  const existing = await Route.findOne({
    where: {
      sacco_id,
      route_code
    }
  });

  if (existing) {
    throw new Error('Route code already exists for this SACCO');
  }

  // Verify county exists
  const county = await County.findByPk(county_id);
  if (!county) {
    throw new Error('County not found');
  }

  // Verify SACCO exists
  const sacco = await SACCO.findByPk(sacco_id);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  // Create route
  const route = await Route.create({
    sacco_id,
    county_id,
    route_code,
    origin,
    destination,
    is_active
  });

  // Audit log
  await createAuditLog({
    sacco_id,
    user_id: userId,
    action: 'create_route',
    entity: 'route',
    entity_id: route.id,
    metadata: { route_code, origin, destination }
  });

  return route;
}

/**
 * Get all routes for a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Filter options
 */
export async function getRoutesBySACCO(saccoId, options = {}) {
  const { county_id, is_active, include_stages = false } = options;

  const where = { sacco_id: saccoId };
  if (county_id) where.county_id = county_id;
  if (is_active !== undefined) where.is_active = is_active;

  const include = [
    {
      model: County,
      as: 'county',
      attributes: ['id', 'name', 'code']
    }
  ];

  if (include_stages) {
    include.push({
      model: Stage,
      as: 'stages',
      attributes: ['id', 'name', 'sequence_order'],
      order: [['sequence_order', 'ASC']]
    });
  }

  const routes = await Route.findAll({
    where,
    include,
    order: [['route_code', 'ASC']]
  });

  return routes;
}

/**
 * Get route by ID
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy)
 */
export async function getRouteById(routeId, saccoId) {
  const route = await Route.findOne({
    where: {
      id: routeId,
      sacco_id: saccoId
    },
    include: [
      {
        model: County,
        as: 'county',
        attributes: ['id', 'name', 'code']
      },
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name']
      },
      {
        model: Stage,
        as: 'stages',
        attributes: ['id', 'name', 'sequence_order'],
        order: [['sequence_order', 'ASC']]
      }
    ]
  });

  if (!route) {
    throw new Error('Route not found');
  }

  return route;
}

/**
 * Update route
 * @param {string} routeId - Route ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function updateRoute(routeId, data, saccoId, userId) {
  const route = await Route.findOne({
    where: {
      id: routeId,
      sacco_id: saccoId
    }
  });

  if (!route) {
    throw new Error('Route not found');
  }

  // If route_code is being updated, check for duplicates
  if (data.route_code && data.route_code !== route.route_code) {
    const existing = await Route.findOne({
      where: {
        sacco_id: saccoId,
        route_code: data.route_code,
        id: { [Op.ne]: routeId }
      }
    });

    if (existing) {
      throw new Error('Route code already exists for this SACCO');
    }
  }

  // Update route
  await route.update(data);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_route',
    entity: 'route',
    entity_id: routeId,
    metadata: data
  });

  return route;
}

/**
 * Delete route (soft delete by setting is_active to false)
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function deleteRoute(routeId, saccoId, userId) {
  const route = await Route.findOne({
    where: {
      id: routeId,
      sacco_id: saccoId
    },
    include: [
      {
        model: Stage,
        as: 'stages'
      }
    ]
  });

  if (!route) {
    throw new Error('Route not found');
  }

  // Check if route has stages
  if (route.stages && route.stages.length > 0) {
    throw new Error('Cannot delete route with existing stages. Remove stages first.');
  }

  // Soft delete
  await route.update({ is_active: false });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_route',
    entity: 'route',
    entity_id: routeId,
    metadata: { route_code: route.route_code }
  });

  return { message: 'Route deleted successfully' };
}

/**
 * Get route statistics
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID
 */
export async function getRouteStats(routeId, saccoId) {
  const route = await Route.findOne({
    where: {
      id: routeId,
      sacco_id: saccoId
    },
    include: [
      {
        model: Stage,
        as: 'stages',
        attributes: ['id']
      }
    ]
  });

  if (!route) {
    throw new Error('Route not found');
  }

  return {
    route_id: route.id,
    route_code: route.route_code,
    total_stages: route.stages?.length || 0,
    is_active: route.is_active
  };
}


