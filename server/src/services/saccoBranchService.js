/**
 * SACCO Branch Service
 * Business logic for branch management
 */
import { SaccoBranch, SACCO } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new branch
 * @param {Object} data - Branch data
 * @param {string} data.sacco_id - SACCO ID
 * @param {string} data.name - Branch name
 * @param {string} data.town - Town/location
 * @param {string} data.main_stage_name - Main stage name
 * @param {boolean} data.stage_cluster - Is this a stage cluster
 * @param {string} userId - User ID creating the branch
 */
export async function createBranch(data, userId) {
  const { sacco_id, name, town, main_stage_name, stage_cluster } = data;

  // Validate required fields
  if (!sacco_id || !name || !town) {
    throw new Error('SACCO ID, name, and town are required');
  }

  // Verify SACCO exists
  const sacco = await SACCO.findByPk(sacco_id);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  // Create branch
  const branch = await SaccoBranch.create({
    sacco_id,
    name,
    town,
    main_stage_name,
    stage_cluster: stage_cluster || false
  });

  // Audit log
  await createAuditLog({
    sacco_id,
    user_id: userId,
    action: 'create_branch',
    entity: 'branch',
    entity_id: branch.id,
    metadata: { name, town }
  });

  return branch;
}

/**
 * Get all branches for a SACCO
 * @param {string} saccoId - SACCO ID
 */
export async function getBranchesBySACCO(saccoId) {
  const branches = await SaccoBranch.findAll({
    where: { sacco_id: saccoId },
    include: [
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name', 'status']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return branches;
}

/**
 * Get a single branch by ID
 * @param {string} branchId - Branch ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 */
export async function getBranchById(branchId, saccoId) {
  const branch = await SaccoBranch.findOne({
    where: {
      id: branchId,
      sacco_id: saccoId // Multi-tenancy isolation
    },
    include: [
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name', 'status']
      }
    ]
  });

  if (!branch) {
    throw new Error('Branch not found or access denied');
  }

  return branch;
}

/**
 * Update a branch
 * @param {string} branchId - Branch ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the update
 */
export async function updateBranch(branchId, data, saccoId, userId) {
  const branch = await SaccoBranch.findOne({
    where: {
      id: branchId,
      sacco_id: saccoId // Multi-tenancy isolation
    }
  });

  if (!branch) {
    throw new Error('Branch not found or access denied');
  }

  const oldData = { ...branch.toJSON() };

  // Update allowed fields
  const allowedFields = ['name', 'town', 'main_stage_name', 'stage_cluster'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  await branch.update(updateData);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_branch',
    entity: 'branch',
    entity_id: branchId,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return branch;
}

/**
 * Delete a branch
 * @param {string} branchId - Branch ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the deletion
 */
export async function deleteBranch(branchId, saccoId, userId) {
  const branch = await SaccoBranch.findOne({
    where: {
      id: branchId,
      sacco_id: saccoId // Multi-tenancy isolation
    }
  });

  if (!branch) {
    throw new Error('Branch not found or access denied');
  }

  // Check if branch has users assigned
  const { SaccoUser } = await import('../models/index.js');
  const userCount = await SaccoUser.count({
    where: { branch_id: branchId }
  });

  if (userCount > 0) {
    throw new Error(`Cannot delete branch: ${userCount} user(s) are assigned to this branch`);
  }

  await branch.destroy();

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_branch',
    entity: 'branch',
    entity_id: branchId,
    metadata: { branch_name: branch.name }
  });

  return { message: 'Branch deleted successfully' };
}

