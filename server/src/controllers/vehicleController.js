import * as vehicleService from '../services/vehicleService.js';
import * as vehicleOwnerService from '../services/vehicleOwnerService.js';
import * as vehicleDocumentService from '../services/vehicleDocumentService.js';
import * as vehicleStatusHistoryService from '../services/vehicleStatusHistoryService.js';

export async function createVehicle(req, res) {
  try {
    const userId = req.user.id;

    // sacco_id comes from token unless super_admin passes explicitly
    const saccoId = req.user.sacco_id || req.body.sacco_id;

    if (!saccoId) {
      return res.status(403).json({ message: 'SACCO context required' });
    }

    const vehicle = await vehicleService.createVehicle(
      { ...req.body, sacco_id: saccoId },
      userId
    );

    return res.status(201).json({
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Get all vehicles for a SACCO
 * GET /api/vehicles
 */
export async function getVehicles(req, res) {
  try {
    const saccoId = req.user.sacco_id;

    if (!saccoId && !req.user.is_super_admin) {
      return res.status(403).json({ message: 'SACCO context required' });
    }

    const vehicles = await vehicleService.getVehiclesBySACCO(
      saccoId,
      {
        route_id: req.query.route_id,
        status: req.query.status
      }
    );

    return res.status(200).json({ data: vehicles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Get a single vehicle by ID
 * GET /api/vehicles/:id
 */
export async function getVehicleById(req, res) {
  try {
    const { id } = req.params;
    const saccoId = req.user.sacco_id;

    const vehicle = await vehicleService.getVehicleById(id, saccoId);

    return res.status(200).json({ data: vehicle });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Update a vehicle
 * PUT /api/vehicles/:id
 */
export async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const vehicle = await vehicleService.updateVehicle(
      id,
      req.body,
      saccoId,
      userId
    );

    return res.status(200).json({
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Delete a vehicle
 * DELETE /api/vehicles/:id
 */
export async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const result = await vehicleService.deleteVehicle(id, saccoId, userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Update vehicle status only
 * PATCH /api/vehicles/:id/status
 */
export async function updateVehicleStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const vehicle = await vehicleService.updateVehicleStatus(
      id,
      status,
      saccoId,
      userId,
      reason
    );

    return res.status(200).json({
      message: 'Vehicle status updated successfully',
      data: vehicle
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
// --------------- Vehicle ownership
/**
 * Create a new vehicle owner
 * POST /api/vehicle-owners
 */
export async function createVehicleOwner(req, res) {
  try {
    const userId = req.user.id;

    const owner = await vehicleOwnerService.createVehicleOwner(
      req.body,
      userId
    );

    return res.status(201).json({
      message: 'Vehicle owner created successfully',
      data: owner
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Get all vehicle owners
 * GET /api/vehicle-owners
 */
export async function getVehicleOwners(req, res) {
  try {
    const owners = await vehicleOwnerService.getVehicleOwners({
      phone: req.query.phone,
      id_number: req.query.id_number
    });

    return res.status(200).json({ data: owners });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Get a single vehicle owner by ID
 * GET /api/vehicle-owners/:id
 */
export async function getVehicleOwnerById(req, res) {
  try {
    const owner = await vehicleOwnerService.getVehicleOwnerById(req.params.id);

    return res.status(200).json({ data: owner });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Update a vehicle owner
 * PUT /api/vehicle-owners/:id
 */
export async function updateVehicleOwner(req, res) {
  try {
    const userId = req.user.id;

    const owner = await vehicleOwnerService.updateVehicleOwner(
      req.params.id,
      req.body,
      userId
    );

    return res.status(200).json({
      message: 'Vehicle owner updated successfully',
      data: owner
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Link owner to vehicle
 * POST /api/vehicles/:vehicleId/owners/:ownerId
 */
export async function linkOwnerToVehicle(req, res) {
  try {
    const { vehicleId, ownerId } = req.params;
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const link = await vehicleOwnerService.linkOwnerToVehicle(
      vehicleId,
      ownerId,
      req.body,
      saccoId,
      userId
    );

    return res.status(201).json({
      message: 'Owner linked to vehicle successfully',
      data: link
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Unlink owner from vehicle
 * DELETE /api/vehicle-owners/links/:linkId
 */
export async function unlinkOwnerFromVehicle(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const result = await vehicleOwnerService.unlinkOwnerFromVehicle(
      req.params.linkId,
      saccoId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Get vehicles owned by an owner
 * GET /api/vehicle-owners/:id/vehicles
 */
export async function getVehiclesByOwner(req, res) {
  try {
    const links = await vehicleOwnerService.getVehiclesByOwner(req.params.id);

    return res.status(200).json({ data: links });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Get owners for a vehicle
 * GET /api/vehicles/:id/owners
 */
export async function getOwnersByVehicle(req, res) {
  try {
    const links = await vehicleOwnerService.getOwnersByVehicle(req.params.id);

    return res.status(200).json({ data: links });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export async function createVehicleDocument(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const document = await vehicleDocumentService.createVehicleDocument(
      {
        ...req.body,
        vehicle_id: req.params.vehicleId
      },
      saccoId,
      userId
    );

    return res.status(201).json({
      message: 'Vehicle document created successfully',
      data: document
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Get all documents for a vehicle
 * GET /api/vehicles/:vehicleId/documents
 */
export async function getVehicleDocuments(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const { vehicleId } = req.params;

    const documents = await vehicleDocumentService.getVehicleDocuments(
      vehicleId,
      saccoId,
      {
        document_type: req.query.document_type,
        status: req.query.status
      }
    );

    return res.status(200).json({ data: documents });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Get a single vehicle document by ID
 * GET /api/vehicle-documents/:id
 */
export async function getVehicleDocumentById(req, res) {
  try {
    const saccoId = req.user.sacco_id;

    const document = await vehicleDocumentService.getVehicleDocumentById(
      req.params.id,
      saccoId
    );

    return res.status(200).json({ data: document });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Update a vehicle document
 * PUT /api/vehicle-documents/:id
 */
export async function updateVehicleDocument(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const document = await vehicleDocumentService.updateVehicleDocument(
      req.params.id,
      req.body,
      saccoId,
      userId
    );

    return res.status(200).json({
      message: 'Vehicle document updated successfully',
      data: document
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Verify a vehicle document
 * PATCH /api/vehicle-documents/:id/verify
 */
export async function verifyVehicleDocument(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const document = await vehicleDocumentService.verifyVehicleDocument(
      req.params.id,
      saccoId,
      userId
    );

    return res.status(200).json({
      message: 'Vehicle document verified successfully',
      data: document
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Delete a vehicle document
 * DELETE /api/vehicle-documents/:id
 */
export async function deleteVehicleDocument(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const userId = req.user.id;

    const result = await vehicleDocumentService.deleteVehicleDocument(
      req.params.id,
      saccoId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * Get expiring vehicle documents
 * GET /api/vehicle-documents/expiring
 */
export async function getExpiringDocuments(req, res) {
  try {
    const saccoId = req.user.sacco_id;
    const daysAhead = parseInt(req.query.days_ahead, 10) || 30;

    const vehicles = await vehicleDocumentService.getExpiringDocuments(
      saccoId,
      daysAhead
    );

    return res.status(200).json({ data: vehicles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getVehicleStatusHistory(req, res) {
  try {
    const { vehicleId } = req.params;
    const saccoId = req.user.sacco_id;

    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result =
      await vehicleStatusHistoryService.getVehicleStatusHistory(
        vehicleId,
        saccoId,
        { limit, offset }
      );

    return res.status(200).json({
      data: result.history,
      meta: {
        total: result.total,
        limit: result.limit,
        offset: result.offset
      }
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Get latest vehicle status
 * GET /api/vehicles/:vehicleId/status-history/latest
 */
export async function getLatestVehicleStatus(req, res) {
  try {
    const { vehicleId } = req.params;
    const saccoId = req.user.sacco_id;

    const latestStatus =
      await vehicleStatusHistoryService.getLatestVehicleStatus(
        vehicleId,
        saccoId
      );

    return res.status(200).json({ data: latestStatus });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}