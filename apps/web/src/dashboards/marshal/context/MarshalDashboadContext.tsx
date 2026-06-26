import {
  createContext,
  useContext,
} from "react";

import type { DashboardData } from "../types/dashboard";

interface ContextValue {
  dashboard: DashboardData;
}

const MarshalDashboardContext =
  createContext<ContextValue | null>(null);

export const useMarshalDashboard =
  () => {
    const context = useContext(
      MarshalDashboardContext
    );

    if (!context) {
      throw new Error(
        "useMarshalDashboard must be used inside provider"
      );
    }

    return context;
  };

export default MarshalDashboardContext;