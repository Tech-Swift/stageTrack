/**
 * SACCO Audit Log Service
 * Handles all audit logging for SACCO operations
 */
import { SaccoAuditLog } from '../models/index.js';

/**
 * Create an audit log entry
 * @param {Object} params - Audit log parameters
 * @param {string} params.sacco_id - SACCO ID
 * @param {string} params.user_id - User ID who performed the action
 * @param {string} params.action - Action type (e.g., "create_vehicle", "update_fare")
 * @param {string} params.entity - Entity type (e.g., "vehicle", "user", "fare")
 * @param {string} params.entity_id - ID of the affected entity
 * @param {Object} params.metadata - Additional context (optional)
 */
export async function createAuditLog({
  sacco_id,
  user_id,
  action,
  entity,
  entity_id,
  metadata = {}
}) {
  try {
    const auditLog = await SaccoAuditLog.create({
      sacco_id,
      user_id,
      action,
      entity,
      entity_id,
      metadata
    });
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main operation
    return null;
  }
}

/**
 * Get audit logs for a SACCO
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.entity - Filter by entity type
 * @param {string} options.user_id - Filter by user ID
 */
export async function getAuditLogs(saccoId, options = {}) {
  const {
    limit = 50,
    offset = 0,
    entity,
    user_id
  } = options;

  const where = { sacco_id: saccoId };
  if (entity) where.entity = entity;
  if (user_id) where.user_id = user_id;

  const logs = await SaccoAuditLog.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [
      {
        model: (await import('../models/index.js')).User,
        as: 'user',
        attributes: ['id', 'full_name', 'email']
      }
    ]
  });

  return {
    logs: logs.rows,
    total: logs.count,
    limit,
    offset
  };
}

/**
 * Get audit logs for a specific entity
 * @param {string} saccoId - SACCO ID
 * @param {string} entity - Entity type
 * @param {string} entityId - Entity ID
 */
export async function getEntityAuditLogs(saccoId, entity, entityId) {
  const logs = await SaccoAuditLog.findAll({
    where: {
      sacco_id: saccoId,
      entity,
      entity_id: entityId
    },
    order: [['created_at', 'DESC']],
    include: [
      {
        model: (await import('../models/index.js')).User,
        as: 'user',
        attributes: ['id', 'full_name', 'email']
      }
    ]
  });

  return logs;
}

