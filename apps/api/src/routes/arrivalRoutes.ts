import { Router } from "express";
import { createArrival } from "../controllers/arrival.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createArrival);

export default router;