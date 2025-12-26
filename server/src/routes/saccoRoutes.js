/**
 * SACCO Routes
 * API endpoints for SACCO management
 */
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkSuperAdmin, enforceSaccoIsolation, verifySaccoAccess } from '../middlewares/saccoIsolation.js';
import { requireRole } from '../middlewares/authorizeRole.js';
import * as saccoController from '../controllers/saccoController.js';

const router = express.Router();

// Apply authentication (enforceSaccoIsolation removed from global middleware)
router.use(authenticate);
router.use(checkSuperAdmin);

// ==================== SACCO CRUD Routes ====================

// Create SACCO (super admin only)
router.post(
  '/',
  requireRole('super_admin'),
  saccoController.createSACCO
);

// Get all SACCOs (filtered by user's SACCO unless super admin)
router.get(
  '/',
  saccoController.getAllSACCOs
);

// ==================== User-SACCO Management Routes ====================
// Note: placed before generic "/:id" route to avoid routing "users" as an ID

// Get all users in a SACCO (or current user's SACCO)
router.get(
  '/users',
  saccoController.getSACCOUsers
);

router.get(
  '/:saccoId/users',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOUsers
);

// Get SACCO by ID
router.get(
  '/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOById
);

// Update SACCO
router.put(
  '/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateSACCO
);

// Suspend SACCO (super admin)
router.patch(
  '/:id/suspend',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('super_admin'),
  saccoController.suspendSACCO
);

// Activate SACCO (super admin)
router.patch(
  '/:id/activate',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('super_admin'),
  saccoController.activateSACCO
);

// Get SACCO statistics
router.get(
  '/:id/stats',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOStats
);

// ==================== Branch Management Routes ====================

// Create branch
router.post(
  '/:saccoId/branches',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.createBranch
);

// Get all branches for a SACCO (or current user's SACCO)
router.get(
  '/branches',
  saccoController.getBranches
);

router.get(
  '/:saccoId/branches',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getBranches
);

// Get branch by ID
router.get(
  '/:saccoId/branches/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getBranchById
);

// Update branch
router.put(
  '/:saccoId/branches/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateBranch
);

// Delete branch
router.delete(
  '/:saccoId/branches/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.deleteBranch
);

// ==================== User-SACCO Management Routes ====================

// Add user to SACCO
router.post(
  '/:saccoId/users',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.addUserToSACCO
);

// Get all users in a SACCO (or current user's SACCO)
router.get(
  '/users',
  saccoController.getSACCOUsers
);

router.get(
  '/:saccoId/users',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOUsers
);

// Update user's SACCO relationship
router.put(
  '/:saccoId/users/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateSACCOUser
);

// Remove user from SACCO
router.delete(
  '/:saccoId/users/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.removeUserFromSACCO
);

// Get user's SACCO memberships
router.get(
  '/users/:userId/saccos',
  saccoController.getUserSACCOs
);

// ==================== Settings Management Routes ====================

// Get SACCO settings
router.get(
  '/:id/settings',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOSettings
);

// Update SACCO settings
router.put(
  '/:id/settings',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateSACCOSettings
);

// Reset SACCO settings to defaults
router.post(
  '/:id/settings/reset',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.resetSACCOSettings
);

// ==================== Audit Log Routes ====================

// Get audit logs for a SACCO
router.get(
  '/:id/audit-logs',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getAuditLogs
);

// Get audit logs for a specific entity
router.get(
  '/:id/audit-logs/:entity/:entityId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getEntityAuditLogs
);

export default router;

