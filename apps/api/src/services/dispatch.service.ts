import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { QueueService } from "./queue.service";
import { CreateDispatchRequest } from "../types/dispatch.types";
import { calculateDispatchCharges } from "../utils/dispatch-calculator";


export class DispatchService {
  static async createDispatch(
    payload: CreateDispatchRequest,
    userId: string
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      /**
       * STEP 1
       * Validate authenticated user
       */
      const user = await tx.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            tenantId: true,
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
            "You are not authorized to dispatch vehicles."
        );
        }
            /**
       * STEP 2
       * Load queue entry
       */

      const queueEntry = await tx.stageQueue.findUnique({
        where: {
            id: payload.queueId,
        },
        include: {
            vehicle: {
            include: {
                owner: true,
            },
            },
            arrival: true,
            stage: {
            include: {
                route: true,
            },
            },
        },
        });

      if (!queueEntry) {
        throw new Error("Queue entry not found.");
      }

      /**
       * STEP 3
       * Ensure vehicle is ready for dispatch
       */
      if (queueEntry.status !== "READY_TO_DISPATCH") {
        throw new Error(
          "Vehicle is not ready for dispatch."
        );
      }

      /**
       * STEP 4
       * Validate vehicle
       */
      if (!queueEntry.vehicle) {
        throw new Error("Vehicle not found.");
      }

      if (queueEntry.vehicle.status !== "ACTIVE") {
        throw new Error(
          "Vehicle is not active."
        );
      }

      /**
       * STEP 5
       * Validate capacity
       */
      if (!queueEntry.vehicle.capacity) {
        throw new Error(
          "Vehicle capacity has not been configured."
        );
      }

      /**
       * STEP 6
       * Validate stage route
       */
      if (!queueEntry.stage.route) {
        throw new Error(
          "Stage route not found."
        );
      }

      // Step 7
      // Calculate expected revenue
        const busFare = Number(payload.busFare);
        const saccoFee = Number(payload.saccoFee ?? 0);

        if (Number.isNaN(busFare) || busFare <= 0) {
        throw new Error("Bus fare must be greater than zero.");
        }

        if (Number.isNaN(saccoFee) || saccoFee < 0) {
        throw new Error("Invalid SACCO fee.");
        }

        const charges = calculateDispatchCharges({
        capacity: queueEntry.vehicle.capacity,
        busFare,
        saccoFee,
        });
      // Step 8
      // Calculate platform fee

      // Step 9
      // Create dispatch
      const dispatch = await tx.dispatch.create({
        data: {
            tenantId: user.tenantId!,

            vehicleId: queueEntry.vehicle.id,

            arrivalId: queueEntry.arrival.id,

            queueId: queueEntry.id,

            stageId: queueEntry.stage.id,

            routeId: queueEntry.stage.route.id,

            marshalId: user.id,

            capacity: queueEntry.vehicle.capacity,

            busFare,

            expectedRevenue: charges.expectedRevenue,

            saccoFee,

            remarks: payload.remarks,
        },

        include: {
            vehicle: true,
            stage: true,
            route: true,
        },
        });
    const platformCharge =
        await tx.platformCharge.create({
            data: {
            tenantId: user.tenantId!,

            dispatchId: dispatch.id,

            expectedRevenue:
                charges.expectedRevenue,

            commissionRate:
                charges.platformRate,

            amount:
                charges.platformFee,
            },
        });
      // Step 10
      // Update queue
      await tx.stageQueue.update({
        where: {
            id: queueEntry.id,
        },
        data: {
            status: "DISPATCHED",
            dispatchedAt: new Date(),
            position: null,
        },
        });
      // Step 11
      // Update arrival

      // Step 12
      // Promote next vehicle
        await QueueService.promoteNextVehicle(
        tx,
        queueEntry.stageId
        );
      // Step 13
      // Recalculate queue
      await QueueService.recalculateQueuePositions(
        tx,
        queueEntry.stageId
        );
      // Step 14
      // Return dispatch
      return {
        message: "Vehicle dispatched successfully.",

        dispatch,
        platformCharge,
        charges,
        };
    });
  }
}