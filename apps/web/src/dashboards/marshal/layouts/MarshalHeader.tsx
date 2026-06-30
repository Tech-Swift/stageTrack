import { useMarshalDashboard } from "../context/MarshalDashboadContext";

export default function MarshalHeader() {
  const { dashboard } = useMarshalDashboard();

  const branding = dashboard.branding;

  const tenantName =
    branding?.displayName ??
    dashboard.tenant?.name ??
    "StageTrack";

  const stage =
    dashboard.activeAssignment?.stage ??
    dashboard.lastAssignment?.stage;

  const isOnline =
    dashboard.status === "ON_DUTY";

  return (
    <header className="border-b bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{
              color:
                branding?.primaryColor ??
                "#2563EB",
            }}
          >
            {tenantName}
          </h1>

          <p className="text-sm text-gray-500">
            {stage?.name ??
              "No Stage Assigned"}
          </p>
        </div>

        <div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isOnline
              ? "🟢 Online"
              : "🔴 Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}