/**
 * Stage Routes
 * API endpoints for Stage, Route, and Geography management
 */
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkSuperAdmin, enforceSaccoIsolation, verifySaccoAccess } from '../middlewares/saccoIsolation.js';
import { requireRole } from '../middlewares/authorizeRole.js';
import * as routeController from '../controllers/routeController.js';

const router = express.Router();

// -------------------- GLOBAL MIDDLEWARE --------------------
router.use(authenticate);
router.use(checkSuperAdmin);

// -------------------- COUNTIES --------------------
router.get('/counties',routeController.getCounties);

// -------------------- ROUTES --------------------
// Create route
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.createRoute
);

// Get all routes for SACCO
router.get(
  '/',
  requireRole('admin'),
 routeController.getRoutes
);

// Get route by ID
router.get(
  '/:id',
  requireRole('admin'),
  routeController.getRouteById
);

// Update route
router.put(
  '/:id',
  requireRole('admin'),
 routeController.updateRoute
);

// Delete route
router.delete(
  '/:id',
  requireRole('admin'),
  routeController.deleteRoute
);

// Route stats
router.get(
  '/:id/stats',
  requireRole('admin'),
  routeController.getRouteStats
);

// -------------------- STAGES --------------------
// Create stage
router.post(
  '/:routeId/stages',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('manager'),
  routeController.createStage
);

// Get stages for a route
router.get(
  '/:routeId/stages',
  enforceSaccoIsolation,
  verifySaccoAccess,
  routeController.getStagesByRoute
);

// Get stage by ID
router.get(
  '/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getStageById
);

// Update stage
router.put(
  '/:routeId/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('manager'),
  routeController.updateStage
);

// Delete stage
router.delete(
  '/:routeId/stages/:stageId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('director'),
 routeController.deleteStage
);

// Stage stats
router.get(
  '/:routeId/stages/:stageId/stats',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('stage_marshal'),
  routeController.getStageStats
);


// -------------------- STAGE ASSIGNMENTS --------------------
// Assign marshal to stage
router.post(
  '/:saccoId/stages/:stageId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.assignMarshal
);

// Get assignments for a stage
router.get(
  '/:saccoId/stages/:stageId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getStageAssignments
);

// Get assignments for a marshal
router.get(
  '/:saccoId/marshals/:userId/assignments',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getMarshalAssignments
);

// Update assignment
router.put(
  '/:saccoId/assignments/:assignmentId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.updateAssignment
);

// End assignment
router.patch(
  '/:saccoId/assignments/:assignmentId/end',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.endAssignment
);

// Get active marshals for a stage
router.get(
  '/:saccoId/stages/:stageId/marshals',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getActiveMarshals
);

// -------------------- CAPACITY RULES --------------------
// Create capacity rule
router.post(
  '/:saccoId/stages/:stageId/capacity-rules',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.createCapacityRule
);

// Get current capacity rule
router.get(
  '/:saccoId/stages/:stageId/capacity-rules/current',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getCurrentCapacityRule
);

// Get all capacity rules for a stage
router.get(
  '/:saccoId/stages/:stageId/capacity-rules',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getCapacityRules
);

// Update capacity rule
router.put(
  '/:saccoId/capacity-rules/:ruleId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.updateCapacityRule
);

// Delete capacity rule
router.delete(
  '/:saccoId/capacity-rules/:ruleId',
  enforceSaccoIsolation,
  verifySaccoAccess,
  requireRole('admin'),
 routeController.deleteCapacityRule
);

// -------------------- STAGE LOGGING (Core Matatu Operations) --------------------
// Log vehicle arrival
router.post(
  '/:saccoId/stages/:stageId/arrivals',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.logArrival
);

// Log vehicle departure
router.post(
  '/:saccoId/stages/:stageId/departures',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.logDeparture
);

// Get real-time stage status
router.get(
  '/:saccoId/stages/:stageId/status',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getStageStatus
);

// Check stage capacity
router.get(
  '/:saccoId/stages/:stageId/capacity',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.checkCapacity
);

// Get vehicles currently at stage
router.get(
  '/:saccoId/stages/:stageId/vehicles',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getVehiclesAtStage
);

// Get stage logs
router.get(
  '/:saccoId/stages/:stageId/logs',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getStageLogs
);

// Get vehicle history
router.get(
  '/:saccoId/vehicles/:vehicleId/history',
  enforceSaccoIsolation,
  verifySaccoAccess,
 routeController.getVehicleHistory
);

export default router;


