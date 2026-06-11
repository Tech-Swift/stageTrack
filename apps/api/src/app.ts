import express from "express";
import tenantRoutes from "./routes/tenant.routes";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "StageTrack API",
  });
});

app.use("/api/tenants", tenantRoutes);
app.use("/vehicles", vehicleRoutes);

export default app;