/**
 * Multi-Tenancy Middleware for SACCO Data Isolation
 * 
 * This middleware ensures that:
 * - No SACCO can see another SACCO's data (unless super_admin)
 * - All queries are automatically filtered by sacco_id
 * - Super admins can access all data
 */
import SaccoUser from '../models/Sacco/SaccoUser.js';
import { Role } from '../models/index.js';

/**
 * Middleware to enforce SACCO isolation
 * Automatically filters queries by sacco_id based on the authenticated user
 */

export const enforceSaccoIsolation = (req, res, next) => {
  const user = req.user;

  // 🔑 Super admin bypass
  const isSuperAdmin = user.roles?.some(
    role => role.name === "super_admin"
  );

  if (isSuperAdmin) {
    return next();
  }

  // Normal users must belong to a sacco
  if (!user.sacco_id) {
    return res.status(403).json({
      message: "User is not associated with a SACCO"
    });
  }

  const saccoIdFromRequest =
    req.params.sacco_id ||
    req.body.sacco_id ||
    req.query.sacco_id;

  if (!saccoIdFromRequest) {
    return res.status(400).json({
      message: "SACCO ID is required"
    });
  }

  if (user.sacco_id !== saccoIdFromRequest) {
    return res.status(403).json({
      message: "Access denied for this SACCO"
    });
  }

  next();
};

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
export async function verifySaccoAccess(req, res, next) {
  try {
    // normalize candidate sacco id from common locations
    let requestedSaccoId =
      req.params.saccoId ||
      req.params.id ||
      req.body.sacco_id ||
      req.query.sacco_id;

    // ensure authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1️⃣ Super admin can access everything
    if (req.saccoContext?.isSuperAdmin) {
      return next();
    }

    // if no SACCO specified, allow (controllers will apply filters)
    if (!requestedSaccoId) {
      return next();
    }

    // sometimes routes like "/users" can be matched into params/id — ignore non-UUID values
    const isUuid = typeof requestedSaccoId === 'string' && /^[0-9a-fA-F-]{36}$/.test(requestedSaccoId);
    if (!isUuid) {
      // not a UUID — skip membership check
      return next();
    }

    // 🔒 Hard rule: sacco_admin may only act within their own sacco
    if (
      req.user.role === 'sacco_admin' &&
      req.user.sacco_id &&
      String(requestedSaccoId) !== String(req.user.sacco_id)
    ) {
      return res.status(403).json({
        message: 'Unauthorized SACCO action'
      });
    }

    // primary SACCO match (fast path)
    if (req.user?.sacco_id && String(req.user.sacco_id) === String(requestedSaccoId)) {
      return next();
    }

    // fallback: check sacco_users membership (only run with validated UUID)
    let membership;
    try {
      membership = await SaccoUser.findOne({
        where: {
          user_id: req.user.id,
          sacco_id: requestedSaccoId,
          status: 'active'
        }
      });
    } catch (dbErr) {
      console.error('verifySaccoAccess DB error:', dbErr);
      return res.status(500).json({ message: 'Database error while verifying SACCO access' });
    }

    if (!membership) {
      return res.status(403).json({
        message: "Access denied: You do not have permission to access this SACCO's data"
      });
    }

    // attach membership for downstream handlers if needed
    req.saccoMembership = membership;
    return next();
  } catch (err) {
    console.error('verifySaccoAccess error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  enforceSaccoIsolation,
  checkSuperAdmin,
  applySaccoFilter,
  verifySaccoAccess
};

