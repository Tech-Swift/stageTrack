import {
  Bus,
  Users,
  Route,
  Wallet,
  Receipt,
  Coins,
} from "lucide-react";

interface DispatchSummaryProps {
  plateNumber: string;
  stageName: string;
  routeName: string;

  capacity: number;

  expectedRevenue: number;
  platformFee: number;
  saccoFee: number;
  totalPayable: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DispatchSummary({
  plateNumber,
  stageName,
  routeName,
  capacity,
  expectedRevenue,
  platformFee,
  saccoFee,
  totalPayable,
}: DispatchSummaryProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* Header */}
      <div className="border-b px-5 py-4">
        <h3 className="text-lg font-semibold">
          Dispatch Summary
        </h3>

        <p className="text-sm text-muted-foreground">
          Verify the vehicle information before dispatching.
        </p>
      </div>

      {/* Compact information cards */}
      <div className="grid grid-cols-2 gap-3 p-5">

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Bus className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Vehicle
            </span>
          </div>

          <p className="font-semibold">
            {plateNumber}
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Capacity
            </span>
          </div>

          <p className="font-semibold">
            {capacity} Seats
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Route
            </span>
          </div>

          <p className="font-semibold truncate">
            {routeName}
          </p>

          <p className="text-xs text-muted-foreground">
            {stageName}
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Expected Revenue
            </span>
          </div>

          <p className="font-semibold">
            {formatCurrency(expectedRevenue)}
          </p>
        </div>

      </div>

      {/* Charges */}
      <div className="border-t bg-slate-50 px-5 py-4">

        <div className="space-y-2 text-sm">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span>Platform Fee</span>
            </div>

            <span className="font-medium">
              {formatCurrency(platformFee)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <span>SACCO Fee</span>
            </div>

            <span className="font-medium">
              {formatCurrency(saccoFee)}
            </span>
          </div>

        </div>

        {/* Total */}
        <div className="mt-4 rounded-xl border bg-white p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Cash to Collect
              </p>

              <p className="text-xs text-muted-foreground">
                Amount expected from this dispatch
              </p>
            </div>

            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalPayable)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}