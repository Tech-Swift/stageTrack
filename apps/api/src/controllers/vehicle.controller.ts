import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const registerVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const { registrationNumber, plateNumber, capacity } = req.body;

    // 1. Ensure user is vehicle owner
    const owner = await prisma.vehicleOwner.findUnique({
      where: { userId },
    });

    if (!owner) {
      return res.status(403).json({
        success: false,
        message: "Only vehicle owners can register vehicles",
      });
    }

    // 2. Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        tenantId: owner.tenantId,
        ownerId: owner.id,
        registrationNumber,
        plateNumber,
        capacity,
        status: "PENDING_APPROVAL",
      },
    });

    res.status(201).json({
      success: true,
      message: "Vehicle submitted for approval",
      data: vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Vehicle registration failed",
    });
  }
};

export const approveVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
    const { inspectionDate, inspectionNotes } = req.body;
    const user = req.user!;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // tenant isolation
    if (
      vehicle.tenantId !== user.tenantId &&
      user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed for this tenant",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: "INSPECTION_SCHEDULED",
        inspectionDate: inspectionDate
          ? new Date(inspectionDate)
          : null,
        inspectionNotes,
        inspectionById: user.userId,
        approvedById: user.userId,
        approvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Inspection scheduled successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Inspection scheduling failed",
    });
  }
};