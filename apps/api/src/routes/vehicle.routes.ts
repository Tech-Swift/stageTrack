import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import {
  registerVehicle,
  getVehicles,
  getVehicleById,
  scheduleInspection,
  markInspected,
  approveVehicle,
  activateVehicle,
  suspendVehicle,
  reactivateVehicle,
  rejectVehicle,
} from "../controllers/vehicle.controller";

import {
  VEHICLE_REVIEW_ROLES,
  VEHICLE_APPROVAL_ROLES,
} from "../constants/roles";

const router = Router();

/**
 * Vehicle Owner registers vehicle
 */
router.post(
  "/",
  authenticate,
  registerVehicle
);

/**
 * List vehicles
 */
router.get(
  "/",
  authenticate,
  getVehicles
);

/**
 * Get single vehicle
 */
router.get(
  "/:id",
  authenticate,
  getVehicleById
);

/**
 * Schedule inspection
 * SUPER_ADMIN, SACCO_ADMIN, MANAGER
 */
router.patch(
  "/:id/schedule-inspection",
  authenticate,
  authorize(...VEHICLE_REVIEW_ROLES),
  scheduleInspection
);

/**
 * Mark inspection complete
 * SUPER_ADMIN, SACCO_ADMIN, MANAGER
 */
router.patch(
  "/:id/mark-inspected",
  authenticate,
  authorize(...VEHICLE_REVIEW_ROLES),
  markInspected
);

/**
 * Reject vehicle
 * SUPER_ADMIN, SACCO_ADMIN, MANAGER
 */
router.patch(
  "/:id/reject",
  authenticate,
  authorize(...VEHICLE_REVIEW_ROLES),
  rejectVehicle
);

/**
 * Approve vehicle
 * SUPER_ADMIN, SACCO_ADMIN, DIRECTOR
 */
router.patch(
  "/:id/approve",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  approveVehicle
);

/**
 * Activate vehicle
 * SUPER_ADMIN, SACCO_ADMIN, DIRECTOR
 */
router.patch(
  "/:id/activate",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  activateVehicle
);

/**
 * Suspend vehicle
 * SUPER_ADMIN, SACCO_ADMIN, DIRECTOR
 */
router.patch(
  "/:id/suspend",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  suspendVehicle
);

/**
 * Reactivate vehicle
 * SUPER_ADMIN, SACCO_ADMIN, DIRECTOR
 */
router.patch(
  "/:id/reactivate",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  reactivateVehicle
);

export default router;