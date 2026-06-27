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

export const isOnDuty = (
  assignment: {
    startDate: Date;
    endDate: Date | null;
    shiftStart: string | null;
    shiftEnd: string | null;
  }
): boolean => {
  const assignmentStatus =
    getAssignmentStatus(assignment);

  if (assignmentStatus !== "ACTIVE") {
    return false;
  }

  if (
    !assignment.shiftStart ||
    !assignment.shiftEnd
  ) {
    return true;
  }

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const [sh, sm] =
    assignment.shiftStart
      .split(":")
      .map(Number);

  const [eh, em] =
    assignment.shiftEnd
      .split(":")
      .map(Number);

  const startMinutes =
    sh * 60 + sm;

  const endMinutes =
    eh * 60 + em;

  // overnight shift
  if (endMinutes < startMinutes) {
    return (
      currentMinutes >= startMinutes ||
      currentMinutes < endMinutes
    );
  }

  return (
    currentMinutes >= startMinutes &&
    currentMinutes < endMinutes
  );
};