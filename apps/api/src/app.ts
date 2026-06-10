import express from "express";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "StageTrack API",
  });
});

app.use("/vehicles", vehicleRoutes);

export default app;