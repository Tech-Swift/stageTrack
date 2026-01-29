/**
 * Route Service
 * Business logic for Route management
 */
import { Op } from 'sequelize';
import { Route, County, SACCO, Stage, Vehicle} from '../models/index.js';
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

    /**
     * Soft delete visibility control
     * Default → only active routes
     * If query provides is_active → respect it
     */
    if (is_active !== undefined) {
      where.is_active = is_active;
    } else {
      where.is_active = true; // 👈 hides soft-deleted by default
    }


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
export async function updateRoute(routeId, data, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  // 1️⃣ Find the route first
  const route = await Route.findByPk(routeId);
  if (!route) throw new Error('Route not found');

  // 2️⃣ SACCO ownership check (for non-super-admins)
  if (!isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('User is not assigned to any SACCO');
    }

    if (route.sacco_id !== user.sacco_id) {
      throw new Error('Access denied: You cannot edit routes from another SACCO');
    }
  }

  // 3️⃣ Prevent normal admins from changing SACCO
  if (!isSuperAdmin && data.sacco_id && data.sacco_id !== route.sacco_id) {
    throw new Error('You cannot move a route to another SACCO');
  }

  // 4️⃣ Optional validations if fields are being changed
  if (data.county_id) {
    const county = await County.findByPk(data.county_id);
    if (!county) throw new Error('County not found');
  }

  if (data.route_code && data.route_code !== route.route_code) {
    const existing = await Route.findOne({
      where: {
        sacco_id: route.sacco_id,
        route_code: data.route_code
      }
    });
    if (existing) throw new Error('Route code already exists in this SACCO');
  }

  // 5️⃣ Update allowed fields
  await route.update({
    route_code: data.route_code ?? route.route_code,
    origin: data.origin ?? route.origin,
    destination: data.destination ?? route.destination,
    county_id: data.county_id ?? route.county_id,
    is_active: data.is_active ?? route.is_active,
    sacco_id: isSuperAdmin && data.sacco_id ? data.sacco_id : route.sacco_id
  });

  // 6️⃣ Audit log
  await createAuditLog({
    sacco_id: route.sacco_id,
    user_id: user.id,
    action: 'update_route',
    entity: 'route',
    entity_id: route.id,
    metadata: { updated_fields: data }
  });

  return route;
}


/**
 * Delete route (soft delete by setting is_active to false)
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
 export async function deleteRoute(routeId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  const route = await Route.findByPk(routeId);
  if (!route) throw new Error('Route not found');

  if (!isSuperAdmin) {
    if (!user.sacco_id) {
      throw new Error('User is not assigned to any SACCO');
    }

    if (route.sacco_id !== user.sacco_id) {
      throw new Error('Access denied: You cannot delete routes from another SACCO');
    }
  }

  // Soft delete
  route.is_active = false;
  await route.save();

  await createAuditLog({
    sacco_id: route.sacco_id,
    user_id: user.id,
    action: 'deactivate_route',
    entity: 'route',
    entity_id: route.id,
    metadata: { route_code: route.route_code }
  });

  return route;
}



/**
 * Get route statistics
 * @param {string} routeId - Route ID
 * @param {string} saccoId - SACCO ID
 */

export async function getRouteStats(routeId, user) {
  const isSuperAdmin = user.system_roles?.includes('super_admin');

  const route = await Route.findByPk(routeId, {
    include: [
      { model: County, as: 'county', attributes: ['id', 'name'] }
    ]
  });

  if (!route) throw new Error('Route not found');

  // Base stats
  const totalStages = await Stage.count({ where: { route_id: routeId } });
  const activeStages = await Stage.count({ where: { route_id: routeId, is_active: true } });

  const stats = {
    route_id: route.id,
    route_code: route.route_code,
    county: route.county?.name,
    total_stages: totalStages,
    active_stages: activeStages
  };

  // ---------------------------------
  // Super Admin: show all SACCOs
  // ---------------------------------
  if (isSuperAdmin) {
    // 1️⃣ Operating SACCOs
    const saccoOperators = await Vehicle.findAll({
      attributes: ['sacco_id'],
      where: { route_id: routeId },
      include: [{ model: SACCO, as: 'sacco', attributes: ['id', 'name', 'status'] }],
      group: ['Vehicle.sacco_id', 'sacco.id', 'sacco.name', 'sacco.status']
    });

    stats.operating_saccos = saccoOperators.map(v => v.sacco);
    stats.total_operating_saccos = stats.operating_saccos.length;

    // 2️⃣ Revenue & daily trips per SACCO
    const trips = await Trip.findAll({
      attributes: [
        'sacco_id',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'daily_trip_count'],
        [Sequelize.fn('SUM', Sequelize.col('fare_amount')), 'total_revenue']
      ],
      where: { route_id: routeId },
      group: ['sacco_id']
    });

    stats.sacco_stats = trips.map(t => ({
      sacco_id: t.sacco_id,
      daily_trip_count: parseInt(t.get('daily_trip_count'), 10),
      total_revenue: parseFloat(t.get('total_revenue'))
    }));
  }

  // ---------------------------------
  // SACCO Admin: only for their SACCO
  // ---------------------------------
  else {
    const saccoId = user.sacco_id;

    const vehicleCount = await Vehicle.count({
      where: { route_id: routeId, sacco_id: saccoId }
    });

    const trips = await Trip.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'daily_trip_count'],
        [Sequelize.fn('SUM', Sequelize.col('fare_amount')), 'total_revenue']
      ],
      where: { route_id: routeId, sacco_id: saccoId }
    });

    stats.your_sacco_vehicle_count = vehicleCount;
    stats.your_sacco_daily_trips = trips.length ? parseInt(trips[0].get('daily_trip_count'), 10) : 0;
    stats.your_sacco_revenue = trips.length ? parseFloat(trips[0].get('total_revenue')) : 0;
  }

  return stats;
}




