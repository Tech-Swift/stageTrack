import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { getMarshalDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/marshal",
  authenticate,
  authorize("STAGE_MARSHAL"),
  getMarshalDashboard
);

export default router;