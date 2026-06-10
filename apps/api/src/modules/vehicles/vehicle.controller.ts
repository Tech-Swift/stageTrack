import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

const vehicleService = new VehicleService();

export class VehicleController {
  async searchVehicle(req: Request, res: Response) {
    try {
      const { plateSuffix } = req.params;

        if (Array.isArray(plateSuffix)) {
        return res.status(400).json({
            success: false,
            message: "Invalid plate suffix",
        });
        }

      const vehicle = await vehicleService.findByPlateSuffix(
        plateSuffix
      );

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}