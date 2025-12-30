import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/authorizeRole.js";
import { register, login, updateUserRoles, listUsers, getUser } from "../controllers/authController.js";


const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/", authenticate, requireRole("super_admin"), listUsers);
router.get("/:id", authenticate, requireRole("super_admin"), getUser);
router.put("/:id/roles", authenticate, updateUserRoles);


export default router;
