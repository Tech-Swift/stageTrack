import { api } from "@/lib/api";

import type {
  AppShellData,
  AppShellResponse,
} from "../types/appShell";

export const getAppShell = async (): Promise<AppShellData> => {
  const response =
    await api.get<AppShellResponse>(
      "/app-shell"
    );

  return response.data.data;
};