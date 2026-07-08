import { Router } from "express";
import {
    createStage,
    getStageById,
    updateStage,
    deactivateStage
} from "../controllers/stage.controller";

import {
    getActiveMarshals,
    getMyDutyStatus,
    getStageAssignments
} from "../controllers/assignment.controller";

import {
    getStageQueue,
    getNextVehicle
} from "../controllers/queue.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { STAGE_CREATION_ROLES } from "../constants/roles";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(...STAGE_CREATION_ROLES),
    createStage
)

router.get(
    "/:id",
    authenticate,                                                           
    getStageById
)

router.get(
    "/:stageId/assignments",
    authenticate,
    authorize(...STAGE_CREATION_ROLES),
    getStageAssignments
)

router.get(
    "/:stageId/active-marshals",
    authenticate,
    getActiveMarshals
)

router.get(
  "/:stageId/my-status",
  authenticate,
  getMyDutyStatus
);

router.get(
    "/:stageId/queue",
    authenticate,
    getStageQueue
)

router.get(
  "/:stageId/queue/next",
  authenticate,
  getNextVehicle
);

router.put(
    "/:id",
    authenticate,
    authorize(...STAGE_CREATION_ROLES),
    updateStage
)

router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(...STAGE_CREATION_ROLES),
  deactivateStage
);



export default router;