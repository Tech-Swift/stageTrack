import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// 1. ADDED: Import TenantBranding along with User
import type { TenantBranding, User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  branding: TenantBranding | null; // 2. ADDED: Expose branding in context
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

  // 3. ADDED: State to hold current tenant branding
  const [branding, setBranding] =
    useState<TenantBranding | null>(null);

  // 4. ADDED: Helper function to fetch branding & set CSS variables
  const loadTenantBranding = async (tenantId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tenants/${tenantId}/branding`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const brandData: TenantBranding = result.data;
        setBranding(brandData);

        // Inject brand CSS variables directly into root document
        const root = document.documentElement;
        if (brandData.primaryColor) {
          root.style.setProperty("--brand-primary", brandData.primaryColor);
        }
        if (brandData.secondaryColor) {
          root.style.setProperty("--brand-secondary", brandData.secondaryColor);
        }
        if (brandData.buttonRadius) {
          root.style.setProperty("--radius", `${brandData.buttonRadius}px`);
        }
      }
    } catch (error) {
      console.error("Failed to load tenant branding:", error);
    }
  };

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
      const parsedUser: User = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);

      // 5. ADDED: Load branding on initial page load / refresh
      if (parsedUser.tenantId) {
        loadTenantBranding(parsedUser.tenantId);
      }
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

    // 6. ADDED: Load branding immediately upon user login
    if (user.tenantId) {
      loadTenantBranding(user.tenantId);
    }
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
    setBranding(null); // 7. ADDED: Clear branding on logout
  };

  const value = useMemo(
    () => ({
      user,
      token,
      branding, // 8. ADDED to memoized value
      isAuthenticated:
        !!token && !!user,
      login,
      logout,
    }),
    [user, token, branding] // 9. ADDED branding to dependencies
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};