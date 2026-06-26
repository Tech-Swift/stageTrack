import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { RouterProvider } from "react-router-dom";

import "./index.css";

import { ThemeProvider } from "./components/layout/theme-provider";
import { AuthProvider } from "./features/auth/context/AuthContext";

import { router } from "./routes";
import { queryClient } from "./lib/queryClient";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="light"
      storageKey="vite-ui-theme"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />

          <ReactQueryDevtools
            initialIsOpen={false}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);