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
  const primaryColor =
    branding.primaryColor ?? "#2563eb";

  return (
    <div
      className="relative overflow-hidden rounded-t-xl border-b bg-gradient-to-b from-white to-slate-50"
      style={{
        borderTop: `5px solid ${primaryColor}`,
      }}
    >
      <div className="flex flex-col items-center px-6 py-8 text-center">

        {/* Logo */}

        {branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={branding.displayName}
            className="mb-4 h-20 w-20 rounded-full border-2 bg-white object-cover shadow-md"
            style={{
              borderColor: primaryColor,
            }}
          />
        ) : (
          <div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border shadow-sm"
            style={{
              backgroundColor: `${primaryColor}15`,
              borderColor: primaryColor,
            }}
          >
            <Building2
              className="h-10 w-10"
              style={{
                color: primaryColor,
              }}
            />
          </div>
        )}

        {/* Tenant Name */}

        <h2
          className="text-2xl font-bold tracking-tight"
          style={{
            color: primaryColor,
          }}
        >
          {branding.displayName}
        </h2>

        {/* Module */}

        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Vehicle Dispatch
        </p>

        {/* Route */}

        <div
          className="mt-6 flex items-center gap-2 rounded-full px-5 py-2"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          <Route
            className="h-4 w-4"
            style={{
              color: primaryColor,
            }}
          />

          <span className="text-sm font-semibold">
            {route.origin}

            <span className="mx-2 opacity-60">
              →
            </span>

            {route.destination}
          </span>
        </div>

        {/* Stage */}

        <div className="mt-4 flex items-center gap-2">
          <MapPin
            className="h-4 w-4"
            style={{
              color: primaryColor,
            }}
          />

          <span
            className="text-sm font-medium"
            style={{
              color: primaryColor,
            }}
          >
            {stage.name}
          </span>
        </div>
      </div>
    </div>
  );
}