import {
  LayoutDashboard,
  Bus,
  Bell,
  User,
} from "lucide-react";

import { NavLink, useParams } from "react-router-dom";
import { useMarshalDashboard } from "../context/MarshalDashboadContext";

export default function MarshalSidebar() {
  const { dashboard } = useMarshalDashboard();
  const { tenantCode } = useParams();

  const branding = dashboard.branding;

  const tenantName =
    branding?.displayName ??
    dashboard.tenant?.name ??
    "StageTrack";

  const base = `/${tenantCode}/marshal`;

  const links = [
    {
      label: "Queue",
      to: base,
      icon: Bus,
    },
    {
      label: "Dashboard",
      to: `${base}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: "Notifications",
      to: `${base}/notifications`,
      icon: Bell,
    },
    {
      label: "Profile",
      to: `${base}/profile`,
      icon: User,
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color: branding?.primaryColor ?? "#2563EB",
          }}
        >
          {tenantName}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Stage Marshal
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl p-3 transition ${
                    isActive
                      ? "bg-slate-100 font-semibold"
                      : "hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={20} />
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}