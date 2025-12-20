/**
 * SACCO Service
 * Business logic for SACCO management
 */
import { Op } from 'sequelize';
import { SACCO, SaccoSettings, SaccoBranch, SaccoUser, User } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new SACCO
 * @param {Object} data - SACCO data
 * @param {string} data.name - SACCO name
 * @param {string} data.registration_no - Registration number
 * @param {string} data.county - County
 * @param {string} userId - User ID creating the SACCO (for audit)
 */
export async function createSACCO(data, userId) {
  const { name, registration_no, county, status = 'active' } = data;

  // Validate required fields
  if (!name || !registration_no) {
    throw new Error('Name and registration number are required');
  }

  // Check for duplicate name or registration number
  const existing = await SACCO.findOne({
    where: {
      [Op.or]: [
        { name },
        { registration_no }
      ]
    }
  });

  if (existing) {
    throw new Error('SACCO with this name or registration number already exists');
  }

  // Create SACCO
  const sacco = await SACCO.create({
    name,
    registration_no,
    county,
    status
  });

  // Create default settings
  await SaccoSettings.create({
    sacco_id: sacco.id,
    default_fare: null,
    max_stage_queue: 10,
    enforce_documents: false,
    max_incidents_before_suspension: 3
  });

  // Audit log
  await createAuditLog({
    sacco_id: sacco.id,
    user_id: userId,
    action: 'create_sacco',
    entity: 'sacco',
    entity_id: sacco.id,
    metadata: { name, registration_no }
  });

  return sacco;
}

/**
 * Get all SACCOs (with multi-tenancy filtering)
 * @param {Object} filter - Filter options
 * @param {string} filter.saccoId - Filter by specific SACCO ID
 * @param {boolean} filter.isSuperAdmin - If true, return all SACCOs
 */
export async function getAllSACCOs(filter = {}) {
  const { saccoId, isSuperAdmin } = filter;

  const where = {};
  if (!isSuperAdmin && saccoId) {
    where.id = saccoId;
  }

  const saccos = await SACCO.findAll({
    where,
    include: [
      {
        model: SaccoSettings,
        as: 'settings',
        required: false
      },
      {
        model: SaccoBranch,
        as: 'branches',
        required: false
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return saccos;
}

/**
 * Get a single SACCO by ID
 * @param {string} saccoId - SACCO ID
 * @param {boolean} isSuperAdmin - If true, bypass multi-tenancy check
 */
export async function getSACCOById(saccoId, isSuperAdmin = false) {
  const sacco = await SACCO.findByPk(saccoId, {
    include: [
      {
        model: SaccoSettings,
        as: 'settings',
        required: false
      },
      {
        model: SaccoBranch,
        as: 'branches',
        required: false
      },
      {
        model: User,
        as: 'saccoUsers',
        through: { attributes: ['role', 'status', 'joined_at'] },
        required: false
      }
    ]
  });

  if (!sacco) {
    throw new Error('SACCO not found');
  }

  return sacco;
}

/**
 * Update a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} data - Update data
 * @param {string} userId - User ID performing the update
 */
export async function updateSACCO(saccoId, data, userId) {
  const sacco = await SACCO.findByPk(saccoId);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  const oldData = { ...sacco.toJSON() };

  // Update allowed fields
  const allowedFields = ['name', 'registration_no', 'county', 'status', 'operating_hours', 'fare_rules', 'penalties'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  await sacco.update(updateData);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_sacco',
    entity: 'sacco',
    entity_id: saccoId,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return sacco;
}

/**
 * Suspend a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID performing the suspension
 */
export async function suspendSACCO(saccoId, userId) {
  const sacco = await SACCO.findByPk(saccoId);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  await sacco.update({ status: 'suspended' });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'suspend_sacco',
    entity: 'sacco',
    entity_id: saccoId,
    metadata: { reason: 'Administrative suspension' }
  });

  return sacco;
}

/**
 * Activate a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID performing the activation
 */
export async function activateSACCO(saccoId, userId) {
  const sacco = await SACCO.findByPk(saccoId);
  if (!sacco) {
    throw new Error('SACCO not found');
  }

  await sacco.update({ status: 'active' });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'activate_sacco',
    entity: 'sacco',
    entity_id: saccoId
  });

  return sacco;
}

/**
 * Get SACCO statistics
 * @param {string} saccoId - SACCO ID
 */
export async function getSACCOStats(saccoId) {
  const [sacco, branchCount, userCount] = await Promise.all([
    SACCO.findByPk(saccoId),
    SaccoBranch.count({ where: { sacco_id: saccoId } }),
    SaccoUser.count({ where: { sacco_id: saccoId, status: 'active' } })
  ]);

  if (!sacco) {
    throw new Error('SACCO not found');
  }

  return {
    sacco: {
      id: sacco.id,
      name: sacco.name,
      status: sacco.status,
      registration_no: sacco.registration_no
    },
    branches: branchCount,
    active_users: userCount
  };
}

