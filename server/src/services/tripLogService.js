import TripLog from "../models/tripLog.model.js";

export async function createTripLog(data) {
  return await TripLog.create(data);
}

export async function getAllTripLogs() {
  return await TripLog.findAll();
}

export async function getTripLogById(id) {
  return await TripLog.findByPk(id);
}

export async function updateTripArrival(id, arrivalData) {
  const trip = await TripLog.findByPk(id);
  if (!trip) throw new Error("Trip not found");

  return await trip.update(arrivalData);
}

export async function deleteTripLog(id) {
  const trip = await TripLog.findByPk(id);
  if (!trip) throw new Error("Trip not found");

  await trip.destroy();
  return true;
}
