import { Router } from "express";

import {
  submitTenantApplicationController,
  getTenantApplicationsController,
  getTenantApplicationByIdController,
  startTenantApplicationReviewController,
  approveTenantApplicationController,
  rejectTenantApplicationController,
} from "../controllers/tenantApplication.controller";

import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import {
  createTenantApplicationSchema,
  approveTenantApplicationSchema,
  rejectTenantApplicationSchema
} from "../validators/tenantApplication.validator";

import { SYSTEM_ADMIN_ROLES } from "../constants/roles";


const router = Router();

router.post(
  "/",
  validate(createTenantApplicationSchema),
  submitTenantApplicationController
);

router.get(
  "/",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES),
  getTenantApplicationsController
);

router.get(
  "/:id",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES),
  getTenantApplicationByIdController
);

router.patch(
  "/:id/review",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES),
  startTenantApplicationReviewController
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES),
  validate(approveTenantApplicationSchema),
  approveTenantApplicationController
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES),
  validate(rejectTenantApplicationSchema),
  rejectTenantApplicationController
);

export default router;