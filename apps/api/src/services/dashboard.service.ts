import { UserRole } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { getMarshalDutyStatus } from "./assignment.service";

/**
 * ============================================================================
 * STAGE MARSHAL DASHBOARD
 * ============================================================================
 */
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

  if (!user.tenantId) {
    throw new Error("User is not assigned to a tenant");
  }

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

  let duty = {
    status: "OFFLINE",
    canManageQueue: false,
    assignment: null as any,
  };

  if (lastAssignment) {
    duty = await getMarshalDutyStatus(
      user.tenantId,
      userId,
      lastAssignment.stageId
    );
  }

  let queueSummary = {
    waiting: 0,
    loading: 0,
    dispatchedToday: 0,
  };

  let loadingVehicle = null;

  const stageId =
    duty.assignment?.stageId ??
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

    notificationsCount: 0,

    roleData: {
      activeAssignment: duty.assignment,
      status: duty.status,
      canManageQueue: duty.canManageQueue,
      lastAssignment,
      queueSummary,
      loadingVehicle,
    },
  };
};

/**
 * ============================================================================
 * DASHBOARD ORCHESTRATOR
 * ============================================================================
 */

interface DashboardContext {
  userId: string;
  tenantId?: string;
  role: UserRole;
}

export const getDashboardData = async ({
  userId,
  tenantId,
  role,
}: DashboardContext) => {
  switch (role) {
    case UserRole.STAGE_MARSHAL:
      return getMarshalDashboardData(userId);

    case UserRole.SACCO_ADMIN:
      throw new Error(
        "SACCO Admin dashboard is not implemented yet."
      );

    case UserRole.DIRECTOR:
      throw new Error(
        "Director dashboard is not implemented yet."
      );

    case UserRole.MANAGER:
      throw new Error(
        "Manager dashboard is not implemented yet."
      );

    case UserRole.DRIVER:
      throw new Error(
        "Driver dashboard is not implemented yet."
      );

    case UserRole.CONDUCTOR:
      throw new Error(
        "Conductor dashboard is not implemented yet."
      );

    case UserRole.VEHICLE_OWNER:
      throw new Error(
        "Vehicle Owner dashboard is not implemented yet."
      );

    case UserRole.SUPER_ADMIN:
      throw new Error(
        "Super Admin dashboard is not implemented yet."
      );

    default:
      throw new Error("Unsupported user role.");
  }
};