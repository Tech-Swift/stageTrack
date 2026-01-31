import { Op } from 'sequelize';
import { Stage, Route,TripOperation } from '../models/index.js';
import { createAuditLog } from './saccoAuditLogService.js';

/**
 * Create a new Trip Operation
 * @param {Object} data - Trip Operation data
 * @param {string} data.vehicle_id - Vehicle ID
 * @param {string} data.route_id - Route ID
 * @param {string} data.departure_stage_id - Departure Stage ID
 * @param {string} [data.arrival_stage_id] - Arrival Stage ID
 * @param {string} [data.crew_assignment_id] - Crew assignment ID
 * @param {Date|string} data.departed_at - Departure timestamp
 * @param {string} saccoId - SACCO ID (for multi-tenancy)
 * @param {string} userId - User ID creating the trip
 */

export async function createTripOperation(data, saccoId, userId) {
  const {
    vehicle_id,
    route_id,
    departure_stage_id,
    arrival_stage_id,
    crew_assignment_id,
    departed_at
  } = data;

  // Validate required fields
  if (!vehicle_id || !route_id || !departure_stage_id || !departed_at) {
    throw new Error("vehicle_id, route_id, departure_stage_id, and departed_at are required");
  }

  // Verify vehicle exists and belongs to SACCO
  const vehicle = await Vehicle.findOne({
    where: { id: vehicle_id, sacco_id: saccoId }
  });

  if (!vehicle) {
    throw new Error("Vehicle not found or does not belong to this SACCO");
  }

  // Optional: verify route belongs to SACCO
  // const route = await getRouteById(route_id, saccoId);
  // if (!route) throw new Error("Route not found or does not belong to this SACCO");

  // Create trip operation
  const trip = await TripOperation.create({
    vehicle_id,
    route_id,
    departure_stage_id,
    arrival_stage_id: arrival_stage_id || null,
    crew_assignment_id: crew_assignment_id || null,
    departed_at,
    trip_status: "queued" // default
  });

  // Audit log
  await createAuditLog({
    sacco_id: saccoId,
    user_id: userId,
    action: "create_trip_operation",
    entity: "trip_operation",
    entity_id: trip.id,
    metadata: { vehicle_id, route_id, departure_stage_id, arrival_stage_id, crew_assignment_id, departed_at }
  });

  return trip;
}