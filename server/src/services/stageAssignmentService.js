/**
 * Stage Assignment Service
 * Business logic for Marshal-to-Stage assignments
 */
import { Op } from 'sequelize';
import { StageAssignment, Stage, Route, User } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';
import { getStageById } from './stageService.js';

/**
 * Assign marshal to stage
 * @param {Object} data - Assignment data
 * @param {string} data.stage_id - Stage ID
 * @param {string} data.user_id - User (marshal) ID
 * @param {Date} data.shift_start - Shift start time
 * @param {Date} data.shift_end - Shift end time (optional)
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID creating the assignment
 */
export async function assignMarshalToStage(data, saccoId, userId) {
  const { stage_id, user_id, shift_start, shift_end, active = true } = data;

  // Validate required fields
  if (!stage_id || !user_id || !shift_start) {
    throw new Error('Stage ID, user ID, and shift start time are required');
  }

  // Verify stage belongs to SACCO
  await getStageById(stage_id, saccoId);

  // Verify user exists
  const user = await User.findByPk(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Check for overlapping assignments
  const overlapping = await StageAssignment.findOne({
    where: {
      user_id,
      stage_id,
      active: true,
      [Op.or]: [
        {
          // New shift starts before existing shift ends
          shift_start: { [Op.lte]: shift_end || new Date('2099-12-31') },
          [Op.or]: [
            { shift_end: null },
            { shift_end: { [Op.gte]: shift_start } }
          ]
        }
      ]
    }
  });

  if (overlapping) {
    throw new Error('Marshal already has an active assignment for this stage during this time');
  }

  // Create assignment
  const assignment = await StageAssignment.create({
    stage_id,
    user_id,
    shift_start: new Date(shift_start),
    shift_end: shift_end ? new Date(shift_end) : null,
    active
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'assign_marshal_to_stage',
    entity: 'stage_assignment',
    entity_id: assignment.id,
    metadata: { stage_id, user_id, shift_start, shift_end }
  });

  return assignment;
}

/**
 * Get all assignments for a stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 * @param {Object} options - Filter options
 */
export async function getStageAssignments(stageId, saccoId, options = {}) {
  const { active_only = false, include_user = true } = options;

  // Verify stage belongs to SACCO
  await getStageById(stageId, saccoId);

  const where = { stage_id: stageId };
  if (active_only) {
    where.active = true;
    where.shift_start = { [Op.lte]: new Date() };
    where[Op.or] = [
      { shift_end: null },
      { shift_end: { [Op.gte]: new Date() } }
    ];
  }

  const include = [];
  if (include_user) {
    include.push({
      model: User,
      as: 'marshal',
      attributes: ['id', 'full_name', 'email', 'phone' ]
    });
  }

  const assignments = await StageAssignment.findAll({
    where,
    include,
    order: [['shift_start', 'DESC']]
  });

  return assignments;
}

/**
 * Get all assignments for a marshal
 * @param {string} userId - User (marshal) ID
 * @param {Object} options - Filter options
 */
export async function getMarshalAssignments(userId, options = {}) {
  const { active_only = false, saccoId } = options;

  const where = { user_id: userId };
  if (active_only) {
    where.active = true;
    where.shift_start = { [Op.lte]: new Date() };
    where[Op.or] = [
      { shift_end: null },
      { shift_end: { [Op.gte]: new Date() } }
    ];
  }

  const include = [
    {
      model: Stage,
      as: 'stage',
      include: [
        {
          model: Route,
          as: 'route',
          ...(saccoId ? { where: { sacco_id: saccoId } } : {}),
          attributes: ['id', 'route_code', 'origin', 'destination']
        }
      ],
      attributes: ['id', 'name', 'sequence_order']
    }
  ];

  const assignments = await StageAssignment.findAll({
    where,
    include,
    order: [['shift_start', 'DESC']]
  });

  return assignments;
}

/**
 * Update assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Update data
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function updateAssignment(assignmentId, data, saccoId, userId) {
  const assignment = await StageAssignment.findByPk(assignmentId, {
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

  if (!assignment) {
    throw new Error('Assignment not found or does not belong to this SACCO');
  }

  // Update assignment
  await assignment.update(data);

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'update_stage_assignment',
    entity: 'stage_assignment',
    entity_id: assignmentId,
    metadata: data
  });

  return assignment;
}

/**
 * End assignment (set active to false and shift_end to now)
 * @param {string} assignmentId - Assignment ID
 * @param {string} saccoId - SACCO ID
 * @param {string} userId - User ID
 */
export async function endAssignment(assignmentId, saccoId, userId) {
  const assignment = await StageAssignment.findByPk(assignmentId, {
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

  if (!assignment) {
    throw new Error('Assignment not found or does not belong to this SACCO');
  }

  await assignment.update({
    active: false,
    shift_end: new Date()
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: 'end_stage_assignment',
    entity: 'stage_assignment',
    entity_id: assignmentId
  });

  return assignment;
}

/**
 * Get active marshals for a stage
 * @param {string} stageId - Stage ID
 * @param {string} saccoId - SACCO ID
 */
export async function getActiveMarshals(stageId, saccoId) {
  await getStageById(stageId, saccoId);

  const assignments = await StageAssignment.findAll({
    where: {
      stage_id: stageId,
      active: true,
      shift_start: { [Op.lte]: new Date() },
      [Op.or]: [
        { shift_end: null },
        { shift_end: { [Op.gte]: new Date() } }
      ]
    },
    include: [
      {
        model: User,
        as: 'marshal',
        attributes: ['id', 'full_name', 'email', 'phone']
      }
    ],
    order: [['shift_start', 'ASC']]
  });

  return assignments.map(a => ({
    assignment_id: a.id,
    marshal: a.marshal,
    shift_start: a.shift_start,
    shift_end: a.shift_end
  }));
}


