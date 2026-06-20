import { prisma } from "../lib/prisma";

export const createStageAssignment = async (params: {
  tenantId: string;
  userId: string;
  stageId: string;
  startDate: Date;
  endDate?: Date | null;
}) => {
  const { tenantId, userId, stageId, startDate, endDate } = params;

  // 1. verify marshal
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

  // 2. verify stage
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

  // 3. overlap check
  const requestedEndDate = endDate ?? new Date("9999-12-31");

  const overlap = await prisma.stageAssignment.findFirst({
    where: {
      tenantId,
      userId,

      AND: [
        {
          startDate: { lte: requestedEndDate },
        },
        {
          OR: [
            { endDate: null },
            { endDate: { gte: startDate } },
          ],
        },
      ],
    },
  });

  if (overlap) {
    throw new Error(
      `Marshal already assigned to ${overlap.stageId} during this period`
    );
  }

  // 4. create assignment
  return prisma.stageAssignment.create({
    data: {
      tenantId,
      userId,
      stageId,
      startDate,
      endDate,
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

export const getActiveMarshalsForStage = async (
  tenantId: string,
  stageId: string
) => {
  const now = new Date();

  return prisma.stageAssignment.findMany({
    where: {
      tenantId,
      stageId,
      startDate: { lte: now },
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    include: {
      user: true,
      stage: true,
    },
  });
};

export const getMarshalAssignmentsService = async (
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