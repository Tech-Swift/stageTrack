import express from "express";
import { register, login, listUsers, getUser } from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/users", authenticate, listUsers);
router.get("/users/:id", authenticate, getUser);

export default router;
