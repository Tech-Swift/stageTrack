import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { VehicleStatus } from "@prisma/client";

export const registerVehicle = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const { tenantId: bodyTenantId, registrationNumber, plateNumber, capacity, ownerUserId } = req.body;

    // 1. Resolve tenant context
    const tenantId =
      role === "SUPER_ADMIN"
        ? bodyTenantId
        : req.user!.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant context is required",
      });
    }

    // 2. Resolve VehicleOwner (MANDATORY because ownerId is REQUIRED in schema)
    let owner;

    if (role === "SUPER_ADMIN") {
      // SUPER_ADMIN must explicitly specify whose vehicle this is
      if (!ownerUserId) {
        return res.status(400).json({
          success: false,
          message: "ownerUserId is required for super admin vehicle creation",
        });
      }

      owner = await prisma.vehicleOwner.findUnique({
        where: { userId: ownerUserId },
      });
    } else {
      owner = await prisma.vehicleOwner.findUnique({
        where: { userId },
      });
    }

    if (!owner) {
      return res.status(403).json({
        success: false,
        message: "Vehicle owner not found",
      });
    }

    // 3. Prevent duplicates
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { plateNumber },
          { registrationNumber },
        ],
      },
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already exists with same plate or registration number",
      });
    }

    // 4. Create vehicle (NO NULLS EVER)
    const vehicle = await prisma.vehicle.create({
      data: {
        tenantId,
        ownerId: owner.id, // ALWAYS REQUIRED
        registrationNumber,
        plateNumber,
        capacity: capacity ? Number(capacity) : null,
        status: "PENDING_APPROVAL",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle submitted for approval",
      data: vehicle,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Vehicle registration failed",
    });
  }
};

export const scheduleInspection = async (req: Request, res: Response) => {
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
    if (vehicle.tenantId !== user.tenantId && user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not allowed for this tenant",
      });
    }

    if (vehicle.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        success: false,
        message: "Vehicle not in pending state",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.INSPECTION_SCHEDULED,
        inspectionDate: inspectionDate ? new Date(inspectionDate) : null,
        inspectionNotes,
        inspectionById: user.userId,
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
      message: "Failed to schedule inspection",
    });
  }
};

export const markInspected = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
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

    if (vehicle.status !== "INSPECTION_SCHEDULED") {
      return res.status(400).json({
        success: false,
        message: "Inspection not scheduled",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.INSPECTED,
      },
    });

    res.json({
      success: true,
      message: "Vehicle marked as inspected",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to mark inspected",
    });
  }
};

export const approveVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
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

    if (vehicle.status !== "INSPECTED") {
      return res.status(400).json({
        success: false,
        message: "Vehicle must be inspected first",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.APPROVED,
        approvedById: user.userId,
        approvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Vehicle approved",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const activateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
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

    if (vehicle.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Vehicle must be approved first",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.ACTIVE,
      },
    });

    res.json({
      success: true,
      message: "Vehicle activated",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Activation failed",
    });
  }
};

export const suspendVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicleId = String(req.params.id);
    const { reason } = req.body;
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
      user.role !== "SUPER_ADMIN" &&
      vehicle.tenantId !== user.tenantId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed for this tenant",
      });
    }

    if (vehicle.status !== VehicleStatus.ACTIVE) {
      return res.status(400).json({
        success: false,
        message: "Only active vehicles can be suspended",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.SUSPENDED,
        suspendedById: user.userId,
        suspendedAt: new Date(),
        suspensionReason: reason,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle suspended successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Vehicle suspension failed",
    });
  }
};

export const reactivateVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicleId = String(req.params.id);
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

    if (
      user.role !== "SUPER_ADMIN" &&
      vehicle.tenantId !== user.tenantId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed for this tenant",
      });
    }

    if (vehicle.status !== VehicleStatus.SUSPENDED) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not suspended",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.ACTIVE,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle reactivated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Vehicle reactivation failed",
    });
  }
};

export const rejectVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
    const { reason } = req.body;
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

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.REJECTED,
        rejectionReason: reason,
        approvedById: user.userId,
        approvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Vehicle rejected",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { status, tenantCode } = req.query;

    const whereClause: any = {};

    // status filter
    if (status) {
      whereClause.status = status;
    }

    // SUPER ADMIN can filter by tenantCode
    if (user.role === "SUPER_ADMIN" && tenantCode) {
      const tenant = await prisma.tenant.findUnique({
        where: { code: String(tenantCode) },
      });

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found",
        });
      }

      whereClause.tenantId = tenant.id;
    }

    // ALL OTHER USERS are locked to their tenant
    if (user.role !== "SUPER_ADMIN") {
      if (!user.tenantId) {
        return res.status(403).json({
          success: false,
          message: "No tenant context",
        });
      }

      whereClause.tenantId = user.tenantId;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        owner: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.id);
    const user = req.user!;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        owner: true,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.tenantId !== user.tenantId &&
      user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed for this tenant",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
};