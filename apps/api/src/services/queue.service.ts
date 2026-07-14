import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class QueueService {
  /**
   * Recalculate queue positions
   */
  static async recalculateQueuePositions(
    tx: Prisma.TransactionClient,
    stageId: string
  ) {
    const activeQueue = await tx.stageQueue.findMany({
      where: {
        stageId,
        status: {
          in: ["LOADING", "QUEUED"],
        },
      },
      orderBy: {
        enqueuedAt: "asc",
      },
    });

    for (let i = 0; i < activeQueue.length; i++) {
      await tx.stageQueue.update({
        where: {
          id: activeQueue[i].id,
        },
        data: {
          position: i + 1,
        },
      });
    }

    await tx.stageQueue.updateMany({
      where: {
        stageId,
        status: {
          in: ["READY_TO_DISPATCH", "DISPATCHED"],
        },
      },
      data: {
        position: null,
      },
    });
  }

  /**
   * Get stage queue
   */
static async getStageQueue(stageId: string) {
  const queue = await prisma.stageQueue.findMany({
    where: {
      stageId,
      status: {
        in: ["LOADING", "QUEUED", "READY_TO_DISPATCH"],
      },
    },
    orderBy: {
      position: "asc",
    },
    include: {
      vehicle: true,

      arrival: {
        select: {
          arrivalTime: true,
        },
      },

      stage: {
        select: {
          id: true,
          name: true,

          route: {
            select: {
              id: true,
              name: true,
              origin: true,
              destination: true,
            },
          },
        },
      },
    },
  });

  return queue.map((item) => ({
    ...item,
    route: item.stage.route,
  }));
}

  /**
   * Get current loading vehicle
   */
  static async getNextVehicle(stageId: string) {
    return prisma.stageQueue.findFirst({
      where: {
        stageId,
        status: "LOADING",
      },
      include: {
        vehicle: true,
        arrival: true,
        stage : {
          include: {
            route: true,
          },
        },
      },
    });
  }

  /**
   * Vehicle queue status
   */
  static async getVehicleQueueStatus(vehicleId: string) {
    return prisma.stageQueue.findFirst({
      where: {
        vehicleId,
        status: {
          in: [
            "LOADING",
            "QUEUED",
            "READY_TO_DISPATCH",
          ],
        },
      },
      include: {
        stage: true,
        arrival: true,
      },
    });
  }

  /**
   * Promote next vehicle
   */
  static async promoteNextVehicle(
    tx: Prisma.TransactionClient,
    stageId: string
  ) {
    const existingLoading =
      await tx.stageQueue.findFirst({
        where: {
          stageId,
          status: "LOADING",
        },
      });

    if (existingLoading) {
      return;
    }

    const nextVehicle =
      await tx.stageQueue.findFirst({
        where: {
          stageId,
          status: "QUEUED",
        },
        orderBy: {
          enqueuedAt: "asc",
        },
      });

    if (!nextVehicle) {
      return;
    }

    await tx.stageQueue.update({
      where: {
        id: nextVehicle.id,
      },
      data: {
        status: "LOADING",
        position: 1,
      },
    });

    await this.recalculateQueuePositions(
      tx,
      stageId
    );
  }

  /**
   * Mark loading vehicle ready
   */
  static async markReady(
    queueId: string,
    userId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      const allowed =
        user.role === "STAGE_MARSHAL" ||
        user.role === "SUPER_ADMIN";

      if (!allowed) {
        throw new Error(
          "You are not authorized to mark vehicles as ready."
        );
      }

      const queueEntry =
        await tx.stageQueue.findUnique({
          where: {
            id: queueId,
          },
        });

      if (!queueEntry) {
        throw new Error(
          "Queue entry not found."
        );
      }

      if (queueEntry.status !== "LOADING") {
        throw new Error(
          "Only a loading vehicle can be marked ready."
        );
      }

      const updated =
        await tx.stageQueue.update({
          where: {
            id: queueId,
          },
          data: {
            status: "READY_TO_DISPATCH",
            dispatchInterrupted: false,
            position: null,
          },
        });

      await this.promoteNextVehicle(
        tx,
        queueEntry.stageId
      );

      await this.recalculateQueuePositions(
        tx,
        queueEntry.stageId
      );

      return updated;
    });
  }

    static async cancelDispatch(
    queueId: string,
    userId: string
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const allowed =
      user.role === "STAGE_MARSHAL" ||
      user.role === "SUPER_ADMIN";

    if (!allowed) {
      throw new Error(
        "You are not authorized to cancel a dispatch."
      );
    }

    const queueEntry =
      await prisma.stageQueue.findUnique({
        where: {
          id: queueId,
        },
      });

    if (!queueEntry) {
      throw new Error(
        "Queue entry not found."
      );
    }

    if (
      queueEntry.status !==
      "READY_TO_DISPATCH"
    ) {
      throw new Error(
        "Only a ready vehicle can have its dispatch cancelled."
      );
    }

    return prisma.stageQueue.update({
      where: {
        id: queueId,
      },
      data: {
        dispatchInterrupted: true,
      },
    });
  }
  static async returnToQueue(
  queueId: string,
  userId: string
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const allowed =
      user.role === "STAGE_MARSHAL" ||
      user.role === "SUPER_ADMIN";

    if (!allowed) {
      throw new Error(
        "You are not authorized to return vehicles to the queue."
      );
    }

    const queueEntry =
      await tx.stageQueue.findUnique({
        where: {
          id: queueId,
        },
      });

    if (!queueEntry) {
      throw new Error(
        "Queue entry not found."
      );
    }

    if (
      queueEntry.status !== "READY_TO_DISPATCH"
    ) {
      throw new Error(
        "Only ready vehicles can be returned to the queue."
      );
    }

    // Shift every queued vehicle down by one
    await tx.stageQueue.updateMany({
      where: {
        stageId: queueEntry.stageId,
        status: "QUEUED",
      },
      data: {
        position: {
          increment: 1,
        },
      },
    });
    await tx.stageQueue.update({
      where: {
        id: queueId,
      },
      data: {
        status: "QUEUED",
        position: 1,
        dispatchInterrupted: false,
      },
    });

    await this.promoteNextVehicle(
      tx,
      queueEntry.stageId
    );

    await this.recalculateQueuePositions(
      tx,
      queueEntry.stageId
    );

    return tx.stageQueue.findUnique({
      where: {
        id: queueId,
      },
    });
  });
}
static async removeFromQueue(
  queueId: string,
  userId: string
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const allowed =
      user.role === "STAGE_MARSHAL" ||
      user.role === "SUPER_ADMIN";

    if (!allowed) {
      throw new Error(
        "You are not authorized to remove vehicles from the queue."
      );
    }

    const queueEntry =
      await tx.stageQueue.findUnique({
        where: {
          id: queueId,
        },
      });

    if (!queueEntry) {
      throw new Error(
        "Queue entry not found."
      );
    }

    if (
      queueEntry.status !== "QUEUED" &&
      queueEntry.status !== "LOADING"
    ) {
      throw new Error(
        "Only queued or loading vehicles can be removed."
      );
    }

    const wasLoading =
      queueEntry.status === "LOADING";

    const removed =
      await tx.stageQueue.update({
        where: {
          id: queueId,
        },
        data: {
          status: "REMOVED",
          position: null,
        },
      });

    await this.recalculateQueuePositions(
      tx,
      queueEntry.stageId
    );

    if (wasLoading) {
      await this.promoteNextVehicle(
        tx,
        queueEntry.stageId
      );
    }

    return removed;
  });
}
}

