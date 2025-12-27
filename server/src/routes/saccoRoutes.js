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

// -------------------- GLOBAL MIDDLEWARE --------------------
// Authentication applied globally
router.use(authenticate);
router.use(checkSuperAdmin); // sets req.saccoContext?.isSuperAdmin

// -------------------- SACCO CRUD --------------------
// Create SACCO (super_admin only)
router.post(
  '/',
  requireRole('super_admin'),
  saccoController.createSACCO
);

// Get all SACCOs
router.get(
  '/',
  saccoController.getAllSACCOs
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

// Suspend SACCO
router.patch(
  '/:id/suspend',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('super_admin'),
  saccoController.suspendSACCO
);

// Activate SACCO
router.patch(
  '/:id/activate',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('super_admin'),
  saccoController.activateSACCO
);

// SACCO stats
router.get(
  '/:id/stats',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOStats
);

// -------------------- BRANCH MANAGEMENT --------------------
// Create branch
router.post(
  '/:saccoId/branches',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.createBranch
);

// Get all branches (filtered by SACCO or super_admin)
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

// Branch by ID
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

// -------------------- USER-SACCO MANAGEMENT --------------------
// Add user to SACCO
router.post(
  '/:saccoId/users',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.addUserToSACCO
);

// Get all users in SACCO
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

// Single SACCO user
router.get(
  '/:saccoId/users/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.getSACCOUserById
);

// Update SACCO user
router.put(
  '/:saccoId/users/:id',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateSACCOUser
);

// Remove user
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

// -------------------- SETTINGS --------------------
// SACCO settings
router.get(
  '/:id/settings',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getSACCOSettings
);

router.put(
  '/:id/settings',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.updateSACCOSettings
);

router.post(
  '/:id/settings/reset',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  saccoController.resetSACCOSettings
);

// -------------------- AUDIT LOGS --------------------
router.get(
  '/:id/audit-logs',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getAuditLogs
);

router.get(
  '/:id/audit-logs/:entity/:entityId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  saccoController.getEntityAuditLogs
);

export default router;
