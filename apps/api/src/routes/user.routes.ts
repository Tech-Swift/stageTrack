import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { SYSTEM_ADMIN_ROLES, TENANT_ADMIN_ROLES } from "../constants/roles";
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
  authorize(...TENANT_ADMIN_ROLES),
  updateUserStatus
);

router.patch(
  "/:id/role",
  authenticate,
  authorize(...SYSTEM_ADMIN_ROLES,...TENANT_ADMIN_ROLES),
  updateUserRole
);

export default router;