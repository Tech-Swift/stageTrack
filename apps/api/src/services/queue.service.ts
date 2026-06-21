import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class QueueService {
  /**
   * Get all queued vehicles for a stage
   */
  static async getStageQueue(stageId: string) {
    return prisma.stageQueue.findMany({
      where: {
        stageId,
        status: "QUEUED",
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
      },
    });
  }

  /**
   * Get next vehicle in queue for a stage
   */
  static async getNextVehicle(stageId: string) {
    return prisma.stageQueue.findFirst({
      where: {
        stageId,
        status: "QUEUED",
      },
      orderBy: {
        position: "asc",
      },
      include: {
        vehicle: true,
        arrival: true,
      },
    });
  }

  /**
   * Get a vehicle's queue status (current active queue entry)
   */
  static async getVehicleQueueStatus(vehicleId: string) {
    return prisma.stageQueue.findFirst({
      where: {
        vehicleId,
      },
      include: {
        stage: true,
        arrival: true,
      },
    });
  }

  /**
   * Promote next vehicle in queue to LOADING
   * (safe single-entry enforcement per stage)
   */

    static async promoteNextVehicle(
    tx: Prisma.TransactionClient,
    stageId: string
  ) {
    // STEP 1: Try to atomically reserve a LOADING slot
    const existingLoading = await tx.stageQueue.findFirst({
      where: {
        stageId,
        status: "LOADING",
      },
      select: { id: true },
    });

    // If someone is already loading, STOP immediately
    if (existingLoading) return;

    // STEP 2: Atomically "claim" the next QUEUED vehicle
    // We do this by selecting + updating inside the SAME transaction
    const nextVehicle = await tx.stageQueue.findFirst({
      where: {
        stageId,
        status: "QUEUED",
      },
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
      },
    });

    if (!nextVehicle) return;

    // STEP 3: DOUBLE-SAFETY UPDATE (prevents race overwrite)
    const updated = await tx.stageQueue.updateMany({
      where: {
        id: nextVehicle.id,
        stageId,
        status: "QUEUED", // 🔒 critical guard
      },
      data: {
        status: "LOADING",
      },
    });

    // If 0 rows updated, someone else already claimed it
    if (updated.count === 0) return;

    return nextVehicle.id;
  }

  static async markReady(queueId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch user with role
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // 2. Role check (core security gate)
    const allowed =
      user.role === "STAGE_MARSHAL" ||
      user.role === "SUPER_ADMIN";

    if (!allowed) {
      throw new Error(
        "You are not authorized to mark vehicles as ready."
      );
    }

    // 3. Fetch queue entry
    const queueEntry = await tx.stageQueue.findUnique({
      where: { id: queueId },
    });

    if (!queueEntry) {
      throw new Error("Queue entry not found.");
    }

    // 4. State validation
    if (queueEntry.status !== "LOADING") {
      throw new Error(
        "Only a loading vehicle can be marked ready."
      );
    }

    // 5. Update status
    const updated = await tx.stageQueue.update({
      where: { id: queueId },
      data: {
        status: "READY_TO_DISPATCH",
      },
    });

    // 6. Promote next vehicle safely
    await this.promoteNextVehicle(tx, queueEntry.stageId);

    return updated;
  });
}

static async dispatchVehicle(queueId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch user + role
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // 2. Authorization check
    const allowed =
      user.role === "STAGE_MARSHAL" ||
      user.role === "SUPER_ADMIN";

    if (!allowed) {
      throw new Error(
        "You are not authorized to dispatch vehicles."
      );
    }

    // 3. Fetch queue entry
    const queueEntry = await tx.stageQueue.findUnique({
      where: { id: queueId },
    });

    if (!queueEntry) {
      throw new Error("Queue entry not found.");
    }

    // 4. State validation
    if (queueEntry.status !== "READY_TO_DISPATCH") {
      throw new Error(
        "Vehicle is not ready for dispatch."
      );
    }

    // 5. Atomic update
    const dispatched = await tx.stageQueue.update({
      where: { id: queueId },
      data: {
        status: "DISPATCHED",
        dispatchedAt: new Date(),
      },
    });

    return dispatched;
  });
}
}