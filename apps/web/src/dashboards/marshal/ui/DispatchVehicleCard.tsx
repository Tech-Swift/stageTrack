import {
  BusFront,
  MapPinned,
  Route,
  Users,
} from "lucide-react";

interface DispatchVehicleCardProps {
  plateNumber: string;
  registrationNumber?: string;

  capacity: number;

  stageName: string;

  routeName: string;

  routeOrigin: string;

  routeDestination: string;

  /**
   * Tenant Branding
   * Falls back to StageTrack blue.
   */
  primaryColor?: string;
}

export function DispatchVehicleCard({
  plateNumber,
  registrationNumber,

  capacity,

  stageName,

  routeName,

  routeOrigin,

  routeDestination,

  primaryColor,
}: DispatchVehicleCardProps) {
  const accentColor = primaryColor ?? "#2563EB";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}

      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${accentColor}20`,
            }}
          >
            <BusFront
              className="h-7 w-7"
              style={{
                color: accentColor,
              }}
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold tracking-wide">
              {plateNumber}
            </h3>

            {registrationNumber && (
              <p className="text-sm text-muted-foreground">
                Registration No. {registrationNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Information */}

      <div className="grid gap-5 p-6 md:grid-cols-3">
        {/* Capacity */}

        <div
          className="rounded-xl border p-5 transition-all"
          style={{
            borderColor: `${accentColor}30`,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Users
              className="h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <span className="font-medium">
              Capacity
            </span>
          </div>

          <p className="text-3xl font-bold">
            {capacity}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Passengers
          </p>
        </div>

        {/* Stage */}

        <div
          className="rounded-xl border p-5 transition-all"
          style={{
            borderColor: `${accentColor}30`,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <MapPinned
              className="h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <span className="font-medium">
              Dispatch Stage
            </span>
          </div>

          <p className="text-lg font-semibold">
            {stageName}
          </p>
        </div>

        {/* Route */}

        <div
          className="rounded-xl border p-5 transition-all"
          style={{
            borderColor: `${accentColor}30`,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Route
              className="h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <span className="font-medium">
              Route
            </span>
          </div>

          <p className="font-semibold">
            {routeName}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {routeOrigin} → {routeDestination}
          </p>
        </div>
      </div>
    </div>
  );
}