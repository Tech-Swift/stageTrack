import { DollarSign, FileText, Receipt } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DispatchFareFormProps {
  busFare: number | "";

  saccoFee: number | "";

  remarks: string;

  primaryColor?: string;

  onBusFareChange: (
    value: number | ""
  ) => void;

  onSaccoFeeChange: (
    value: number | ""
  ) => void;

  onRemarksChange: (
    value: string
  ) => void;
}

export function DispatchFareForm({
  busFare,
  saccoFee,
  remarks,

  primaryColor,

  onBusFareChange,
  onSaccoFeeChange,
  onRemarksChange,
}: DispatchFareFormProps) {
  const accentColor =
    primaryColor ?? "#2563EB";

  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">

        <h3 className="text-lg font-semibold">

          Dispatch Information

        </h3>

        <p className="text-sm text-muted-foreground">

          Enter the fare charged for this trip.

        </p>

      </div>

      <div className="space-y-6 p-6">

        {/* Bus Fare */}

        <div className="space-y-2">

          <Label>

            Passenger Fare *

          </Label>

          <div className="relative">

            <DollarSign
              className="absolute left-3 top-3 h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <Input
              type="number"
              min={1}
              placeholder="Example: 250"
              className="pl-10"

              value={busFare}

              onChange={(e) =>
                onBusFareChange(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
            />

          </div>

        </div>

        {/* Sacco Fee */}

        <div className="space-y-2">

          <Label>

            Additional SACCO Fee

          </Label>

          <div className="relative">

            <Receipt
              className="absolute left-3 top-3 h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <Input
              type="number"

              min={0}

              placeholder="Optional"

              className="pl-10"

              value={saccoFee}

              onChange={(e) =>
                onSaccoFeeChange(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
            />

          </div>

        </div>

        {/* Remarks */}

        <div className="space-y-2">

          <Label>

            Remarks

          </Label>

          <div className="relative">

            <FileText
              className="absolute left-3 top-3 h-4 w-4"
              style={{
                color: accentColor,
              }}
            />

            <Textarea
              rows={4}

              placeholder="Optional remarks..."

              className="pl-10"

              value={remarks}

              onChange={(e) =>
                onRemarksChange(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
}