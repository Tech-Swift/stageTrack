import { Prisma } from "@prisma/client";
import { AssignCrewToVehicleDto } from "../validators/crew.validator";

export async function createVehicleCrew(
  tx: Prisma.TransactionClient,
  input: AssignCrewToVehicleDto
) {
  const {
    tenantId,
    vehicleId,
    driverId,
    conductorId,
    assignedById,
    notes,
  } = input;

  // 1. Verify vehicle exists + belongs to tenant
  const vehicle = await tx.vehicle.findFirst({
    where: {
      id: vehicleId,
      tenantId,
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.status !== "ACTIVE") {
    throw new Error("Vehicle is not active");
  }

  // 2. Verify driver exists + tenant match
  const driver = await tx.driver.findFirst({
    where: {
      id: driverId,
      tenantId,
    },
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  // 3. Verify conductor exists (if provided)
  let conductor = null;

  if (conductorId) {
    conductor = await tx.conductor.findFirst({
      where: {
        id: conductorId,
        tenantId,
      },
    });

    if (!conductor) {
      throw new Error("Conductor not found");
    }
  }

  // 4. Ensure vehicle has no ACTIVE crew
  const activeVehicleCrew = await tx.vehicleCrew.findFirst({
    where: {
      vehicleId,
      status: "ACTIVE",
    },
  });

  if (activeVehicleCrew) {
    throw new Error("Vehicle already has an active crew assignment");
  }

  // 5. Ensure driver has no ACTIVE assignment
  const activeDriverCrew = await tx.vehicleCrew.findFirst({
    where: {
      driverId,
      status: "ACTIVE",
    },
  });

  if (activeDriverCrew) {
    throw new Error("Driver already assigned to another vehicle");
  }

  // 6. Ensure conductor has no ACTIVE assignment (if provided)
  if (conductorId) {
    const activeConductorCrew = await tx.vehicleCrew.findFirst({
      where: {
        conductorId,
        status: "ACTIVE",
      },
    });

    if (activeConductorCrew) {
      throw new Error("Conductor already assigned to another vehicle");
    }
  }

  // 7. Create VehicleCrew
  const crew = await tx.vehicleCrew.create({
    data: {
      tenantId,
      vehicleId,
      driverId,
      conductorId: conductorId ?? null,
      assignedById,
      notes,
      status: "ACTIVE",
      assignedAt: new Date(),
    },
    include: {
      vehicle: true,
      driver: true,
      conductor: true,
    },
  });

  return crew;
}
