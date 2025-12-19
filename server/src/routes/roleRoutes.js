// src/routes/roleRoutes.js
import express from "express";
import {
  listRoles,
  assignUserRole,
  getUserRoles
} from "../controllers/roleController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // make sure you have this
import { requireRole } from "../middlewares/authorizeRole.js"; // optional: restrict by hierarchy

const router = express.Router();

// Public routes (if any) - usually roles are protected, so most routes require auth

// Get all roles - accessible by any authenticated user
router.get("/", authenticate, listRoles);

// Assign a role to a user - restricted to users with sufficient hierarchy
router.post("/assign", authenticate, requireRole(["super_admin", "admin", "director"]), assignUserRole);

// Get roles of a specific user
router.get("/user/:id", authenticate, getUserRoles);

export default router;
