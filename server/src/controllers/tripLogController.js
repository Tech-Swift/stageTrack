import * as tripService from "../services/tripLog.service.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await tripService.createTripLog(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await tripService.getAllTripLogs();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripLogById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeTrip = async (req, res) => {
  try {
    const trip = await tripService.updateTripArrival(req.params.id, {
      arrival_stage_id: req.body.arrival_stage_id,
      arrived_at: req.body.arrived_at,
      trip_status: "completed",
    });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await tripService.deleteTripLog(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
