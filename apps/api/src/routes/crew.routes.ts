import { Router } from "express";

import {
    assignCrewToVehicle,
    getVehicleCrew,
    deactivateCrew,
    getAvailableDrivers,
    getAvailableConductors
} from "../controllers/crew.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import { CREW_ASSIGNMENT_ROLES } from "../constants/roles";

const router = Router();

router.post(
  "/assign",
  authenticate,
  authorize(...CREW_ASSIGNMENT_ROLES),
  assignCrewToVehicle
);

router.get(
  "/:vehicleId",
  authenticate,
  getVehicleCrew
);

router.get(
  "/drivers/available",
  authenticate,
  getAvailableDrivers
)

router.get(
  "/conductors/available",
  authenticate,
  getAvailableConductors
)

router.patch(
  "/:crewId/end",
  authenticate,
  authorize(...CREW_ASSIGNMENT_ROLES),
  deactivateCrew
);

export default router;