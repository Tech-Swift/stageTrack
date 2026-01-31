import express from 'express';
import * as tripController from '../controllers/tripController.js';
import {
  authenticate,
  requireRole,
  enforceSaccoIsolation,
  verifySaccoAccess
} from '../middleware/authMiddleware.js';

const router = express.Router();

// -------------------- TRIPS --------------------
// Create trip
router.post(
  '/',
  authenticate,
  requireRole('stage_marshal'),
  enforceSaccoIsolation,
  verifySaccoAccess,
  tripController.createTrip
);