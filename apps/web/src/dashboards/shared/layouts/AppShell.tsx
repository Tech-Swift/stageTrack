import { Outlet } from "react-router-dom";

import {
  AppShellProvider,
  useAppShellContext,
} from "../context/AppShellContext";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AppLoader from "../components/AppLoader";
import AppError from "../components/AppError";

const AppShellContent = () => {
  const {
    isLoading,
    error,
  } = useAppShellContext();

  if (isLoading) {
    return <AppLoader />;
  }

  if (error) {
    return <AppError error={error} />;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">

        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

const AppShell = () => {
  return (
    <AppShellProvider>
      <AppShellContent />
    </AppShellProvider>
  );
};

export default AppShell;