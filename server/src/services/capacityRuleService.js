/**
 * Capacity Rule Service
 * Business logic for Stage capacity and queue management
 */
import { Op } from 'sequelize';
import { StageCapacityRule, Stage, Route } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';
import { getStageById } from './stageService.js';

/**
 * Create capacity rule for a stage
 * @param {Object} data - Capacity rule data
 * @param {string} data.stage_id - Stage ID
 * @param {number} data.max_vehicles - Maximum vehicles allowed
 * @param {string} data.queue_strategy - Queue strategy (FIFO, PRIORITY, TIME_BASED)
 * @param {string} data.overflow_action - Overflow action (HOLD, REDIRECT, DENY)
 * @param {Date} data.effective_from - Effective start date
 * @param {Date} data.effective_to - Effective end date (optional)
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID creating the rule
 */
export async function createCapacityRule(data, saccoId, userId) {
  let {
    stage_id,
    max_vehicles,
    queue_strategy = "FIFO",
    overflow_action = "HOLD",
    effective_from,
    effective_to = null,
    rule_type = "FIFO_ONLY",
  } = data;

  if (!stage_id || !effective_from) {
    throw new Error('Stage ID and effective_from date are required');
  }

  // Convert dates
  effective_from = new Date(effective_from);
  effective_to = effective_to ? new Date(effective_to) : null;

  // Validate enums
  const ALLOWED_QUEUE = ['FIFO', 'PRIORITY', 'TIME_BASED'];
  const ALLOWED_OVERFLOW = ['HOLD', 'REDIRECT', 'DENY'];
  const ALLOWED_RULE_TYPES = ['FIFO_ONLY', 'CAPACITY_LIMITED'];

  if (!ALLOWED_QUEUE.includes(queue_strategy)) throw new Error(`Invalid queue_strategy`);
  if (!ALLOWED_OVERFLOW.includes(overflow_action)) throw new Error(`Invalid overflow_action`);
  if (!ALLOWED_RULE_TYPES.includes(rule_type)) throw new Error(`Invalid rule_type`);

  // Verify stage exists
  await getStageById(stage_id, saccoId);

  // 1️⃣ End any previous active rule that overlaps or is currently active
  await StageCapacityRule.update(
    { effective_to: effective_from },
    {
      where: {
        stage_id,
        effective_to: null,
        effective_from: { [Op.lte]: effective_from }
      }
    }
  );

  // 2️⃣ Check for overlapping rules with future periods
  const overlapping = await StageCapacityRule.findOne({
    where: {
      stage_id,
      effective_from: { [Op.lt]: effective_to || new Date('2099-12-31') },
      [Op.or]: [
        { effective_to: null },
        { effective_to: { [Op.gt]: effective_from } }
      ]
    }
  });

  if (overlapping) {
    throw new Error('Cannot create rule: overlapping time frame with an existing rule');
  }

  // 3️⃣ Create new rule
  const rule = await StageCapacityRule.create({
    stage_id,
    max_vehicles,
    queue_strategy,
    overflow_action,
    effective_from,
    effective_to,
    rule_type
  });

  // 4️⃣ Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: "create_capacity_rule",
    entity: "stage_capacity_rule",
    entity_id: rule.id,
    metadata: { stage_id, max_vehicles, queue_strategy, overflow_action, effective_from, effective_to, rule_type }
  });

  return rule;
}
/**
 * Get current capacity rule for a stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getCurrentCapacityRule(stageId, saccoId) {
  await getStageById(stageId, saccoId);

  const rule = await StageCapacityRule.findOne({
    where: {
      stage_id: stageId,
      effective_from: { [Op.lte]: new Date() },
      [Op.or]: [
        { effective_to: null },
        { effective_to: { [Op.gte]: new Date() } }
      ]
    },
    order: [['effective_from', 'DESC']]
  });

  return rule;
}

/**
 * Get all capacity rules for a stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getCapacityRules(stageId, saccoId) {
  await getStageById(stageId, saccoId);

  const rules = await StageCapacityRule.findAll({
    where: { stage_id: stageId },
    order: [['effective_from', 'DESC']]
  });

  return rules;
}

/**
 * Update capacity rule
 * @param {string} ruleId - Rule ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function updateCapacityRule(ruleId, data, saccoId, userId) {
  const rule = await StageCapacityRule.findByPk(ruleId, {
    include: [
      {
        model: Stage,
        as: 'stage',
        include: [
          {
            model: Route,
            as: 'route',
            where: { sacco_id: saccoId }
          }
        ]
      }
    ]
  });

  if (!rule) {
    throw new Error('Capacity rule not found or does not belong to this SACCO');
  }

  // Update rule
  await rule.update(data);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_capacity_rule',
    entity: 'stage_capacity_rule',
    entity_id: ruleId,
    metadata: data
  });

  return rule;
}

/**
 * Delete capacity rule
 * @param {string} ruleId - Rule ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function deleteCapacityRule(ruleId, saccoId, userId) {
  const rule = await StageCapacityRule.findByPk(ruleId, {
    include: [
      {
        model: Stage,
        as: 'stage',
        include: [
          {
            model: Route,
            as: 'route',
            where: { sacco_id: saccoId }
          }
        ]
      }
    ]
  });

  if (!rule) {
    throw new Error('Capacity rule not found or does not belong to this SACCO');
  }

  await rule.destroy();

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'delete_capacity_rule',
    entity: 'stage_capacity_rule',
    entity_id: ruleId
  });

  return { message: 'Capacity rule deleted successfully' };
}


