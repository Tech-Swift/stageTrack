import {
  createBrowserRouter,
} from "react-router-dom";

import { LandingPage } from "@/pages/LandingPage";
import RegistrationForm from "@/features/registration/RegistrationForm";

import { marshalRoutes } from "@/dashboards/marshal/routes";

export const router =
  createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/register",
      element: <RegistrationForm />,
    },

    ...marshalRoutes,
  ]);