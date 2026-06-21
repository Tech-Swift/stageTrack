import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { 
    markReady,
    dispatchVehicle
} from "../controllers/queue.controller";

const router = Router();

router.patch(
  "/:queueId/ready",
  authenticate,
  markReady
);

router.patch(
    "/:queueId/dispatch",
    authenticate,
    dispatchVehicle
)



export default router;