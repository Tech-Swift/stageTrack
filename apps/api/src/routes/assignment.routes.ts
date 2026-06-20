import { Router } from "express";
import { 
    assignMarshalToStage,
    getMarshalAssignments
} from "../controllers/assignment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { MARSHALL_ASSIGNMENT_ROLES } from "../constants/roles";

const router = Router();


router.post(
  "/assign-marshal",
  authenticate,
  authorize(...MARSHALL_ASSIGNMENT_ROLES),
  assignMarshalToStage
);


router.get(
  "/marshals/:userId/assignments",
  authenticate,
  authorize(...MARSHALL_ASSIGNMENT_ROLES),
  getMarshalAssignments
);

export default router;