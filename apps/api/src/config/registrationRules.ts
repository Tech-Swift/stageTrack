export const registrationRules = {
  DRIVER: {
    required: ["licenceUrl", "goodConductUrl"],
  },

  CONDUCTOR: {
    required: ["badgeUrl", "goodConductUrl"],
  },

  VEHICLE_OWNER: {
    required: ["vehicleLogbookUrl"],
  },

  STAGE_MARSHAL: {
    required: [],
  },
} as const;