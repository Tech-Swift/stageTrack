import express from "express";
import tenantRoutes from "./routes/tenant.routes";
import registrationRoutes from "./routes/registration.routes";
import registrationReviewRoutes from "./routes/registration-review.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import crewRoutes from "./routes/crew.routes";
import routeRoutes from "./routes/route.routes"

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/crews", crewRoutes);
app.use("/api/routes", routeRoutes);


export default app;