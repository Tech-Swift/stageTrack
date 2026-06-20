import { prisma } from "../lib/prisma";

export class ArrivalService {
  static async createArrival(input: {
    stageId: string;
    vehicleId: string;
    userId: string;
  }) {
    const { stageId, vehicleId, userId } = input;

    return await prisma.$transaction(async (tx) => {
      const now = new Date();

      // ----------------------------------------
      // 1. AUTH CHECK (Stage Assignment lock)
      // ----------------------------------------
      const assignment = await tx.stageAssignment.findFirst({
        where: {
          userId,
          stageId,
          startDate: { lte: now },
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      });

      if (!assignment) {
        throw new Error("Unauthorized: Not an active marshal for this stage");
      }

      // ----------------------------------------
      // 2. GLOBAL VEHICLE LOCK (no double queue)
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
      // 3. CREATE ARRIVAL (EVENT)
      // ----------------------------------------
      const arrival = await tx.arrival.create({
            data: { stageId, vehicleId },
            });

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
      //  LINK ARRIVAL ↔ QUEUE
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