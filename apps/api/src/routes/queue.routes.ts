import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { 
    markReady,
    cancelDispatch
} from "../controllers/queue.controller";

const router = Router();

router.patch(
  "/:queueId/ready",
  authenticate,
  markReady
);

router.patch(
  "/:queueId/cancel-dispatch",
  authenticate,
  cancelDispatch
);
export default router;