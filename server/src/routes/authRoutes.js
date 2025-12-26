import express from "express";
import { register, login, updateUserRoles, listUsers, getUser } from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/", authenticate, listUsers);
router.get("/:id", authenticate, getUser);
router.put("/:id/roles", authenticate, updateUserRoles);


export default router;
