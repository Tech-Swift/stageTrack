import * as tripOperationService from '../services/tripOperation.service.js';
import { ValidationError } from 'sequelize';

/**
 * Controller to create a new Trip Operation
 * @route POST /trips
 * @access Authenticated users
 */
export const createTrip = async (req, res) => {
  try {
    const saccoId = req.user.sacco_id; // SACCO ID from logged-in user
    const userId = req.user.id;         // User ID from session
    const data = req.body;

    // Call the service
    const trip = await tripOperationService.createTripOperation(data, saccoId, userId);

    res.status(201).json({
      status: 'success',
      message: 'Trip operation created successfully',
      data: trip
    });
  } catch (err) {
    // Handle Sequelize validation errors
    if (err instanceof ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: err.errors.map(e => e.message).join(', ')
      });
    }

    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
