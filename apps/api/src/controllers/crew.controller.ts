import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthUser } from "../types/auth.types";

export const assignCrewToVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;

    const {
      vehicleId,
      driverId,
      conductorId,
      notes,
    } = req.body;

    const tenantId = user.tenantId;
    const assignedById = user.userId;

    if (!tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant is required",
      });
      return;
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, tenantId },
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
      return;
    }

    if (vehicle.status !== "ACTIVE") {
      res.status(400).json({
        success: false,
        message: "Vehicle is not active",
      });
      return;
    }

    const driver = await prisma.driver.findFirst({
      where: { id: driverId, tenantId },
    });

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver not found",
      });
      return;
    }

    if (conductorId) {
      const conductor = await prisma.conductor.findFirst({
        where: { id: conductorId, tenantId },
      });

      if (!conductor) {
        res.status(404).json({
          success: false,
          message: "Conductor not found",
        });
        return;
      }
    }

    const activeVehicleCrew = await prisma.vehicleCrew.findFirst({
      where: { vehicleId, status: "ACTIVE" },
    });

    if (activeVehicleCrew) {
      res.status(409).json({
        success: false,
        message: "Vehicle already has active crew",
      });
      return;
    }

    const activeDriverCrew = await prisma.vehicleCrew.findFirst({
      where: { driverId, status: "ACTIVE" },
    });

    if (activeDriverCrew) {
      res.status(409).json({
        success: false,
        message: "Driver already assigned",
      });
      return;
    }

      if (conductorId) {
        const activeConductorCrew =
          await prisma.vehicleCrew.findFirst({
            where: {
              conductorId,
              status: "ACTIVE",
            },
          });

        if (activeConductorCrew) {
          res.status(409).json({
            success: false,
            message: "Conductor already assigned",
          });
          return;
        }
      }

    const crew = await prisma.vehicleCrew.create({
      data: {
        tenantId,
        vehicleId,
        driverId,
        conductorId: conductorId ?? null,
        assignedById,
        notes,
        status: "ACTIVE",
      },
      include: {
        vehicle: true,
        driver: true,
        conductor: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Crew assigned successfully",
      data: crew,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign crew",
    });
  }
};

export const getVehicleCrew = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;

    if (!user.tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant is required",
      });
      return;
    }

    const vehicleId = req.params.vehicleId as string;

    const crew = await prisma.vehicleCrew.findFirst({
      where: {
        vehicleId,
        tenantId: user.tenantId,
        status: "ACTIVE",
      },
      include: {
        vehicle: true,
        driver: true,
        conductor: true,

        // ❌ removed assignedBy (doesn't exist in schema)
      },
    });

    if (!crew) {
      res.status(404).json({
        success: false,
        message: "No active crew assignment found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: crew,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle crew",
    });
  }
};

export const getAvailableDrivers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;

    const isSuperAdmin = user.role === "SUPER_ADMIN";

    if (!isSuperAdmin && !user.tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant is required",
      });
      return;
    }

    // 1. Build tenant scope (core fix)
    const tenantScope = isSuperAdmin
      ? {}
      : { tenantId: user.tenantId! };

    // 2. Get active assignments (scoped properly)
    const activeAssignments = await prisma.vehicleCrew.findMany({
      where: {
        ...tenantScope,
        status: "ACTIVE",
      },
      select: {
        driverId: true,
      },
    });

    // 3. Extract driver IDs safely
    const assignedDriverIds = activeAssignments
      .map((a) => a.driverId)
      .filter((id): id is string => id !== null);

    // 4. Get available drivers
    const availableDrivers = await prisma.driver.findMany({
      where: {
        ...tenantScope,
        id: assignedDriverIds.length
          ? { notIn: assignedDriverIds }
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: availableDrivers.length,
      data: availableDrivers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available drivers",
    });
  }
};

export const getAvailableConductors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;

    const isSuperAdmin = user.role === "SUPER_ADMIN";

    if (!isSuperAdmin && !user.tenantId) {
      res.status(400).json({
        success: false,
        message: "Tenant is required",
      });
      return;
    }

    // 1. Tenant scope
    const tenantScope = isSuperAdmin
      ? {}
      : { tenantId: user.tenantId! };

    // 2. Get active conductor assignments
    const activeAssignments = await prisma.vehicleCrew.findMany({
      where: {
        ...tenantScope,
        status: "ACTIVE",
      },
      select: {
        conductorId: true,
      },
    });

    // 3. Extract valid conductor IDs
    const assignedConductorIds = activeAssignments
      .map((a) => a.conductorId)
      .filter((id): id is string => id !== null);

    // 4. Fetch available conductors
    const availableConductors = await prisma.conductor.findMany({
      where: {
        ...tenantScope,
        id: assignedConductorIds.length
          ? { notIn: assignedConductorIds }
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: availableConductors.length,
      data: availableConductors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available conductors",
    });
  }
};

export const deactivateCrew = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as AuthUser;
    const crewId = req.params.crewId as string;

    const crew = await prisma.vehicleCrew.findUnique({
      where: { id: crewId },
    });

    if (!crew) {
      res.status(404).json({
        success: false,
        message: "Crew not found",
      });
      return;
    }

    if (crew.status !== "ACTIVE") {
      res.status(400).json({
        success: false,
        message: "Crew already inactive",
      });
      return;
    }

    const updated = await prisma.vehicleCrew.update({
      where: { id: crewId },
      data: {
        status: "INACTIVE",
        endedAt: new Date(),
        endedById: user.userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Crew ended successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to end crew",
    });
  }
};