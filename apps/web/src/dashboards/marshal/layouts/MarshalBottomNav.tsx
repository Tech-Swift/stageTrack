import {
  Bus,
  Bell,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function MarshalBottomNav() {
  return (
    <div className="border-t bg-white">
      <div className="grid grid-cols-3">
        <NavLink
          to="/marshal"
          className="flex flex-col items-center py-3"
        >
          <Bus size={22} />
          <span className="text-xs">
            Queue
          </span>
        </NavLink>

        <NavLink
          to="/marshal/notifications"
          className="flex flex-col items-center py-3"
        >
          <Bell size={22} />
          <span className="text-xs">
            Alerts
          </span>
        </NavLink>

        <NavLink
          to="/marshal/profile"
          className="flex flex-col items-center py-3"
        >
          <User size={22} />
          <span className="text-xs">
            Profile
          </span>
        </NavLink>
      </div>
    </div>
  );
}