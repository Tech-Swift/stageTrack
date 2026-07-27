import { Router } from "express";

import { getDashboard } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

/**
 * ============================================================================
 * Generic Dashboard
 * ============================================================================
 * This will become the primary dashboard endpoint for all roles.
 */
router.get(
  "/",
  authenticate,
  getDashboard
);

/**
 * ============================================================================
 * Legacy Marshal Dashboard
 * ============================================================================
 * Temporary route to avoid breaking the existing Marshal frontend.
 * Remove this once the Marshal frontend is migrated to GET /dashboard.
 */
router.get(
  "/marshal",
  authenticate,
  authorize("STAGE_MARSHAL"),
  getDashboard
);

export default router;