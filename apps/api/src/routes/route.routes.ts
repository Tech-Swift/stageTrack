import { Router } from "express";

import { 
    createRoute,
    getRoutes,
    getRouteById,
    updateRoute,
    deactivateRoute
} from "../controllers/routes.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { ROUTES_CREATION_ROLES } from "../constants/roles";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(...ROUTES_CREATION_ROLES),
    createRoute
)

router.get(
    "/",
    authenticate,
    getRoutes
)

router.get(
    "/:id",
    authenticate,
    getRouteById
)

router.patch(
  "/:id",
  authenticate,
  authorize(...ROUTES_CREATION_ROLES),
  updateRoute
);

router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(...ROUTES_CREATION_ROLES),
  deactivateRoute
);

export default router;