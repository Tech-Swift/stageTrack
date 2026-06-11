import express from "express";
import tenantRoutes from "./routes/tenant.routes";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";
import registrationRoutes from "./routes/registration.routes";
import registrationReviewRoutes from "./routes/registration-review.routes";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "StageTrack API",
  });
});

app.use("/api/tenants", tenantRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/registration-reviews", registrationReviewRoutes);
app.use("/vehicles", vehicleRoutes);

export default app;