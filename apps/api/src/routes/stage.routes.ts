import { Router } from "express";
import {
    createStage,
    getStageById,
    getStages,
} from "../controllers/stage.controller";

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
    "/:routeId",
    authenticate,
    getStages
)

export default router;