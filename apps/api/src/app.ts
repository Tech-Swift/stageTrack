import express from "express";
import cors from "cors";
import tenantRoutes from "./routes/tenant.routes";
import registrationRoutes from "./routes/registration.routes";
import registrationReviewRoutes from "./routes/registration-review.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import crewRoutes from "./routes/crew.routes";
import routeRoutes from "./routes/route.routes";
import stageRoutes from "./routes/stage.routes";
import assignmentRoutes from "./routes/assignment.routes";
import arrivalRoutes from "./routes/arrivalRoutes";
import queueRoutes from "./routes/queue.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


app.get("/api/health", (_, res) => {
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
app.use("/api/stages", stageRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/arrivals", arrivalRoutes);
app.use("/api/queue", queueRoutes);


export default app;