export const createTripFinancial = async (tripId, data, marshalId) => {
  return await TripFinancial.create({
    trip_operation_id: tripId,
    stage_marshal_id: marshalId,
    ...data
  });
};
