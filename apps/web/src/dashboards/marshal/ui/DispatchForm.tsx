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
    <div className="space-y-5">

      {/* Fare Inputs */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Bus Fare */}
        <div className="space-y-2">
          <Label
            htmlFor="busFare"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Banknote className="h-4 w-4 text-muted-foreground" />
            Bus Fare (KES)
          </Label>

          <Input
            id="busFare"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            placeholder="e.g. 80"
            value={busFare}
            disabled={disabled}
            onChange={(e) =>
              onBusFareChange(e.target.value)
            }
          />
        </div>

        {/* SACCO Fee */}
        <div className="space-y-2">
          <Label
            htmlFor="saccoFee"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Coins className="h-4 w-4 text-muted-foreground" />
            SACCO Fee (KES)
          </Label>

          <Input
            id="saccoFee"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            placeholder="e.g. 500"
            value={saccoFee}
            disabled={disabled}
            onChange={(e) =>
              onSaccoFeeChange(e.target.value)
            }
          />
        </div>

      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label
          htmlFor="remarks"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          Remarks
        </Label>

        <Textarea
          id="remarks"
          rows={3}
          className="resize-none"
          placeholder="Add dispatch remarks (optional)"
          value={remarks}
          disabled={disabled}
          onChange={(e) =>
            onRemarksChange(e.target.value)
          }
        />
      </div>

    </div>
  );
}