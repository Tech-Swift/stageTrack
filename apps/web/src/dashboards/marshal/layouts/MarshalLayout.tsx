import { Outlet } from "react-router-dom";

import { useDashboard } from "../hooks/useDashboard";
import MarshalDashboardContext from "../context/MarshalDashboadContext";

import MarshalHeader from "./MarshalHeader";
import MarshalSidebar from "./MarshalSidebar";
import MarshalBottomNav from "./MarshalBottomNav";

export default function MarshalLayout() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <MarshalDashboardContext.Provider
      value={{ dashboard: data }}
    >
      <div className="flex h-screen bg-slate-50">
        <div className="hidden lg:block">
          <MarshalSidebar />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <MarshalHeader />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>

          <div className="lg:hidden">
            <MarshalBottomNav />
          </div>
        </div>
      </div>
    </MarshalDashboardContext.Provider>
  );
}