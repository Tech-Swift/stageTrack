import { createBrowserRouter } from "react-router-dom";

import { LandingPage } from "@/pages/LandingPage";
import RegistrationForm from "@/features/registration/RegistrationForm";
import { marshalRoutes } from "@/dashboards/marshal/routes";

import AppShell from "@/dashboards/shared/layouts/AppShell";

const PlaceholderPage = ({
  title,
}: {
  title: string;
}) => (
  <div className="rounded-xl border bg-card p-8">
    <h1 className="text-3xl font-bold">{title}</h1>

    <p className="mt-2 text-muted-foreground">
      AppShell loaded successfully.
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },

  {
    path: "/:tenantCode",
    element: <AppShell />,
    children: [
      {
        path: "admin",
        element: (
          <PlaceholderPage title="SACCO Admin Dashboard" />
        ),
      },
      {
        path: "director",
        element: (
          <PlaceholderPage title="Director Dashboard" />
        ),
      },
      {
        path: "manager",
        element: (
          <PlaceholderPage title="Manager Dashboard" />
        ),
      },
      {
        path: "driver",
        element: (
          <PlaceholderPage title="Driver Dashboard" />
        ),
      },
      {
        path: "conductor",
        element: (
          <PlaceholderPage title="Conductor Dashboard" />
        ),
      },
      {
        path: "owner",
        element: (
          <PlaceholderPage title="Vehicle Owner Dashboard" />
        ),
      },
      {
        path: "super-admin",
        element: (
          <PlaceholderPage title="Super Admin Dashboard" />
        ),
      },
    ],
  },

  // Keep the existing marshal dashboard untouched
  ...marshalRoutes,
]);