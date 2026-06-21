import { prisma } from "../lib/prisma";

export class ArrivalService {
  static async createArrival(input: {
    vehicleId: string;
    userId: string;
  }) {
    const { vehicleId, userId } = input;

    return await prisma.$transaction(async (tx) => {
      const now = new Date();

      // ----------------------------------------
      // 1. GET ACTIVE STAGE ASSIGNMENT
      // ----------------------------------------
      const assignments = await tx.stageAssignment.findMany({
        where: {
          userId,
          startDate: { lte: now },
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      });

      if (assignments.length === 0) {
        throw new Error("No active stage assignment found");
      }

      if (assignments.length > 1) {
        throw new Error(
          "Marshal has multiple active stage assignments"
        );
      }

      const stageId = assignments[0].stageId;

      // ----------------------------------------
      // 2. GLOBAL VEHICLE LOCK
      // ----------------------------------------
      const activeQueue = await tx.stageQueue.findFirst({
        where: {
          vehicleId,
          status: "QUEUED",
        },
      });

      if (activeQueue) {
        throw new Error(
          "Vehicle already active in a stage queue. Dispatch first."
        );
      }

      // ----------------------------------------
      // 3. CREATE ARRIVAL
      // ----------------------------------------
      const arrival = await tx.arrival.create({
        data: {
          stageId,
          vehicleId,
        },
      });

      // ----------------------------------------
      // 4. INCREMENT QUEUE COUNTER
      // ----------------------------------------
      const counter = await tx.stageQueueCounter.upsert({
        where: { stageId },
        create: {
          stageId,
          value: 1,
        },
        update: {
          value: {
            increment: 1,
          },
        },
      });

      // ----------------------------------------
      // 5. CREATE QUEUE ENTRY
      // ----------------------------------------
      const queueEntry = await tx.stageQueue.create({
        data: {
          stageId,
          vehicleId,
          arrivalId: arrival.id,
          position: counter.value,
          status: "QUEUED",
        },
      });

      // ----------------------------------------
      // 6. LINK ARRIVAL ↔ QUEUE
      // ----------------------------------------
      const updatedArrival = await tx.arrival.update({
        where: { id: arrival.id },
        data: {
          queueEntryId: queueEntry.id,
        },
      });

      return {
        arrival: updatedArrival,
        queue: queueEntry,
      };
    });
  }
}