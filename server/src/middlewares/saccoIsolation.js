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

  // Determine if super admin
  const isSuperAdmin =
    user.system_roles?.includes('super_admin') ||
    req.saccoContext?.isSuperAdmin;

  if (isSuperAdmin) {
    console.log('Super admin bypassing SACCO isolation');
    return next(); // Super admins bypass SACCO isolation
  }

  // Normalize SACCO ID from token
  const userSaccoId = user.sacco_id || user.saccoId;

  // Ensure the user has a SACCO role and SACCO ID
  if (!user.sacco_role || !userSaccoId) {
    console.log('Blocking: user has no SACCO role or SACCO ID');
    return res.status(403).json({ message: 'User has no SACCO role or SACCO ID' });
  }

  // Determine SACCO from request (params, body, query) or fallback to token
  const saccoIdFromRequest =
    req.params?.saccoId ||
    req.params?.sacco_id ||
    req.body?.sacco_id ||
    req.query?.sacco_id ||
    userSaccoId; // ✅ fallback to token SACCO

  // Check if the user is trying to access a SACCO they don’t belong to
  if (userSaccoId !== saccoIdFromRequest) {
    console.log('Access denied: user.sacco_id != requested saccoId');
    return res.status(403).json({ message: 'Access denied for this SACCO' });
  }

  // Attach SACCO context for downstream use
  req.saccoContext = {
    saccoId: saccoIdFromRequest,
    isSuperAdmin
  };

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
    console.log('🔥 verifySaccoAccess hit');
    console.log('req.user:', req.user);
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);
    console.log('req.query:', req.query);

    // Normalize candidate SACCO ID
    let requestedSaccoId = req.params.saccoId || req.body.sacco_id || req.query.sacco_id;
    console.log('Initial requestedSaccoId:', requestedSaccoId);

    // Ensure authenticated user
    if (!req.user || !req.user.id) {
      console.log('No authenticated user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Super admin bypass
    const isSuperAdmin =
      req.user.system_roles?.includes('super_admin') ||
      req.saccoContext?.isSuperAdmin;
    console.log('isSuperAdmin:', isSuperAdmin);

    if (isSuperAdmin) {
      console.log('Super admin bypassing SACCO access check');
      return next();
    }

    // Fallback for admins/directors: use token SACCO
    if (!requestedSaccoId) {
      requestedSaccoId = req.user.sacco_id;
      console.log('Fallback to token SACCO:', requestedSaccoId);
    }

    if (!requestedSaccoId) {
      console.log('No SACCO ID found after fallback');
      return res.status(403).json({
        message: 'Access denied: No SACCO found for this user'
      });
    }

    // Validate UUID
    const isUuid = typeof requestedSaccoId === 'string' && /^[0-9a-fA-F-]{36}$/.test(requestedSaccoId);
    console.log('requestedSaccoId is UUID?', isUuid);

    // Fast path: user's SACCO matches requested SACCO
    if (String(req.user.sacco_id) === String(requestedSaccoId)) {
      console.log('User SACCO matches requested SACCO, access granted');
      return next();
    }

    // Fallback: check membership
    console.log('Checking sacco_users membership...');
    const membership = await SaccoUser.findOne({
      where: {
        user_id: req.user.id,
        sacco_id: requestedSaccoId,
        status: 'active'
      }
    });

    if (!membership) {
      console.log('Membership not found for user in this SACCO');
      return res.status(403).json({
        message: "Access denied: You do not have permission to access this SACCO's data"
      });
    }

    req.saccoMembership = membership;
    console.log('Membership found:', membership.toJSON());
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

