import { prisma } from "../lib/prisma";
import { isOnDuty } from "../utils/assignment";
import { shiftsOverlap } from "../utils/shifts";

export const createStageAssignment = async (params: {
  tenantId: string;
  userId: string;
  stageId: string;
  startDate: Date;
  endDate?: Date | null;
  shiftStart?: string | null;
  shiftEnd?: string | null;
}) => {
  const {
    tenantId,
    userId,
    stageId,
    startDate,
    endDate,
    shiftStart,
    shiftEnd,
  } = params;

  // 1. validate shifts
  if (!!shiftStart !== !!shiftEnd) {
    throw new Error(
      "Both shiftStart and shiftEnd are required."
    );
  }

  // 2. verify marshal
  const marshal = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "STAGE_MARSHAL",
      tenantId,
    },
  });

  if (!marshal) {
    throw new Error("Stage marshal not found");
  }

  // 3. verify stage
  const stage = await prisma.stage.findFirst({
    where: {
      id: stageId,
      tenantId,
      isActive: true,
    },
  });

  if (!stage) {
    throw new Error("Stage not found");
  }

  // 4. date overlap check
  const requestedEndDate =
    endDate ?? new Date("9999-12-31");

    const possibleOverlaps =
  await prisma.stageAssignment.findMany({
    where: {
      tenantId,
      userId,
      AND: [
        {
          startDate: {
            lte: requestedEndDate,
          },
        },
        {
          OR: [
            {
              endDate: null,
            },
            {
              endDate: {
                gte: startDate,
              },
            },
          ],
        },
      ],
    },
  });

  // 5. shift overlap check
  const conflictingAssignment =
    possibleOverlaps.find((assignment) => {
      // if either assignment has no shifts,
      // treat it as an all-day assignment
      if (
        !shiftStart ||
        !shiftEnd ||
        !assignment.shiftStart ||
        !assignment.shiftEnd
      ) {
        return true;
      }

      return shiftsOverlap(
        shiftStart,
        shiftEnd,
        assignment.shiftStart,
        assignment.shiftEnd
      );
    });

  if (conflictingAssignment) {
    throw new Error(
      "Marshal already has another assignment during this shift."
    );
  }

  // 6. create assignment
  return prisma.stageAssignment.create({
    data: {
      tenantId,
      userId,
      stageId,
      startDate,
      endDate,
      shiftStart,
      shiftEnd,
    },
    include: {
      user: true,
      stage: {
        include: {
          route: true,
        },
      },
    },
  });
};

export const getStageAssignmentsService =
  async (
    tenantId: string,
    stageId: string
  ) => {
    return prisma.stageAssignment.findMany({
      where: {
        tenantId,
        stageId,
      },
      include: {
        user: true,
        stage: {
          include: {
            route: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
  };

export const getActiveMarshalsForStage =
  async (
    tenantId: string,
    stageId: string
  ) => {
    const now = new Date();

    return prisma.stageAssignment.findMany({
      where: {
        tenantId,
        stageId,
        startDate: {
          lte: now,
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: now,
            },
          },
        ],
      },
      include: {
        user: true,
        stage: true,
      },
    });
  };

export const getMarshalAssignmentsService =
  async (
    tenantId: string,
    userId: string
  ) => {
    return prisma.stageAssignment.findMany({
      where: {
        tenantId,
        userId,
      },
      include: {
        stage: {
          include: {
            route: true,
          },
        },
        user: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  };

export const getMarshalDutyStatus =
  async (
    tenantId: string,
    userId: string,
    stageId: string
  ) => {
    const assignments =
      await prisma.stageAssignment.findMany({
        where: {
          tenantId,
          userId,
          stageId,
        },
        orderBy: {
          startDate: "desc",
        },
      });

    if (!assignments.length) {
      return {
        status: "NOT_ASSIGNED",
        canManageQueue: false,
        assignment: null,
      };
    }

    const activeAssignment =
      assignments.find((assignment) =>
        isOnDuty(assignment)
      );

    if (!activeAssignment) {
      return {
        status: "OFF_DUTY",
        canManageQueue: false,
        assignment: null,
      };
    }

    return {
      status: "ACTIVE",
      canManageQueue: true,
      assignment: activeAssignment,
    };
  };