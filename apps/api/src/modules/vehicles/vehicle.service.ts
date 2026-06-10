import { prisma } from "../../lib/prisma";

export class VehicleService {
    async findByPlateSuffix(plateSuffix: string){
        return prisma.vehicle.findFirst({
            where: {
                plateSuffix: plateSuffix.toUpperCase(),
                isActive: true,
            },
            include: {
                vehicleOwner: true,
            },
        });
    }
}