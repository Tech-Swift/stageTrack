import { createBrowserRouter } from "react-router-dom";

import { LandingPage } from "@/pages/LandingPage";
import RegistrationForm from "@/features/registration/RegistrationForm";
import { marshalRoutes } from "@/dashboards/marshal/routes";

// Import our new AppShell
import { AppShell } from "@/dashboards/shared/layouts/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },

  // --- NEW TENANT WRAPPER ---
  {
    path: "/:tenantCode", // Matches the "FT017" part of your URL
    element: <AppShell />,
    children: [
      {
        path: "admin", // Matches the "/admin" part of your URL
        element: (
          <div className="p-8 text-center border-2 border-dashed border-brand-primary rounded-lg bg-card text-card-foreground">
            <h2 className="text-2xl font-bold mb-2">App Shell is Live for SACCO Admin!</h2>
            <p className="text-muted-foreground">
              You were successfully redirected here. The Global colors and Sidebar should now be visible.
            </p>
          </div>
        ),
      },
      {
        path: "manager", // Matches /FT017/manager
        element: <div>Manager Content goes here</div>,
      }
    ],
  },

  // --- LEGACY MARSHAL ROUTES (Untouched) ---
  ...marshalRoutes,
]);