import { prisma } from "../lib/prisma";

export const getMarshalDashboardData = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tenant: {
        include: {
          branding: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const activeAssignment =
    await prisma.stageAssignment.findFirst({
      where: {
        userId,
        endDate: null,
      },
      include: {
        stage: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

  const lastAssignment =
    await prisma.stageAssignment.findFirst({
      where: {
        userId,
      },
      include: {
        stage: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

  let queueSummary = {
    waiting: 0,
    loading: 0,
    dispatchedToday: 0,
  };

  let loadingVehicle = null;

  const stageId =
    activeAssignment?.stageId ??
    lastAssignment?.stageId;

  if (stageId) {
    const [
      waiting,
      loading,
      dispatchedToday,
      loadingQueue,
    ] = await Promise.all([
      prisma.stageQueue.count({
        where: {
          stageId,
          status: "QUEUED",
        },
      }),

      prisma.stageQueue.count({
        where: {
          stageId,
          status: "LOADING",
        },
      }),

      prisma.stageQueue.count({
        where: {
          stageId,
          status: "DISPATCHED",
          dispatchedAt: {
            gte: new Date(
              new Date().setHours(0, 0, 0, 0)
            ),
          },
        },
      }),

      prisma.stageQueue.findFirst({
        where: {
          stageId,
          status: "LOADING",
        },
        include: {
          vehicle: true,
        },
      }),
    ]);

    queueSummary = {
      waiting,
      loading,
      dispatchedToday,
    };

    loadingVehicle = loadingQueue;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    tenant: {
      id: user.tenant?.id,
      name: user.tenant?.name,
    },

    branding: user.tenant?.branding,

    activeAssignment,

    lastAssignment,

    queueSummary,

    loadingVehicle,

    notificationsCount: 0,
  };
};