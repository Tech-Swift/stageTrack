import { Router } from "express";

import {
    getRegistrationRequests,
    approveRegistration,
    rejectRegistration,
} from "../controllers/registration-review.controller";

const router = Router();

router.get("/", getRegistrationRequests);
router.patch("/:id/approve", approveRegistration);
router.patch("/:id/reject", rejectRegistration);

export default router;