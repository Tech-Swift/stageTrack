import { Bell } from "lucide-react";

import { useAppShellContext } from "../context/AppShellContext";

const NotificationBell = () => {
  const { unreadNotifications } =
    useAppShellContext();

  return (
    <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
      <Bell className="h-5 w-5" />

      {unreadNotifications > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
          {unreadNotifications}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;