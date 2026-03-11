/**
 * SACCO User Service
 * Business logic for managing user-SACCO relationships
 */
import { SaccoUser, User, SACCO, SaccoBranch, Role, UserRole } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Add a user to a SACCO and assign a normalized role
 * @param {Object} data
 * @param {string} data.user_id
 * @param {string} data.sacco_id
 * @param {string} [data.branch_id]
 * @param {string} data.role_id
 * @param {string} [data.status] default 'active'
 * @param {string} assignedBy - Admin assigning the user
 */
export async function addUserToSACCO(data, assignedBy) {
    let { user_id, sacco_id, branch_id, role_id, status = 'active' } = data;

  // -------------------
  // Step 0: Determine SACCO based on who is adding
  // -------------------
  const admin = await User.findByPk(assignedBy, {
    include: [{ model: Role, as: 'roles' }]
  });
  if (!admin) throw new Error('Admin not found');

  const isSuperAdmin = admin.roles.some(r => r.name === 'super_admin');

  if (!isSuperAdmin) {
    // For regular admins, override sacco_id from their token
    if (!admin.sacco_id) throw new Error('Admin is not assigned to a SACCO');
    sacco_id = admin.sacco_id;
  } else {
    // Super admin must provide SACCO ID
    if (!sacco_id) throw new Error('SACCO ID is required for super admin');
  }

  // -------------------
  // Step 1: Validate required fields
  // -------------------
  if (!user_id || !role_id) { // sacco_id is now guaranteed
    throw new Error('User ID and role ID are required');
  }

  // -------------------
  // The rest of your original code stays unchanged
  // -------------------
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');

  const sacco = await SACCO.findByPk(sacco_id);
  if (!sacco) throw new Error('SACCO not found');

  if (branch_id) {
    const branch = await SaccoBranch.findOne({ where: { id: branch_id, sacco_id } });
    if (!branch) throw new Error('Branch not found or does not belong to this SACCO');
  }

  const role = await Role.findByPk(role_id);
  if (!role) throw new Error('Role not found');

  if (!isSuperAdmin) {
    const adminMaxHierarchy = Math.max(...admin.roles.map(r => r.hierarchy_level));
    if (role.hierarchy_level >= adminMaxHierarchy) {
      throw new Error('Cannot assign a role equal or higher than your own');
    }
  }

  const existing = await SaccoUser.findOne({ where: { user_id, sacco_id } });
  if (existing) throw new Error('User is already a member of this SACCO');

  const saccoUser = await SaccoUser.create({
    user_id,
    sacco_id,
    branch_id,
    role: role.name,
    status,
    joined_at: new Date()
  });

  // Optionally update primary SACCO
  if (!user.sacco_id) {
    await user.update({ sacco_id });
  }

  // Create normalized role assignment with assigned_by_uuid
  await UserRole.create({
    user_uuid: user.id,
    role_id: role.id,
    assigned_by_uuid: assignedBy  // ✅ ADD THIS
  });

  await createAuditLog({
    sacco_id,
    user_id: assignedBy,
    action: 'add_user_to_sacco',
    entity: 'sacco_user',
    entity_id: saccoUser.id,
    metadata: { user_id, role_id, branch_id }
  });

  return saccoUser;
}


/**
 * Get all users in a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Query options
 */
 export async function getSACCOUsers(saccoId, options = {}) {
  const where = { sacco_id: saccoId };
  
  if (options.branch_id) where.branch_id = options.branch_id;
  if (options.status) where.status = options.status;

  // support array of roles (IN) or single role string
  if (options.roles && Array.isArray(options.roles) && options.roles.length) {
    where.role = options.roles; // Sequelize treats array as IN
  } else if (options.role) {
    where.role = options.role;
  }

  const users = await SaccoUser.findAll({
    where,
    include: [
      { model: User, as: "member_user", attributes: ["id", "full_name", "email", "phone"] },
      { model: SaccoBranch, as: "branch", attributes: ["id", "name"] }
    ],
    order: [["joined_at", "ASC"]]
  });

  return users;
}

/**
 * Update user's SACCO relationship
 * @param {string} saccoUserId - SaccoUser ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID (for multi-tenancy check)
 * @param {string} userId - User ID performing the update
 */
export async function updateSACCOUser(userId, data, saccoIdFromParam, updatedByUserId) {
  // -------------------
  // Step 0: Fetch the admin/director performing the update
  // -------------------
  const admin = await User.findByPk(updatedByUserId, {
    include: [{ model: Role, as: 'roles' }]
  });
  if (!admin) throw new Error('Admin not found');

  const isSuperAdmin = admin.roles.some(r => r.name === 'super_admin');

  // -------------------
  // Step 1: Determine SACCO ID
  // -------------------
  let sacco_id;
  if (!isSuperAdmin) {
    if (!admin.sacco_id) throw new Error('You are not assigned to a SACCO');
    sacco_id = admin.sacco_id; // take from token for admin/director
  } else {
    sacco_id = saccoIdFromParam;
    if (!sacco_id) throw new Error('SACCO ID is required for super admin');
  }

  // -------------------
  // Step 2: Fetch target SACCO user
  // -------------------
  const saccoUser = await SaccoUser.findOne({
    where: { id: userId, sacco_id }
  });
  if (!saccoUser) {
    throw new Error("Access denied: You do not have permission to access this SACCO's data");
  }

  const oldData = { ...saccoUser.toJSON() };

  // -------------------
  // Step 3: Prepare updates
  // -------------------
  const allowedFields = ['branch_id', 'role', 'status'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  // -------------------
  // Step 4: Verify branch if provided
  // -------------------
  if (updateData.branch_id) {
    const branch = await SaccoBranch.findOne({
      where: { id: updateData.branch_id, sacco_id } // ✅ use sacco_id
    });
    if (!branch) throw new Error('Branch not found or does not belong to this SACCO');
  }

  // -------------------
  // Step 5: Verify role hierarchy if updating role
  // -------------------
  // Step 5: Verify role hierarchy if updating role
    if (data.role_id) {
      const role = await Role.findByPk(data.role_id);
      if (!role) throw new Error('Role not found');

      if (!isSuperAdmin) {
        const adminMaxHierarchy = Math.max(...admin.roles.map(r => r.hierarchy_level));
        if (role.hierarchy_level >= adminMaxHierarchy) {
          throw new Error('Cannot assign a role equal or higher than your own');
        }
      }

      updateData.role = role.name; // store the normalized role name
    }

  // -------------------
  // Step 6: Apply updates
  // -------------------
  await saccoUser.update(updateData);
  await saccoUser.reload();

  // -------------------
  // Step 7: Audit log
  // -------------------
  await createAuditLog({
    sacco_id, // ✅ use sacco_id
    user_id: updatedByUserId,
    action: 'update_sacco_user',
    entity: 'sacco_user',
    entity_id: saccoUser.id,
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
    include: [{ model: User, as: 'member_user' }] // changed alias to member_user
  });

  if (!saccoUser) {
    throw new Error('SACCO user relationship not found or access denied');
  }

  const userData = saccoUser.member_user; // use member_user alias

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

/**
 * Get a single SACCO user by ID
 * @param {string} saccoId - SACCO ID
 * @param {string} saccoUserId - SaccoUser ID
 */
export async function getSACCOUserById(saccoId, saccoUserId) {
  const saccoUser = await SaccoUser.findOne({
    where: { id: saccoUserId, sacco_id: saccoId },
    include: [
      { model: User, as: 'member_user', attributes: ['id', 'full_name', 'email', 'phone'] }, // alias fixed
      { model: SaccoBranch, as: 'branch', attributes: ['id', 'name', 'town'], required: false }
    ]
  });

  if (!saccoUser) {
    throw new Error('SACCO user not found');
  }

  return saccoUser;
}

