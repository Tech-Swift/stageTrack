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
export async function createRoute(req, res) {
  try {
    const user = req.user;

    const isSuperAdmin =
      req.saccoContext?.isSuperAdmin ||
      user?.system_roles?.includes('super_admin');

    const sacco_id =
      req.params.saccoId ||
      req.body.sacco_id ||
      req.saccoMembership?.sacco_id ||
      user?.sacco_id;

    if (!sacco_id) {
      return res.status(403).json({ message: 'No SACCO access' });
    }


    const route = await routeService.createRoute(
      {
        ...req.body,
        sacco_id, 
      },
      user.id
    );

    return res.status(201).json({
      message: 'Route created successfully',
      route,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}



export async function getRoutes(req, res) {
  try {
    const saccoId = req.params.saccoId || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const options = {
      county_id: req.query.county_id,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      include_stages: req.query.include_stages === 'true'
    };
    const routes = await routeService.getRoutesBySACCO(saccoId, options);
    return res.json(routes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getRouteById(req, res) {
  try {
    const { routeId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const route = await routeService.getRouteById(routeId, saccoId);
    return res.json(route);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
}

export async function updateRoute(req, res) {
  try {
    const { routeId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const route = await routeService.updateRoute(routeId, req.body, saccoId, userId);
    return res.json({ message: 'Route updated successfully', route });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteRoute(req, res) {
  try {
    const { routeId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const result = await routeService.deleteRoute(routeId, saccoId, userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getRouteStats(req, res) {
  try {
    const { routeId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const stats = await routeService.getRouteStats(routeId, saccoId);
    return res.json(stats);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

// ==================== Stage Management ====================

export async function createStage(req, res) {
  try {
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const stage = await stageService.createStage(req.body, saccoId, userId);
    return res.status(201).json({ message: 'Stage created successfully', stage });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getStages(req, res) {
  try {
    const { routeId } = req.params;
    const saccoId = req.params.saccoId || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const stages = await stageService.getStagesByRoute(routeId, saccoId);
    return res.json(stages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getStageById(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const stage = await stageService.getStageById(stageId, saccoId);
    return res.json(stage);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
}

export async function updateStage(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const stage = await stageService.updateStage(stageId, req.body, saccoId, userId);
    return res.json({ message: 'Stage updated successfully', stage });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteStage(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const result = await stageService.deleteStage(stageId, saccoId, userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getStageStats(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const stats = await stageService.getStageStats(stageId, saccoId);
    return res.json(stats);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

// ==================== Stage Assignment Management ====================

export async function assignMarshal(req, res) {
  try {
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const assignment = await stageAssignmentService.assignMarshalToStage(req.body, saccoId, userId);
    return res.status(201).json({ message: 'Marshal assigned to stage successfully', assignment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function getStageAssignments(req, res) {
  try {
    const { stageId } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const options = {
      active_only: req.query.active_only === 'true',
      include_user: req.query.include_user !== 'false'
    };
    const assignments = await stageAssignmentService.getStageAssignments(stageId, saccoId, options);
    return res.json(assignments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

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


