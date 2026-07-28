import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useAppShell } from "../hooks/useAppShell";

import type {
  AppShellBranding,
  AppShellTenant,
  AppShellUser,
} from "../types/appShell";

interface AppShellContextValue {
  user: AppShellUser | undefined;
  tenant: AppShellTenant | null | undefined;
  branding: AppShellBranding | undefined;
  unreadNotifications: number;

  isLoading: boolean;
  error: Error | null;

  refetch: () => void;
}

const AppShellContext =
  createContext<AppShellContextValue | null>(
    null
  );

interface AppShellProviderProps {
  children: ReactNode;
}

export const AppShellProvider = ({
  children,
}: AppShellProviderProps) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useAppShell();

  return (
    <AppShellContext.Provider
      value={{
        user: data?.user,
        tenant: data?.tenant,
        branding: data?.branding,
        unreadNotifications:
          data?.unreadNotifications ?? 0,

        isLoading,
        error: error as Error | null,

        refetch,
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
};

export const useAppShellContext = () => {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error(
      "useAppShellContext must be used within AppShellProvider."
    );
  }

  return context;
};