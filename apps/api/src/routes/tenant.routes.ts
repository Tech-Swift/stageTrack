import { Router } from "express";
import {
    createTenant,
    getTenants,
    getTenantByCode,
    getTenantById,
    updateTenant,
    deactivateTenant
} from "../controllers/tenant.controller"

const router = Router();

router.post("/", createTenant);
router.get("/", getTenants);
router.get("/code/:code", getTenantByCode);
router.get("/:id", getTenantById);
router.patch("/:id", updateTenant);
router.patch("/:id/deactivate", deactivateTenant);

export default router;