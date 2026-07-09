import { Building2, MapPin, Route } from "lucide-react";
import type { TenantBranding } from "../types/dashboard";

interface DispatchHeaderProps {
  branding: TenantBranding;

  stage: {
    name: string;
  };

  route: {
    name: string;
    origin: string;
    destination: string;
  };
}

export default function DispatchHeader({
  branding,
  stage,
  route,
}: DispatchHeaderProps) {
  return (
    <div
      className="relative overflow-hidden rounded-t-xl border-b bg-background"
      style={{
        borderTop: `5px solid ${
          branding.primaryColor ?? "#2563eb"
        }`,
      }}
    >
      <div className="flex flex-col items-center px-6 py-8 text-center">

        {/* SACCO LOGO */}

        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={branding.displayName}
            className="mb-4 h-20 w-20 rounded-full border-2 bg-white object-cover shadow-md"
          />
        ) : (
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border bg-muted shadow-sm">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* SACCO NAME */}

        <h2 className="text-2xl font-bold tracking-tight">
          {branding.displayName}
        </h2>

        {/* MODULE */}

        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Vehicle Dispatch
        </p>

        {/* ROUTE */}

        <div className="mt-6 flex items-center gap-2 rounded-full bg-muted px-4 py-2">

          <Route className="h-4 w-4" />

          <span className="text-sm font-medium">

            {route.origin}

            <span className="mx-2 text-muted-foreground">
              →
            </span>

            {route.destination}

          </span>

        </div>

        {/* STAGE */}

        <div className="mt-3 flex items-center gap-2">

          <MapPin className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">

            {stage.name}

          </span>

        </div>

      </div>
    </div>
  );
}