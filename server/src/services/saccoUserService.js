/**
 * SACCO User Service
 * Business logic for managing user-SACCO relationships
 */
import { SaccoUser, User, SACCO, SaccoBranch } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Add a user to a SACCO
 * @param {Object} data - User-SACCO relationship data
 * @param {string} data.user_id - User ID
 * @param {string} data.sacco_id - SACCO ID
 * @param {string} data.branch_id - Branch ID (optional)
 * @param {string} data.role - Role within the SACCO
 * @param {string} assignedBy - User ID assigning the relationship
 */
export async function addUserToSACCO(data, assignedBy) {
  const { user_id, sacco_id, branch_id, role, status = 'active' } = data;

  // Validate required fields
  if (!user_id || !sacco_id || !role) {
    throw new Error('User ID, SACCO ID, and role are required');
  }

  // Verify user exists
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify SACCO exists
  const sacco = await SACCO.findByPk(sacco_id);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  // Verify branch exists if provided
  if (branch_id) {
    const branch = await SaccoBranch.findOne({
      where: { id: branch_id, sacco_id }
    });
    if (!branch) {
      throw new Error('Branch not found or does not belong to this SACCO');
    }
  }

  // Check if user is already in this SACCO
  const existing = await SaccoUser.findOne({
    where: { user_id, sacco_id }
  });

  if (existing) {
    throw new Error('User is already a member of this SACCO');
  }

  // Create relationship
  const saccoUser = await SaccoUser.create({
    user_id,
    sacco_id,
    branch_id,
    role,
    status,
    joined_at: new Date()
  });

  // Update user's sacco_id if this is their primary SACCO
  if (!user.sacco_id) {
    await user.update({ sacco_id });
  }

  // Audit log
  await createAuditLog({
    sacco_id,
    user_id: assignedBy,
    action: 'add_user_to_sacco',
    entity: 'sacco_user',
    entity_id: saccoUser.id,
    metadata: { user_id, role, branch_id }
  });

  return saccoUser;
}

/**
 * Get all users in a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Query options
 */
export async function getSACCOUsers(saccoId, options = {}) {
  const { branch_id, status, role } = options;

  const where = { sacco_id: saccoId };
  if (branch_id) where.branch_id = branch_id;
  if (status) where.status = status;
  if (role) where.role = role;

  const saccoUsers = await SaccoUser.findAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email', 'phone', 'status']
      },
      {
        model: SaccoBranch,
        as: 'branch',
        required: false,
        attributes: ['id', 'name', 'town']
      }
    ],
    order: [['joined_at', 'DESC']]
  });

  return saccoUsers;
}

/**
 * Update user's SACCO relationship
 * @param {string} saccoUserId - SaccoUser ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the update
 */
export async function updateSACCOUser(saccoUserId, data, saccoId, userId) {
  const saccoUser = await SaccoUser.findOne({
    where: {
      id: saccoUserId,
      sacco_id: saccoId // Multi-tenancy isolation
    }
  });

  if (!saccoUser) {
    throw new Error('SACCO user relationship not found or access denied');
  }

  const oldData = { ...saccoUser.toJSON() };

  // Update allowed fields
  const allowedFields = ['branch_id', 'role', 'status'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // Verify branch if provided
  if (updateData.branch_id) {
    const branch = await SaccoBranch.findOne({
      where: { id: updateData.branch_id, sacco_id: saccoId }
    });
    if (!branch) {
      throw new Error('Branch not found or does not belong to this SACCO');
    }
  }

  await saccoUser.update(updateData);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_sacco_user',
    entity: 'sacco_user',
    entity_id: saccoUserId,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return saccoUser;
}

/**
 * Remove user from SACCO
 * @param {string} saccoUserId - SaccoUser ID
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the removal
 */
export async function removeUserFromSACCO(saccoUserId, saccoId, userId) {
  const saccoUser = await SaccoUser.findOne({
    where: {
      id: saccoUserId,
      sacco_id: saccoId // Multi-tenancy isolation
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!saccoUser) {
    throw new Error('SACCO user relationship not found or access denied');
  }

  const userData = saccoUser.user;

  await saccoUser.destroy();

  // If this was the user's primary SACCO, clear sacco_id
  if (userData.sacco_id === saccoId) {
    await userData.update({ sacco_id: null });
  }

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'remove_user_from_sacco',
    entity: 'sacco_user',
    entity_id: saccoUserId,
    metadata: { user_id: userData.id, user_name: userData.full_name }
  });

  return { message: 'User removed from SACCO successfully' };
}

/**
 * Get user's SACCO memberships
 * @param {string} userId - User ID
 */
export async function getUserSACCOs(userId) {
  const saccoUsers = await SaccoUser.findAll({
    where: { user_id: userId },
    include: [
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name', 'status', 'county']
      },
      {
        model: SaccoBranch,
        as: 'branch',
        required: false,
        attributes: ['id', 'name', 'town']
      }
    ],
    order: [['joined_at', 'DESC']]
  });

  return saccoUsers;
}

