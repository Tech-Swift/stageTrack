import { Banknote, Coins, FileText } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DispatchFormProps {
  busFare: string;
  saccoFee: string;
  remarks: string;

  onBusFareChange: (value: string) => void;
  onSaccoFeeChange: (value: string) => void;
  onRemarksChange: (value: string) => void;

  disabled?: boolean;
}

export function DispatchForm({
  busFare,
  saccoFee,
  remarks,
  onBusFareChange,
  onSaccoFeeChange,
  onRemarksChange,
  disabled = false,
}: DispatchFormProps) {
  return (
    <div className="space-y-6 p-6">

      {/* Bus Fare */}

      <div className="space-y-2">
        <Label
          htmlFor="busFare"
          className="flex items-center gap-2"
        >
          <Banknote className="h-4 w-4 text-green-600" />

          Bus Fare (KES)
        </Label>

        <Input
          id="busFare"
          type="number"
          min={0}
          step="1"
          placeholder="Enter bus fare"

          value={busFare}

          disabled={disabled}

          onChange={(e) =>
            onBusFareChange(e.target.value)
          }
        />

        <p className="text-xs text-muted-foreground">
          Fare charged per passenger.
        </p>
      </div>

      {/* SACCO Fee */}

      <div className="space-y-2">
        <Label
          htmlFor="saccoFee"
          className="flex items-center gap-2"
        >
          <Coins className="h-4 w-4 text-blue-600" />

          SACCO Fee (KES)
        </Label>

        <Input
          id="saccoFee"
          type="number"
          min={0}
          step="1"
          placeholder="Optional"

          value={saccoFee}

          disabled={disabled}

          onChange={(e) =>
            onSaccoFeeChange(e.target.value)
          }
        />

        <p className="text-xs text-muted-foreground">
          Amount payable to the SACCO for this trip.
        </p>
      </div>

      {/* Remarks */}

      <div className="space-y-2">
        <Label
          htmlFor="remarks"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4 text-slate-600" />

          Remarks
        </Label>

        <Textarea
          id="remarks"
          rows={4}
          placeholder="Optional dispatch notes"

          value={remarks}

          disabled={disabled}

          onChange={(e) =>
            onRemarksChange(e.target.value)
          }
        />

        <p className="text-xs text-muted-foreground">
          Record anything important about this dispatch.
        </p>
      </div>
    </div>
  );
}