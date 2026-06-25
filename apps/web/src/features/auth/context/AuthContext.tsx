import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    token: string,
    user: User
  ) => void;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({
  children,
}: Props) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      localStorage.getItem(
        "stagetrack_token"
      );

    const storedUser =
      localStorage.getItem(
        "stagetrack_user"
      );

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (
    token: string,
    user: User
  ) => {
    localStorage.setItem(
      "stagetrack_token",
      token
    );

    localStorage.setItem(
      "stagetrack_user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(
      "stagetrack_token"
    );

    localStorage.removeItem(
      "stagetrack_user"
    );

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated:
        !!token && !!user,
      login,
      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};