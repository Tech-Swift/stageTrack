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

      <div className="border-b px-6 py-4">

        <h3 className="text-lg font-semibold">
          Dispatch Summary
        </h3>

        <p className="text-sm text-muted-foreground">
          Review the vehicle and payment details before
          confirming dispatch.
        </p>

      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Bus className="h-8 w-8 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Vehicle
            </p>

            <p className="font-semibold">
              {plateNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Route className="h-8 w-8 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Route
            </p>

            <p className="font-semibold">
              {routeName}
            </p>

            <p className="text-sm text-muted-foreground">
              {stageName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Users className="h-8 w-8 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Capacity
            </p>

            <p className="font-semibold">
              {capacity} Passengers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Wallet className="h-8 w-8 text-primary" />

          <div>
            <p className="text-xs text-muted-foreground">
              Expected Revenue
            </p>

            <p className="font-semibold">
              {formatCurrency(expectedRevenue)}
            </p>
          </div>
        </div>

      </div>

      <div className="border-t bg-slate-50 p-6">

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Coins className="h-4 w-4" />

              <span>StageTrack Platform Fee</span>

            </div>

            <span className="font-medium">
              {formatCurrency(platformFee)}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Receipt className="h-4 w-4" />

              <span>SACCO Fee</span>

            </div>

            <span className="font-medium">
              {formatCurrency(saccoFee)}
            </span>

          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border bg-white p-4">

            <span className="text-base font-semibold">
              Total Cash to Collect
            </span>

            <span className="text-xl font-bold text-primary">
              {formatCurrency(totalPayable)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}