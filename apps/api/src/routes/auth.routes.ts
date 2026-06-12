import { Router } from "express";
import { 
    setPassword,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
 } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/set-password", setPassword);
router.post("/login", login);
router.get("/profile", authenticate,getProfile);
router.patch("/profile", authenticate,updateProfile);
router.post("/change-password", authenticate,changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;