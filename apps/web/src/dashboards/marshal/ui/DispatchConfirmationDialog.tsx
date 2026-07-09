import { Loader2, AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DispatchConfirmationDialogProps {
  open: boolean;

  loading: boolean;

  primaryColor?: string;

  plateNumber: string;

  routeName: string;

  expectedRevenue: number;

  platformFee: number;

  saccoFee: number;

  totalPayable: number;

  onCancel: () => void;

  onConfirm: () => void;
}

export function DispatchConfirmationDialog({
  open,
  loading,
  primaryColor,
  plateNumber,
  routeName,
  expectedRevenue,
  platformFee,
  saccoFee,
  totalPayable,
  onCancel,
  onConfirm,
}: DispatchConfirmationDialogProps) {
  const accentColor = primaryColor ?? "#2563EB";

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md rounded-2xl">

        <AlertDialogHeader>

          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white"
            style={{
              backgroundColor: accentColor,
            }}
          >
            <AlertTriangle className="h-7 w-7" />
          </div>

          <AlertDialogTitle className="text-center text-2xl">
            Confirm Vehicle Dispatch
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            Please confirm the dispatch details before continuing.
            This action cannot be undone.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <div className="space-y-4 rounded-xl border bg-muted/40 p-5">

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Vehicle
            </span>

            <span className="font-semibold">
              {plateNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Route
            </span>

            <span className="font-semibold">
              {routeName}
            </span>
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Expected Revenue
            </span>

            <span className="font-semibold">
              KES {expectedRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Platform Charge
            </span>

            <span className="font-semibold text-red-600">
              KES {platformFee.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              SACCO Fee
            </span>

            <span className="font-semibold text-red-600">
              KES {saccoFee.toLocaleString()}
            </span>
          </div>

          <hr />

          <div className="flex items-center justify-between text-lg">

            <span className="font-bold">
              Total Payable
            </span>

            <span
              className="font-bold"
              style={{
                color: accentColor,
              }}
            >
              KES {totalPayable.toLocaleString()}
            </span>

          </div>

        </div>

        <p className="text-center text-sm text-muted-foreground">
          Once confirmed, this dispatch will be permanently
          recorded, the vehicle will be removed from the active
          queue, and the next vehicle will automatically begin
          loading.
        </p>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            style={{
              backgroundColor: accentColor,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dispatching...
              </>
            ) : (
              "Confirm Dispatch"
            )}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}