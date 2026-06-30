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
        throw new Error("Marshal has multiple active stage assignments");
      }

      const stageId = assignments[0].stageId;

      // ----------------------------------------
      // 2. VEHICLE GLOBAL LOCK (LOADING + QUEUED)
      // ----------------------------------------

      const activeQueue = await tx.stageQueue.findFirst({
        where: {
          vehicleId,
          status: {
            in: [
              "READY_TO_DISPATCH",
              "LOADING",
              "QUEUED",
            ],
          },
        },
        include: {
          stage: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (activeQueue) {
        throw new Error(
          `This vehicle is already in the queue at ${activeQueue.stage.name}. A vehicle can only be in one active queue at a time.`
      );
      }

      // ----------------------------------------
      // 3. CREATE ARRIVAL EVENT
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
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const counter =
        await tx.stageQueueCounter.upsert({
          where: {
            stageId_date: {
              stageId,
              date: today,
            },
          },
          create: {
            stageId,
            date: today,
            value: 1,
          },
          update: {
            value: {
              increment: 1,
            },
          },
        });

      const sequenceNumber = counter.value;

      // ----------------------------------------
      // 5. CHECK IF ANY VEHICLE IS CURRENTLY LOADING
      // ----------------------------------------
      const loadingVehicle = await tx.stageQueue.findFirst({
        where: {
          stageId,
          status: "LOADING",
        },
      });

      const status = loadingVehicle ? "QUEUED" : "LOADING";

      // ----------------------------------------
      // 6. CREATE QUEUE ENTRY
      // ----------------------------------------
      const lastPosition = await tx.stageQueue.aggregate({
        where: {
          stageId,
          position: {
            not: null,
          },
        },
        _max: {
          position: true,
        },
      });

      const nextPosition = (lastPosition._max.position ?? 0) + 1;

      const position =
        status === "QUEUED" ? nextPosition : null;

      const queueEntry = await tx.stageQueue.create({
        data: {
          stageId,
          vehicleId,
          arrivalId: arrival.id,
          sequenceNumber,
          position,
          status,
        },
      });
      // ----------------------------------------
      // 7. LINK ARRIVAL ↔ QUEUE
      // ----------------------------------------
      const updatedArrival = await tx.arrival.update({
        where: { id: arrival.id },
        data: {
          queueEntryId: queueEntry.id,
        },
      });

      // ----------------------------------------
      // 8. RESPONSE
      // ----------------------------------------
      return {
        arrival: updatedArrival,
        queue: queueEntry,
        queueNumber: queueEntry.position,
        message:
          status === "LOADING"
            ? "Vehicle is now loading passengers"
            : `Vehicle queued at position ${queueEntry.position}`,
      };
    });
  }

  // ----------------------------------------
  // GET QUEUE FOR CURRENT MARSHAL STAGE
  // ----------------------------------------
  static async getQueue(userId: string) {
    const now = new Date();

    const assignment = await prisma.stageAssignment.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
    });

    if (!assignment) {
      throw new Error("No active stage assignment found");
    }

    return prisma.stageQueue.findMany({
      where: {
        stageId: assignment.stageId,
        status: {
          in: ["LOADING", "QUEUED"],
        },
      },
      include: {
        vehicle: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  }
}