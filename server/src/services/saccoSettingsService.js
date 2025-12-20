/**
 * SACCO Settings Service
 * Business logic for SACCO settings management
 */
import { SaccoSettings, SACCO } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Get SACCO settings
 * @param {string} saccoId - SACCO ID
 */
export async function getSACCOSettings(saccoId) {
  const settings = await SaccoSettings.findOne({
    where: { sacco_id: saccoId },
    include: [
      {
        model: SACCO,
        as: 'sacco',
        attributes: ['id', 'name', 'status']
      }
    ]
  });

  if (!settings) {
    // Create default settings if they don't exist
    return await createDefaultSettings(saccoId);
  }

  return settings;
}

/**
 * Create default settings for a SACCO
 * @param {string} saccoId - SACCO ID
 */
async function createDefaultSettings(saccoId) {
  const settings = await SaccoSettings.create({
    sacco_id: saccoId,
    default_fare: null,
    max_stage_queue: 10,
    late_departure_penalty: null,
    crew_misconduct_penalty: null,
    operating_hours: null,
    enforce_documents: false,
    max_incidents_before_suspension: 3
  });

  return settings;
}

/**
 * Update SACCO settings
 * @param {string} saccoId - SACCO ID
 * @param {Object} data - Settings data
 * @param {string} userId - User ID performing the update
 */
export async function updateSACCOSettings(saccoId, data, userId) {
  let settings = await SaccoSettings.findOne({
    where: { sacco_id: saccoId }
  });

  if (!settings) {
    // Create if doesn't exist
    settings = await createDefaultSettings(saccoId);
  }

  const oldData = { ...settings.toJSON() };

  // Update allowed fields
  const allowedFields = [
    'default_fare',
    'max_stage_queue',
    'late_departure_penalty',
    'crew_misconduct_penalty',
    'operating_hours',
    'enforce_documents',
    'max_incidents_before_suspension'
  ];

  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // Validate operating_hours if provided (should be JSON)
  if (updateData.operating_hours && typeof updateData.operating_hours !== 'object') {
    try {
      updateData.operating_hours = JSON.parse(updateData.operating_hours);
    } catch (e) {
      throw new Error('Invalid operating_hours format. Must be valid JSON.');
    }
  }

  // Update timestamp
  updateData.updated_at = new Date();

  await settings.update(updateData);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_sacco_settings',
    entity: 'sacco_settings',
    entity_id: settings.id,
    metadata: { old_data: oldData, new_data: updateData }
  });

  return settings;
}

/**
 * Reset SACCO settings to defaults
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID performing the reset
 */
export async function resetSACCOSettings(saccoId, userId) {
  const defaultSettings = {
    default_fare: null,
    max_stage_queue: 10,
    late_departure_penalty: null,
    crew_misconduct_penalty: null,
    operating_hours: null,
    enforce_documents: false,
    max_incidents_before_suspension: 3
  };

  return await updateSACCOSettings(saccoId, defaultSettings, userId);
}

