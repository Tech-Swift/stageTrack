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
export async function createRoute(data, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');
  const isAdmin = user.system_roles?.includes('admin');

  let saccoId = null;

  // 🟢 NORMAL ADMIN → always forced to their SACCO
  if (isAdmin && !isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('Admin is not assigned to any SACCO');
    }
    saccoId = user.sacco_id;
  }

  // 🔵 SUPER ADMIN → may or may not provide SACCO
  if (isSuperAdmin) {
    saccoId = data.sacco_id || null; // null = global route
  }

  const { county_id, route_code, origin, destination, is_active = true } = data;

  if (!county_id || !route_code || !origin || !destination) {
    throw new Error('county_id, route_code, origin, and destination are required');
  }

  // If SACCO is provided, verify it exists
  if (saccoId) {
    const sacco = await SACCO.findByPk(saccoId);
    if (!sacco) throw new Error('SACCO not found');
  }

  // Route code uniqueness rule:
  // - If route belongs to SACCO → unique within that SACCO
  // - If global route → must be globally unique
  const existing = await Route.findOne({
    where: saccoId
      ? { sacco_id: saccoId, route_code }
      : { sacco_id: null, route_code }
  });

  if (existing) {
    throw new Error(
      saccoId
        ? 'Route code already exists for this SACCO'
        : 'Global route code already exists'
    );
  }

  const county = await County.findByPk(county_id);
  if (!county) throw new Error('County not found');

  const route = await Route.create({
    sacco_id: saccoId, // null if global
    county_id,
    route_code,
    origin,
    destination,
    is_active
  });

  await createAuditLog({
    sacco_id: saccoId,
    user_id: user.id,
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
/**
 * Fetch routes by SACCO or globally
 * @param {Object} user - requesting user
 * @param {Object} options - optional filters
 * @param {string} options.sacco_id - optional SACCO filter (super_admin only)
 * @param {string} options.county_id - optional county filter
 * @param {boolean} options.is_active - optional active status filter
 * @param {boolean} options.include_stages - whether to include stages
 */
export async function getRoutes(user, options = {}) {
  const { sacco_id: querySaccoId, county_id, is_active, include_stages = true } = options;

  const isSuperAdmin = user.system_roles?.includes('super_admin');
  const isAdmin = user.system_roles?.includes('admin');

  const where = {};

  // Admin: restrict to their SACCO
  if (isAdmin && !isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('Admin is not assigned to any SACCO');
    }
    where.sacco_id = user.sacco_id;
  }

  // Super Admin: optional SACCO filter
  if (isSuperAdmin) {
    if (querySaccoId) {
      where.sacco_id = querySaccoId;
    }
    // if no querySaccoId, leave empty to fetch all routes
  }

  // Optional filters
  if (county_id) where.county_id = county_id;
  if (is_active !== undefined) where.is_active = is_active;

  // Include related models
  const include = [
    {
      model: County,
      as: 'county',
      attributes: ['id', 'name', 'code']
    },
    {
      model: SACCO,
      as: 'sacco',
      attributes: ['id', 'name', 'status']
    }
  ];

  if (include_stages) {
    include.push({
      model: Stage,
      as: 'stages',
      attributes: ['id', 'name', 'sequence_order'],
      order: [['sequence_order', 'ASC']],
      required: false
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
 * Fetch a single route by ID with SACCO isolation
 * @param {string} routeId
 * @param {Object} user
 */
export async function getRouteById(routeId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');
  const where = { id: routeId };

  // Normal admin: restrict to their SACCO
  if (!isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('Admin is not assigned to any SACCO');
    }
    where.sacco_id = user.sacco_id;
  }

  const route = await Route.findOne({
    where,
    include: [
      { model: County, as: 'county', attributes: ['id', 'name', 'code'] },
      { model: SACCO, as: 'sacco', attributes: ['id', 'name', 'status'] },
      {
        model: Stage,
        as: 'stages',
        attributes: ['id', 'name', 'sequence_order'],
        order: [['sequence_order', 'ASC']],
        required: false
      }
    ]
  });

  if (!route) throw new Error('Route not found or access denied');

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


