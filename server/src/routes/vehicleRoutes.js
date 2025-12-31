import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/authorizeRole.js';
import { enforceSaccoIsolation } from '../middlewares/saccoIsolation.js';

import * as vehicleController from '../controllers/vehicleController.js';

const router = express.Router();

/* ---------------- Vehicles ---------------- */

router.post(
  '/',
  authenticate,
  requireRole('super_admin', 'sacco_admin'),
  enforceSaccoIsolation,
  vehicleController.createVehicle
);

router.get(
  '/',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicles
);

router.get(
  '/:id',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleById
);

router.put(
  '/:id',
  authenticate,
  requireRole('super_admin', 'sacco_admin'),
  enforceSaccoIsolation,
  vehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticate,
  requireRole('super_admin'),
  enforceSaccoIsolation,
  vehicleController.deleteVehicle
);

router.patch(
  '/:id/status',
  authenticate,
  requireRole('super_admin', 'sacco_admin'),
  enforceSaccoIsolation,
  vehicleController.updateVehicleStatus
);

/* ---------------- Vehicle Status History ---------------- */

router.get(
  '/:vehicleId/status-history',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleStatusHistory
);

router.get(
  '/:vehicleId/status-history/latest',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getLatestVehicleStatus
);

/* ---------------- Vehicle Owners ---------------- */

router.post(
  '/owners',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.createVehicleOwner
);

router.get(
  '/owners',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleOwners
);

router.get(
  '/owners/:id',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleOwnerById
);

router.put(
  '/owners/:id',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.updateVehicleOwner
);

router.post(
  '/:vehicleId/owners/:ownerId',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.linkOwnerToVehicle
);

router.delete(
  '/owners/links/:linkId',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.unlinkOwnerFromVehicle
);

router.get(
  '/owners/:id/vehicles',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehiclesByOwner
);

router.get(
  '/:id/owners',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getOwnersByVehicle
);

/* ---------------- Vehicle Documents ---------------- */

router.post(
  '/:vehicleId/documents',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.createVehicleDocument
);

router.get(
  '/:vehicleId/documents',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleDocuments
);

router.get(
  '/documents/expiring',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getExpiringDocuments
);

router.get(
  '/documents/:id',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.getVehicleDocumentById
);

router.put(
  '/documents/:id',
  authenticate,
  enforceSaccoIsolation,
  vehicleController.updateVehicleDocument
);

router.patch(
  '/documents/:id/verify',
  authenticate,
  requireRole('super_admin', 'sacco_admin'),
  enforceSaccoIsolation,
  vehicleController.verifyVehicleDocument
);

router.delete(
  '/documents/:id',
  authenticate,
  requireRole('super_admin'),
  enforceSaccoIsolation,
  vehicleController.deleteVehicleDocument
);

export default router;
