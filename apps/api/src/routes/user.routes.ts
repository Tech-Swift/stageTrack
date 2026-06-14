import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { SYSTEM_ADMIN_ROLES, USER_MANAGEMENT_ROLES } from "../constants/roles";
import { authorize } from "../middlewares/authorize.middleware";
import {
    getUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
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

router.patch(
  "/:id/role",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES,...USER_MANAGEMENT_ROLES),
  updateUserRole
);

export default router;