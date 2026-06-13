import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import {
  getRegistrationRequests,
  approveRegistration,
  rejectRegistration,
} from "../controllers/registration-review.controller";

import {
  SYSTEM_ADMIN_ROLES,
  REGISTRATION_REVIEW_ROLES,
  REGISTRATION_APPROVAL_ROLES,
} from "../constants/roles";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(...REGISTRATION_REVIEW_ROLES),
  getRegistrationRequests
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES,
    ...REGISTRATION_APPROVAL_ROLES),
  approveRegistration
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(...REGISTRATION_APPROVAL_ROLES),
  rejectRegistration
);

export default router;