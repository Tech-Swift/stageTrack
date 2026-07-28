import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LogOut,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import Logo from "./Logo";

import { useNavigation } from "../hooks/useNavigation";

const Sidebar = () => {
  const navigation = useNavigation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("stagetrack_token");

    queryClient.clear();

    navigate("/");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">

      <Logo />

      <nav className="flex-1 px-4 py-6">

        <ul className="space-y-2">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />

                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;