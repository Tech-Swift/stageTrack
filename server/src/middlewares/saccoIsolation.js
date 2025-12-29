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
  const user = req.user || {};

    const isSuperAdmin =
    user.system_roles?.includes('super_admin') ||
    req.saccoContext?.isSuperAdmin;

  if (isSuperAdmin) {
    console.log('Super admin bypassing SACCO isolation');
    return next(); // ⬅️ NOTHING below should run
  }


    if (!user.sacco_role || !user.sacco_id) {
    console.log('Blocking: user has no SACCO role or SACCO ID');
    return res.status(403).json({ message: 'User has no SACCO role or SACCO ID' });
  }

    const saccoIdFromRequest =
    req.params?.saccoId ||
    req.params?.sacco_id ||
    req.body?.sacco_id ||
    req.query?.sacco_id;

   if (!saccoIdFromRequest) {
    return res.status(400).json({ message: 'SACCO ID is required' });
  }

  if (user.sacco_id !== saccoIdFromRequest) {
    console.log('Access denied: user.sacco_id != requested saccoId');
    return res.status(403).json({ message: 'Access denied for this SACCO' });
  }

  next();
};

  
/**
 * Middleware to check if user is super admin
 * Should be used after role authentication
 */
export function checkSuperAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Use system_roles from JWT payload (populated during login)
    const systemRoles = Array.isArray(req.user.system_roles) ? req.user.system_roles : [];
    const isSuperAdmin = systemRoles.includes('super_admin');

    // Optionally attach to saccoContext for downstream usage
    if (!req.saccoContext) req.saccoContext = {};
    req.saccoContext.isSuperAdmin = isSuperAdmin;

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
    // Normalize candidate SACCO ID from common locations
    const requestedSaccoId =
      req.params.saccoId ||
      req.params.id ||
      req.body.sacco_id ||
      req.query.sacco_id;

    // Ensure authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1️⃣ Super admin bypass (system_roles or saccoContext)
    const isSuperAdmin =
      req.user.system_roles?.includes('super_admin') ||
      req.saccoContext?.isSuperAdmin;

    if (isSuperAdmin) {
      console.log('Super admin bypassing SACCO access check');
      return next();
    }

    // 2️⃣ If no SACCO specified, allow access (controllers can apply filters)
    if (!requestedSaccoId) {
      return next();
    }

    // 3️⃣ Validate UUID
    const isUuid = typeof requestedSaccoId === 'string' && /^[0-9a-fA-F-]{36}$/.test(requestedSaccoId);
    if (!isUuid) {
      return next(); // skip membership check for non-UUID values
    }

    // 4️⃣ Fast path: user’s SACCO matches requested SACCO
    if (req.user.sacco_id && String(req.user.sacco_id) === String(requestedSaccoId)) {
      return next();
    }

    // 5️⃣ Check sacco_users membership as fallback
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

    // Attach membership for downstream handlers
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

