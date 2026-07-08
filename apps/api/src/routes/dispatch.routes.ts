import { Router } from "express";
import { createDispatch } from "../controllers/dispatch.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createDispatch
);

export default router;