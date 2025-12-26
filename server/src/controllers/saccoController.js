/**
 * SACCO Controller
 * HTTP request handlers for SACCO operations
 */
import * as saccoService from '../services/saccoService.js';
import * as branchService from '../services/saccoBranchService.js';
import * as saccoUserService from '../services/saccoUserService.js';

export async function getSACCOUserById(req, res) {
  const { saccoId, id } = req.params;
  try {
    const saccoUser = await saccoUserService.getSACCOUserById(saccoId, id);
    return res.json(saccoUser);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ message: err.message });
  }
}

export async function createSACCO(req, res) {
  try {
    const userId = req.user.id;
    const sacco = await saccoService.createSACCO(req.body, userId);
    res.status(201).json({ message: 'SACCO created successfully', sacco });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllSACCOs(req, res) {
  try {
    const isSuperAdmin = req.saccoContext?.isSuperAdmin || false;
    const saccoId = req.user?.sacco_id;
    const saccos = await saccoService.getAllSACCOs({ saccoId, isSuperAdmin });
    res.json(saccos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSACCOById(req, res) {
  try {
    const { id } = req.params;
    const isSuperAdmin = req.saccoContext?.isSuperAdmin || false;
    const sacco = await saccoService.getSACCOById(id, isSuperAdmin);
    res.json(sacco);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function updateSACCO(req, res) {
  try {
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
    const userId = req.user.id;
    const saccoId = req.user.sacco_id || req.body.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const branch = await branchService.createBranch(
      { ...req.body, sacco_id: saccoId },
      userId
    );
    res.status(201).json({ message: 'Branch created successfully', branch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getBranches(req, res) {
  try {
    const saccoId = req.user.sacco_id || req.query.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const branches = await branchService.getBranchesBySACCO(saccoId);
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBranchById(req, res) {
  try {
    const { id } = req.params;
    const saccoId = req.user.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await branchService.getBranchById(id, saccoId);
    res.json(branch);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function updateBranch(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.user.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await branchService.updateBranch(id, req.body, saccoId, userId);
    res.json({ message: 'Branch updated successfully', branch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteBranch(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.user.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await branchService.deleteBranch(id, saccoId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ==================== User-SACCO Management ====================

export async function addUserToSACCO(req, res) {
  try {
    const userId = req.user.id;
    const saccoId = req.user.sacco_id || req.body.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const saccoUser = await saccoUserService.addUserToSACCO(
      { ...req.body, sacco_id: saccoId },
      userId
    );
    res.status(201).json({ message: 'User added to SACCO successfully', saccoUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getSACCOUsers(req, res) {
  try {
    const saccoId = req.user.sacco_id || req.query.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const options = {
      branch_id: req.query.branch_id,
      status: req.query.status,
      role: req.query.role
    };

    const users = await saccoUserService.getSACCOUsers(saccoId, options);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSACCOUser(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.user.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const saccoUser = await saccoUserService.updateSACCOUser(id, req.body, saccoId, userId);
    res.json({ message: 'SACCO user updated successfully', saccoUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function removeUserFromSACCO(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const saccoId = req.user.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await saccoUserService.removeUserFromSACCO(id, saccoId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUserSACCOs(req, res) {
  try {
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
    const saccoId = req.user.sacco_id || req.params.id || req.query.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const settings = await settingsService.getSACCOSettings(saccoId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSACCOSettings(req, res) {
  try {
    const saccoId = req.user.sacco_id || req.params.id || req.body.sacco_id;
    const userId = req.user.id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const settings = await settingsService.updateSACCOSettings(saccoId, req.body, userId);
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function resetSACCOSettings(req, res) {
  try {
    const saccoId = req.user.sacco_id || req.params.id;
    const userId = req.user.id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const settings = await settingsService.resetSACCOSettings(saccoId, userId);
    res.json({ message: 'Settings reset to defaults', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ==================== Audit Logs ====================

export async function getAuditLogs(req, res) {
  try {
    const saccoId = req.user.sacco_id || req.query.sacco_id;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

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
    const saccoId = req.user.sacco_id || req.query.sacco_id;
    const { entity, entityId } = req.params;
    
    if (!saccoId && !req.saccoContext?.isSuperAdmin) {
      return res.status(403).json({ message: 'SACCO ID is required' });
    }

    const logs = await auditLogService.getEntityAuditLogs(saccoId, entity, entityId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

