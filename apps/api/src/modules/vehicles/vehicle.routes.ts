import { Router } from "express";
import { VehicleController } from "./vehicle.controller";

const router = Router();
const vehicleController = new VehicleController();

router.get(
  "/search/:plateSuffix",
  vehicleController.searchVehicle.bind(vehicleController)
);

export default router;