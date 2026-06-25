import { Router } from "express";
import {
    createTenant,
    getTenants,
    getTenantByCode,
    getTenantById,
    updateTenant,
    deactivateTenant
} from "../controllers/tenant.controller"

import {
    getBranding,
    updateBranding
} from "../controllers/tenantBranding.controller"


import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { TENANT_ADJUST_ROLES } from "../constants/roles";


const router = Router();

router.post("/", createTenant);
router.get("/", getTenants);
router.get("/code/:code", getTenantByCode);
router.get("/:id", getTenantById);
router.patch("/:id", updateTenant);
router.patch("/:id/deactivate", deactivateTenant);

router.get(
  "/:id/branding",
  authenticate,
  authorize(...TENANT_ADJUST_ROLES),
  getBranding
);

router.patch(
  "/:id/branding",
  authenticate,
  authorize(...TENANT_ADJUST_ROLES),
  updateBranding
);
export default router;