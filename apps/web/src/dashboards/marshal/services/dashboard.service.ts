import {api} from "@/lib/api";
import type { DashboardData } from "../types/dashboard";

export const getMarshalDashboard =
  async (): Promise<DashboardData> => {
    const response =
      await api.get("/dashboard/marshal");

    return response.data.data;
  };