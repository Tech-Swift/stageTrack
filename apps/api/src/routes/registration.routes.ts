import { Router } from "express";
import {
    createRegistrationRequest
} from "../controllers/registration.controller";

const router = Router();

router.post("/", createRegistrationRequest);

export default router;
