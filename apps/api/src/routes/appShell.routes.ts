import { Router } from "express";

import { getAppShell } from "../controllers/appShell.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getAppShell
);

export default router;