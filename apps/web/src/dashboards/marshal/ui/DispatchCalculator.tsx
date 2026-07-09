import {
  Calculator,
  CreditCard,
  Users,
  Wallet,
} from "lucide-react";

import { formatCurrency } from "@/lib/currency";

interface DispatchCalculationCardProps {
  capacity: number;

  busFare: number;

  expectedRevenue: number;

  platformRate: number;

  platformFee: number;

  saccoFee: number;

  totalPayable: number;

  primaryColor?: string;
}

export function DispatchCalculationCard({
  capacity,
  busFare,
  expectedRevenue,
  platformRate,
  platformFee,
  saccoFee,
  totalPayable,
  primaryColor,
}: DispatchCalculationCardProps) {
  const accentColor =
    primaryColor ?? "#2563EB";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* Header */}

      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Calculator
            className="h-5 w-5"
            style={{
              color: accentColor,
            }}
          />

          <div>
            <h3 className="font-semibold text-lg">
              Dispatch Summary
            </h3>

            <p className="text-sm text-muted-foreground">
              Calculated automatically before dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Calculations */}

      <div className="space-y-4 p-6">

        <CalculationRow
          icon={
            <Users
              className="h-4 w-4"
              style={{ color: accentColor }}
            />
          }
          label="Vehicle Capacity"
          value={`${capacity} Passengers`}
        />

        <CalculationRow
          icon={
            <Wallet
              className="h-4 w-4"
              style={{ color: accentColor }}
            />
          }
          label="Passenger Fare"
          value={formatCurrency(busFare)}
        />

        <CalculationRow
          label="Expected Revenue"
          value={formatCurrency(expectedRevenue)}
          strong
        />

        <CalculationRow
          label={`Platform Fee (${platformRate}%)`}
          value={formatCurrency(platformFee)}
        />

        <CalculationRow
          label="SACCO Fee"
          value={formatCurrency(saccoFee)}
        />

        <div className="border-t pt-5">

          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: `${accentColor}10`,
            }}
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Amount to Collect
                </p>

                <p className="text-2xl font-bold">
                  {formatCurrency(totalPayable)}
                </p>
              </div>

              <CreditCard
                className="h-9 w-9"
                style={{
                  color: accentColor,
                }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

interface CalculationRowProps {
  label: string;

  value: string;

  icon?: React.ReactNode;

  strong?: boolean;
}

function CalculationRow({
  label,
  value,
  icon,
  strong = false,
}: CalculationRowProps) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">
        {icon}

        <span
          className={
            strong
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          {label}
        </span>
      </div>

      <span
        className={
          strong
            ? "font-semibold text-lg"
            : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}