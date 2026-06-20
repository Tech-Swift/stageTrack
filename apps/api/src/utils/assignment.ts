export const getAssignmentStatus = (assignment: {
  startDate: Date;
  endDate: Date | null;
}) => {
  const now = new Date();

  if (now < assignment.startDate) return "PENDING";

  if (assignment.endDate && now > assignment.endDate)
    return "EXPIRED";

  return "ACTIVE";
};