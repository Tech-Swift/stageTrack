import { Router } from "express";

import {
  submitTenantApplicationController,
} from "../controllers/tenantApplication.controller";

import { validate } from "../middlewares/validate";

import {
  createTenantApplicationSchema,
} from "../validators/tenantApplication.validator";

const router = Router();

router.post(
  "/",
  validate(createTenantApplicationSchema),
  submitTenantApplicationController
);

export default router;