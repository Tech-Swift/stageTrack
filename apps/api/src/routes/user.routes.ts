import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { USER_MANAGEMENT_ROLES } from "../constants/roles";
import { authorize } from "../middlewares/authorize.middleware";
import {
    getUsers,
    getUserById,
    updateUserStatus,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(...USER_MANAGEMENT_ROLES),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  authorize(...USER_MANAGEMENT_ROLES),
  getUserById
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(...USER_MANAGEMENT_ROLES),
  updateUserStatus
);

export default router;