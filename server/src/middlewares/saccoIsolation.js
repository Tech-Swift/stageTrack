/**
 * Multi-Tenancy Middleware for SACCO Data Isolation
 * 
 * This middleware ensures that:
 * - No SACCO can see another SACCO's data (unless super_admin)
 * - All queries are automatically filtered by sacco_id
 * - Super admins can access all data
 */

import { Role } from '../models/index.js';

/**
 * Middleware to enforce SACCO isolation
 * Automatically filters queries by sacco_id based on the authenticated user
 */
export function enforceSaccoIsolation(req, res, next) {
  // Store the user's SACCO context
  req.saccoContext = {
    saccoId: req.user?.sacco_id || null,
    isSuperAdmin: false // Will be set by role check
  };

  // Add helper method to get SACCO filter
  req.getSaccoFilter = () => {
    // Super admins can see all data
    if (req.saccoContext.isSuperAdmin) {
      return {}; // No filter for super admin
    }

    // Regular users can only see their SACCO's data
    if (req.saccoContext.saccoId) {
      return { sacco_id: req.saccoContext.saccoId };
    }

    // Users without SACCO assignment can't see any SACCO data
    return { sacco_id: null }; // This will return empty results
  };

  next();
}

/**
 * Middleware to check if user is super admin
 * Should be used after role authentication
 */
export async function checkSuperAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user has super_admin role
    const { UserRole, Role } = await import('../models/index.js');
    const userRoles = await UserRole.findAll({
      where: { user_uuid: req.user.id },
      include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });

    const isSuperAdmin = userRoles.some(
      ur => ur.role && ur.role.name === 'super_admin'
    );

    if (req.saccoContext) {
      req.saccoContext.isSuperAdmin = isSuperAdmin;
    }

    next();
  } catch (error) {
    console.error('Error checking super admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Helper function to ensure SACCO isolation in queries
 * Use this in your services/controllers to automatically filter by SACCO
 */
export function applySaccoFilter(query, saccoId, isSuperAdmin = false) {
  if (isSuperAdmin) {
    return query; // Super admin sees all
  }

  if (saccoId) {
    // Add sacco_id filter to where clause
    if (query.where) {
      query.where.sacco_id = saccoId;
    } else {
      query.where = { sacco_id: saccoId };
    }
  } else {
    // User without SACCO - return empty results
    query.where = { sacco_id: null };
  }

  return query;
}

/**
 * Middleware to verify user belongs to the SACCO they're trying to access
 */
export function verifySaccoAccess(req, res, next) {
  const requestedSaccoId = req.params.saccoId || req.params.id || req.body.sacco_id || req.query.sacco_id;

  // Super admin can access any SACCO
  if (req.saccoContext?.isSuperAdmin) {
    return next();
  }

  // If no SACCO ID specified, allow (will be filtered by user's SACCO in controller)
  if (!requestedSaccoId) {
    return next();
  }

  // User must belong to the requested SACCO
  if (requestedSaccoId !== req.user?.sacco_id) {
    return res.status(403).json({ 
      message: 'Access denied: You do not have permission to access this SACCO\'s data' 
    });
  }

  next();
}

export default {
  enforceSaccoIsolation,
  checkSuperAdmin,
  applySaccoFilter,
  verifySaccoAccess
};

