/**
 * SACCO Controller
 * HTTP request handlers for SACCO operations
 */
import * as saccoService from '../services/saccoService.js';
import * as branchService from '../services/saccoBranchService.js';
import * as saccoUserService from '../services/saccoUserService.js';
import * as settingsService from '../services/saccoSettingsService.js';
import * as auditLogService from '../services/saccoAuditLogService.js';

// ==================== SACCO Users ====================

export async function getSACCOUsers(req, res) {
  try {
    console.log('🔥 getSACCOUsers controller hit', {
      user: req.user,
      saccoMembership: req.saccoMembership,
      isSuperAdmin: req.saccoContext?.isSuperAdmin,
      params: req.params,
      query: req.query
    });

    // Determine saccoId
    const saccoId =
      req.params.saccoId ||
      req.saccoMembership?.sacco_id ||
      req.user?.sacco_id;

    if (!saccoId) {
      return res.status(400).json({
        message: "SACCO ID could not be determined"
      });
    }

    const options = {};

    if (req.query.branch_id) options.branch_id = req.query.branch_id;
    if (req.query.status) options.status = req.query.status;

    if (req.query.role) {
      options.roles = req.query.role
        .split(',')
        .map(r => r.trim())
        .filter(Boolean);
    }

    const users = await saccoUserService.getSACCOUsers(saccoId, options);

    return res.json(users);

  } catch (err) {
    console.error('getSACCOUsers error:', err);
    return res.status(500).json({ message: err.message });
  }
}

export async function getSACCOUserById(req, res) {
  try {
    console.log('🔥 getSACCOUserById', {
      user: req.user,
      saccoMembership: req.saccoMembership,
      params: req.params
    });

    const { saccoId, id } = req.params;
    const saccoUser = await saccoUserService.getSACCOUserById(saccoId, id);
    return res.json(saccoUser);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ message: err.message });
  }
}

// ==================== SACCO CRUD ====================

export async function createSACCO(req, res) {
  try {
    console.log('🔥 createSACCO', { user: req.user, body: req.body });

    const userId = req.user.id;
    const sacco = await saccoService.createSACCO(req.body, userId);
    res.status(201).json({ message: 'SACCO created successfully', sacco });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllSACCOs(req, res) {
  try {
    console.log('🔥 getAllSACCOs', { user: req.user, isSuperAdmin: req.saccoContext?.isSuperAdmin });

    const saccoId = req.user?.sacco_id;
    const saccos = await saccoService.getAllSACCOs({ saccoId, isSuperAdmin: req.saccoContext?.isSuperAdmin });
    res.json(saccos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSACCOById(req, res) {
  try {
    console.log('🔥 getSACCOById', { user: req.user, params: req.params });

    const { id } = req.params;
    const sacco = await saccoService.getSACCOById(id, req.saccoContext?.isSuperAdmin);
    res.json(sacco);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function updateSACCO(req, res) {
  try {
    console.log('🔥 updateSACCO', { user: req.user, params: req.params, body: req.body });

    const { id } = req.params;
    const userId = req.user.id;
    const sacco = await saccoService.updateSACCO(id, req.body, userId);
    res.json({ message: 'SACCO updated successfully', sacco });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function suspendSACCO(req, res) {
  try {
    console.log('🔥 suspendSACCO', { user: req.user, params: req.params });

    const { id } = req.params;
    const userId = req.user.id;
    const sacco = await saccoService.suspendSACCO(id, userId);
    res.json({ message: 'SACCO suspended successfully', sacco });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function activateSACCO(req, res) {
  try {
    console.log('🔥 activateSACCO', { user: req.user, params: req.params });

    const { id } = req.params;
    const userId = req.user.id;
    const sacco = await saccoService.activateSACCO(id, userId);
    res.json({ message: 'SACCO activated successfully', sacco });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getSACCOStats(req, res) {
  try {
    console.log('🔥 getSACCOStats', { user: req.user, params: req.params });

    const { id } = req.params;
    const stats = await saccoService.getSACCOStats(id);
    res.json(stats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// ==================== Branch Management ====================

export async function createBranch(req, res) {
  try {
    console.log('🔥 createBranch', { user: req.user, body: req.body, saccoMembership: req.saccoMembership });

    const userId = req.user.id;
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const branch = await branchService.createBranch({ ...req.body, sacco_id: saccoId }, userId);
    res.status(201).json({ message: 'Branch created successfully', branch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getBranches(req, res) {
  try {
    const saccoId = req.params.saccoId || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const branches = await branchService.getBranchesBySACCO(saccoId);
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBranchById(req, res) {
  try {
    console.log('🔥 getBranchById', { user: req.user, params: req.params, saccoMembership: req.saccoMembership });

    const { id } = req.params;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const branch = await branchService.getBranchById(id, saccoId);
    res.json(branch);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function updateBranch(req, res) {
  try {
    console.log('🔥 updateBranch', { user: req.user, params: req.params, body: req.body });

    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const branch = await branchService.updateBranch(id, req.body, saccoId, userId);
    res.json({ message: 'Branch updated successfully', branch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteBranch(req, res) {
  try {
    console.log('🔥 deleteBranch', { user: req.user, params: req.params });

    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const result = await branchService.deleteBranch(id, saccoId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ==================== User-SACCO Management ====================

export async function addUserToSACCO(req, res) {
  try {
    console.log('🔥 addUserToSACCO', { user: req.user, body: req.body, saccoMembership: req.saccoMembership });

    const userId = req.user.id;
    const saccoId = req.params.saccoId || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const saccoUser = await saccoUserService.addUserToSACCO({ ...req.body, sacco_id: saccoId }, userId);
    res.status(201).json({ message: 'User added to SACCO successfully', saccoUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function updateSACCOUserController(req, res) {
  try {
    const targetUserId = req.params.id;          // user being updated
    const updatedByUserId = req.user.id;        // admin performing the update
    let saccoId = req.params.saccoId;           // only used if super_admin

    const saccoUser = await saccoUserService.updateSACCOUser(
      targetUserId,
      req.body,
      saccoId,
      updatedByUserId
    );

    res.json({ message: 'SACCO user updated successfully', saccoUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function removeUserFromSACCO(req, res) {
  try {
    console.log('🔥 removeUserFromSACCO', { user: req.user, params: req.params });

    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.params.saccoId || req.saccoMembership?.sacco_id;
    const result = await saccoUserService.removeUserFromSACCO(id, saccoId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUserSACCOs(req, res) {
  try {
    console.log('🔥 getUserSACCOs', { user: req.user, params: req.params });

    const userId = req.params.userId || req.user.id;
    const saccoUsers = await saccoUserService.getUserSACCOs(userId);
    res.json(saccoUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==================== Settings Management ====================

export async function getSACCOSettings(req, res) {
  try {
    console.log('🔥 getSACCOSettings', { user: req.user, params: req.params, query: req.query });

    const saccoId = req.params.id || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const settings = await settingsService.getSACCOSettings(saccoId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSACCOSettings(req, res) {
  try {
    console.log('🔥 updateSACCOSettings', { user: req.user, params: req.params, body: req.body });

    const saccoId = req.params.id || req.body.sacco_id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const settings = await settingsService.updateSACCOSettings(saccoId, req.body, userId);
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function resetSACCOSettings(req, res) {
  try {
    console.log('🔥 resetSACCOSettings', { user: req.user, params: req.params });

    const saccoId = req.params.id || req.saccoMembership?.sacco_id;
    const userId = req.user.id;
    const settings = await settingsService.resetSACCOSettings(saccoId, userId);
    res.json({ message: 'Settings reset to defaults', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ==================== Audit Logs ====================

export async function getAuditLogs(req, res) {
  try {
    console.log('🔥 getAuditLogs', { user: req.user, params: req.params, query: req.query });

    const saccoId = req.params.id || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const options = {
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0,
      entity: req.query.entity,
      user_id: req.query.user_id
    };
    const result = await auditLogService.getAuditLogs(saccoId, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEntityAuditLogs(req, res) {
  try {
    console.log('🔥 getEntityAuditLogs', { user: req.user, params: req.params });

    const saccoId = req.params.id || req.query.sacco_id || req.saccoMembership?.sacco_id;
    const { entity, entityId } = req.params;
    const logs = await auditLogService.getEntityAuditLogs(saccoId, entity, entityId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
