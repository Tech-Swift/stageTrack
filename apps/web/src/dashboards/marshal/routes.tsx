import type { RouteObject } from "react-router-dom";

import MarshalLayout from "./layouts/MarshalLayout";
import Queue from "./pages/Queue";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

export const marshalRoutes: RouteObject[] = [
  {
    path: "/:tenantCode/marshal",
    element: <MarshalLayout />,
    children: [
      {
        index: true,
        element: <Queue />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];