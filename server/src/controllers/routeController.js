/**
 * Stage Controller
 * HTTP request handlers for Stage operations
 */
import * as routeService from '../services/routeService.js';
import * as stageService from '../services/stageService.js';
import * as stageAssignmentService from '../services/stageAssignmentService.js';
import * as capacityRuleService from '../services/capacityRuleService.js';
import * as stageLogService from '../services/stageLogService.js';
import { ValidationError } from 'sequelize';

// ==================== County Management ====================

export async function getCounties(req, res) {
  try {
    const { County } = await import('../models/index.js');
    const counties = await County.findAll({
      order: [['name', 'ASC']]
    });
    return res.json(counties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ==================== Route Management ====================
// Create route
export async function createRoute(req, res) {
  try {
    const route = await routeService.createRoute(req.body, req.user);

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('CREATE ROUTE ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
}

 /**
 * GET /api/routes
 * Returns all routes accessible to the user
 */

export async function getRoutes(req, res) {
  try {
    const options = {
      sacco_id: req.query.sacco_id,
      county_id: req.query.county_id,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      include_stages: true
    };

    const routes = await routeService.getRoutes(req.user, options);

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    console.error('GET ROUTES ERROR:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/routes/:id
 * Returns a single route accessible to the user
 */
export async function getRouteById(req, res) {
  try {
    const route = await routeService.getRouteById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('GET ROUTE BY ID ERROR:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateRoute(req, res) {
  try {
    const route = await routeService.updateRoute(
      req.params.id,
      req.body,
      req.user
    );

    res.json({ success: true, data: route });
  } catch (error) {
    console.error('UPDATE ROUTE ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteRoute(req, res) {
  try {
    await routeService.deleteRoute(req.params.id, req.user);

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('DELETE ROUTE ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
}

  export async function getRouteStats(req, res) {
    try {
      const stats = await routeService.getRouteStats(req.params.id, req.user);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('GET ROUTE STATS ERROR:', error);
      return res.status(403).json({ success: false, message: error.message });
    }
  }


// ==================== Stage Management ====================

export async function createStage(req, res) {
  try {
    // Attach route_id from URL to request body
    const stageData = { ...req.body, route_id: req.params.routeId };

    const stage = await stageService.createStage(stageData, req.user);
    return res.status(201).json({
      message: 'Stage created successfully',
      stage
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


export async function getStagesByRoute(req, res) {
  try {
    const { routeId } = req.params;
    const stages = await stageService.getStagesByRoute(routeId, req.user);

    return res.status(200).json({ success: true, stages });
  } catch (error) {
    return res.status(403).json({ success: false, message: error.message });
  }
}

export async function getStageById(req, res) {
  try {
    const { stageId } = req.params;
    const stage = await stageService.getStageById(stageId, req.user);

    return res.status(200).json({ success: true, stage });
  } catch (error) {
    return res.status(403).json({ success: false, message: error.message });
  }
}

export async function updateStage(req, res) {
  try {
    const { routeId, stageId } = req.params;

    const stage = await stageService.updateStage(
      stageId,
      routeId,
      req.body,
      req.user
    );

    return res.json({
      success: true,
      message: 'Stage updated successfully',
      stage
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteStage(req, res) {
  try {
    const { routeId, stageId } = req.params;

    await stageService.deleteStage(stageId, routeId, req.user);

    return res.json({
      success: true,
      message: 'Stage deleted successfully'
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getStageStats(req, res) {
  try {
    const { stageId } = req.params;
    const stats = await stageService.getStageStats(stageId, req.user);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('GET STAGE STATS ERROR:', error);
    return res.status(403).json({ success: false, message: error.message });
  }
}


// ==================== Stage Assignment Management ====================

export async function assignMarshal(req, res) {
  try {
    // Determine SACCO context: from params, body, or user's membership
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;

    // Call service to assign marshal
    const assignment = await stageAssignmentService.assignMarshalToStage(req.body, saccoId, userId);

    return res.status(201).json({
      success: true,
      message: 'Marshal assigned to stage successfully',
      assignment
    });
  } catch (error) {
    console.error('ASSIGN MARSHAL ERROR:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

 // Get all assignments for a stage
 


export async function getMarshalAssignments(req, res) {
  try {
    const { userId } = req.params;
    const saccoId = req.params.saccoId || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const options = {
      active_only: req.query.active_only === 'true',
      saccoId
    };
    const assignments = await stageAssignmentService.getMarshalAssignments(userId, options);
    return res.json(assignments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const assignment = await stageAssignmentService.updateAssignment(assignmentId, req.body, saccoId, userId);
    return res.json({ message: 'Assignment updated successfully', assignment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function endAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const assignment = await stageAssignmentService.endAssignment(assignmentId, saccoId, userId);
    return res.json({ message: 'Assignment ended successfully', assignment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getActiveMarshals(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const marshals = await stageAssignmentService.getActiveMarshals(stageId, saccoId);
    return res.json(marshals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ==================== Capacity Rule Management ====================

export async function createCapacityRule(req, res) {
  try {
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;

    const rule = await capacityRuleService.createCapacityRule(req.body, saccoId, userId);

    return res.status(201).json({
      message: "Capacity rule created successfully",
      rule
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages
      });
    }

    // Handle custom errors thrown in your service
    if (error.message) {
      return res.status(400).json({ message: error.message });
    }

    // Fallback for unexpected errors
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentCapacityRule(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const rule = await capacityRuleService.getCurrentCapacityRule(stageId, saccoId);
    return res.json(rule);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export async function getCapacityRules(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const rules = await capacityRuleService.getCapacityRules(stageId, saccoId);
    return res.json(rules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateCapacityRule(req, res) {
  try {
    const { ruleId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const rule = await capacityRuleService.updateCapacityRule(ruleId, req.body, saccoId, userId);
    return res.json({ message: 'Capacity rule updated successfully', rule });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteCapacityRule(req, res) {
  try {
    const { ruleId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const result = await capacityRuleService.deleteCapacityRule(ruleId, saccoId, userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// ==================== Stage Logging (Core Matatu Operations) ====================

export async function logArrival(req, res) {
  try {
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const result = await stageLogService.logArrival(req.body, saccoId);
    return res.status(201).json({ message: 'Arrival logged successfully', ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function logDeparture(req, res) {
  try {
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const result = await stageLogService.logDeparture(req.body, saccoId);
    return res.status(201).json({ message: 'Departure logged successfully', ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getStageStatus(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const status = await stageLogService.getStageStatus(stageId, saccoId);
    return res.json(status);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export async function checkCapacity(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const capacity = await stageLogService.checkStageCapacity(stageId, saccoId);
    return res.json(capacity);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export async function getVehiclesAtStage(req, res) {
  try {
    const { stageId } = req.params;
    const vehicles = await stageLogService.getVehiclesAtStage(stageId);
    return res.json(vehicles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getStageLogs(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const options = {
      vehicle_id: req.query.vehicle_id,
      event_type: req.query.event_type,
      logged_by: req.query.logged_by,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit: req.query.limit,
      offset: req.query.offset
    };
    const result = await stageLogService.getStageLogs(stageId, saccoId, options);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getVehicleHistory(req, res) {
  try {
    const { vehicleId } = req.params;
    const saccoId = req.params.saccoId || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const history = await stageLogService.getVehicleHistory(vehicleId, saccoId);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


