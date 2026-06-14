import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { TENANT_ADMIN_ROLES,ROLE_ASSIGNMENT_ROLES, USER_STATUS_ROLES } from "../constants/roles";
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
  authorize(...TENANT_ADMIN_ROLES),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  authorize(...TENANT_ADMIN_ROLES),
  getUserById
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(...USER_STATUS_ROLES),
  updateUserStatus
);

router.patch(
  "/:id/role",
  authenticate,
  authorize(...ROLE_ASSIGNMENT_ROLES),
  updateUserRole
);

export default router;