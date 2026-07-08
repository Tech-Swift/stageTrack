import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { 
    markReady,
} from "../controllers/queue.controller";

const router = Router();

router.patch(
  "/:queueId/ready",
  authenticate,
  markReady
);
export default router;