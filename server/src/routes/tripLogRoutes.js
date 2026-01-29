import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  completeTrip,
  deleteTrip
} from "../controllers/tripLog.controller.js";

const router = express.Router();

router.post("/", createTrip);                 // Start trip
router.get("/", getTrips);                    // All trips
router.get("/:id", getTripById);              // Single trip
router.patch("/:id/complete", completeTrip);  // Mark arrival
router.delete("/:id", deleteTrip);            // Remove

export default router;
