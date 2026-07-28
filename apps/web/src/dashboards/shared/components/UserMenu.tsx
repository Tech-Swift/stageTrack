import { useNavigate } from "react-router-dom";

import {
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import { useAppShellContext } from "../context/AppShellContext";

const UserMenu = () => {
  const { user } = useAppShellContext();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("stagetrack_token");

    queryClient.clear();

    navigate("/");
  };

  return (
    <div className="flex items-center gap-4">

      <div className="text-right">

        <h4 className="font-medium">
          {user?.name}
        </h4>

        <p className="text-xs text-muted-foreground">
          {user?.role.replaceAll("_", " ")}
        </p>

      </div>

      <div className="flex gap-2">

        <button className="rounded-lg p-2 hover:bg-muted">
          <User className="h-5 w-5" />
        </button>

        <button className="rounded-lg p-2 hover:bg-muted">
          <Settings className="h-5 w-5" />
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
        </button>

      </div>

    </div>
  );
};

export default UserMenu;