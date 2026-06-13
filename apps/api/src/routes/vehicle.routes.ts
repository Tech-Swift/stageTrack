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
  SYSTEM_ADMIN_ROLES,
  TENANT_ADMIN_ROLES,
  VEHICLE_APPROVAL_ROLES,
} from "../constants/roles";

const router = Router();

// Vehicle owner registers vehicle
router.post(
  "/",
  authenticate,
  registerVehicle
);

// List vehicles
router.get(
  "/",
  authenticate,
  getVehicles
);

// Get single vehicle
router.get(
  "/:id",
  authenticate,
  getVehicleById
);

// Schedule inspection
router.patch(
  "/:id/schedule-inspection",
  authenticate,
  authorize(...TENANT_ADMIN_ROLES),
  scheduleInspection
);

// Inspection completed
router.patch(
  "/:id/mark-inspected",
  authenticate,
  authorize(...TENANT_ADMIN_ROLES),
  markInspected
);

// Approve vehicle
router.patch(
  "/:id/approve",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  approveVehicle
);

// Activate vehicle
router.patch(
  "/:id/activate",
  authenticate,
  authorize(...VEHICLE_APPROVAL_ROLES),
  activateVehicle
);

// Reject vehicle
router.patch(
  "/:id/reject",
  authenticate,
  authorize(...TENANT_ADMIN_ROLES),
  rejectVehicle
);

// Suspend vehicle
router.patch(
  "/:id/suspend",
  authenticate,
  authorize(
    ...TENANT_ADMIN_ROLES,
    ...SYSTEM_ADMIN_ROLES
  ),
  suspendVehicle
);

// Reactivate vehicle
router.patch(
  "/:id/reactivate",
  authenticate,
  authorize(
    ...TENANT_ADMIN_ROLES,
    ...SYSTEM_ADMIN_ROLES
  ),
  reactivateVehicle
);

export default router;