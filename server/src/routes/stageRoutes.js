/**
 * Stage Routes
 * API endpoints for Stage, Route, and Geography management
 */
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkSuperAdmin, enforceSaccoIsolation, verifySaccoAccess } from '../middlewares/saccoIsolation.js';
import { requireRole } from '../middlewares/authorizeRole.js';
import * as stageController from '../controllers/stageController.js';

const router = express.Router();

// -------------------- GLOBAL MIDDLEWARE --------------------
router.use(authenticate);
router.use(checkSuperAdmin);

// -------------------- COUNTIES --------------------
router.get('/counties', stageController.getCounties);

// -------------------- ROUTES --------------------
// Create route
router.post(
  '/:saccoId/routes',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.createRoute
);

// Get all routes for SACCO
router.get(
  '/routes',
  stageController.getRoutes
);

router.get(
  '/:saccoId/routes',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getRoutes
);

// Get route by ID
router.get(
  '/:saccoId/routes/:routeId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getRouteById
);

// Update route
router.put(
  '/:saccoId/routes/:routeId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.updateRoute
);

// Delete route
router.delete(
  '/:saccoId/routes/:routeId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.deleteRoute
);

// Route stats
router.get(
  '/:saccoId/routes/:routeId/stats',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getRouteStats
);

// -------------------- STAGES --------------------
// Create stage
router.post(
  '/:saccoId/stages',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.createStage
);

// Get stages for a route
router.get(
  '/:saccoId/routes/:routeId/stages',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStages
);

// Get stage by ID
router.get(
  '/:saccoId/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStageById
);

// Update stage
router.put(
  '/:saccoId/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.updateStage
);

// Delete stage
router.delete(
  '/:saccoId/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.deleteStage
);

// Stage stats
router.get(
  '/:saccoId/stages/:stageId/stats',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStageStats
);

// -------------------- STAGE ASSIGNMENTS --------------------
// Assign marshal to stage
router.post(
  '/:saccoId/stages/:stageId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.assignMarshal
);

// Get assignments for a stage
router.get(
  '/:saccoId/stages/:stageId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStageAssignments
);

// Get assignments for a marshal
router.get(
  '/:saccoId/marshals/:userId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getMarshalAssignments
);

// Update assignment
router.put(
  '/:saccoId/assignments/:assignmentId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.updateAssignment
);

// End assignment
router.patch(
  '/:saccoId/assignments/:assignmentId/end',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.endAssignment
);

// Get active marshals for a stage
router.get(
  '/:saccoId/stages/:stageId/marshals',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getActiveMarshals
);

// -------------------- CAPACITY RULES --------------------
// Create capacity rule
router.post(
  '/:saccoId/stages/:stageId/capacity-rules',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.createCapacityRule
);

// Get current capacity rule
router.get(
  '/:saccoId/stages/:stageId/capacity-rules/current',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getCurrentCapacityRule
);

// Get all capacity rules for a stage
router.get(
  '/:saccoId/stages/:stageId/capacity-rules',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getCapacityRules
);

// Update capacity rule
router.put(
  '/:saccoId/capacity-rules/:ruleId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.updateCapacityRule
);

// Delete capacity rule
router.delete(
  '/:saccoId/capacity-rules/:ruleId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
  stageController.deleteCapacityRule
);

// -------------------- STAGE LOGGING (Core Matatu Operations) --------------------
// Log vehicle arrival
router.post(
  '/:saccoId/stages/:stageId/arrivals',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.logArrival
);

// Log vehicle departure
router.post(
  '/:saccoId/stages/:stageId/departures',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.logDeparture
);

// Get real-time stage status
router.get(
  '/:saccoId/stages/:stageId/status',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStageStatus
);

// Check stage capacity
router.get(
  '/:saccoId/stages/:stageId/capacity',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.checkCapacity
);

// Get vehicles currently at stage
router.get(
  '/:saccoId/stages/:stageId/vehicles',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getVehiclesAtStage
);

// Get stage logs
router.get(
  '/:saccoId/stages/:stageId/logs',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getStageLogs
);

// Get vehicle history
router.get(
  '/:saccoId/vehicles/:vehicleId/history',
  enforceSaccoIsolation,
  verifySaccoAccess,
  stageController.getVehicleHistory
);

export default router;


