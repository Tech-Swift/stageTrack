import {
  LayoutDashboard,
  Bus,
  Bell,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useMarshalDashboard } from "../context/MarshalDashboadContext";

const links = [
  {
    label: "Queue",
    to: "/marshal",
    icon: Bus,
  },
  {
    label: "Dashboard",
    to: "/marshal/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Notifications",
    to: "/marshal/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    to: "/marshal/profile",
    icon: User,
  },
];

export default function MarshalSidebar() {
  const { dashboard } =
    useMarshalDashboard();

  const branding =
    dashboard.branding;

  const tenantName =
    branding?.displayName ??
    dashboard.tenant?.name ??
    "StageTrack";

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color:
              branding?.primaryColor ??
              "#2563EB",
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