import { Loader2, Send, X, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

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

interface DispatchActionsProps {
  loading: boolean;

  disabled?: boolean;

  openConfirm: boolean;

  onOpenConfirmChange: (open: boolean) => void;

  primaryColor?: string;

  plateNumber: string;

  routeName: string;

  expectedRevenue: number;

  platformFee: number;

  saccoFee: number;

  totalPayable: number;

  onCancel: () => void;

  onDispatch: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DispatchActions({
  loading,
  disabled = false,
  openConfirm,
  onOpenConfirmChange,
  primaryColor,
  plateNumber,
  routeName,
  expectedRevenue,
  platformFee,
  saccoFee,
  totalPayable,
  onCancel,
  onDispatch,
}: DispatchActionsProps) {
  const accentColor = primaryColor ?? "#2563EB";

  return (
    <>
      {/* Footer */}

      <div className="flex items-center justify-between border-t bg-white px-6 py-5">
        <div>
          <p className="text-sm font-medium text-slate-900">
            Ready to dispatch?
          </p>

          <p className="text-xs text-slate-500">
            Review the information before confirming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button
            disabled={loading || disabled}
            onClick={() => onOpenConfirmChange(true)}
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor,
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Dispatch Vehicle
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}

      <AlertDialog
        open={openConfirm}
        onOpenChange={onOpenConfirmChange}
      >
        <AlertDialogContent className="sm:max-w-lg rounded-2xl">

          <AlertDialogHeader>

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>

            <AlertDialogTitle className="text-center text-2xl">
              Confirm Dispatch
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center">
              Please confirm the vehicle details before
              completing this dispatch.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <div className="rounded-xl border bg-slate-50 p-5">

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Vehicle
                </span>

                <span className="font-semibold">
                  {plateNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Route
                </span>

                <span className="font-semibold">
                  {routeName}
                </span>
              </div>

              <div className="border-t" />

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Revenue
                </span>

                <span className="font-semibold">
                  {formatCurrency(expectedRevenue)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Platform Fee
                </span>

                <span className="font-medium text-orange-600">
                  {formatCurrency(platformFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  SACCO Fee
                </span>

                <span className="font-medium text-blue-600">
                  {formatCurrency(saccoFee)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-3">

                <span className="font-semibold">
                  Total Cash
                </span>

                <span
                  className="text-xl font-bold"
                  style={{ color: accentColor }}
                >
                  {formatCurrency(totalPayable)}
                </span>

              </div>

            </div>

          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">

            <p className="mb-2 font-semibold text-amber-900">
              Dispatch will:
            </p>

            <ul className="list-disc space-y-1 pl-5 text-amber-800">
              <li>Remove the vehicle from the loading bay.</li>
              <li>Record today's dispatch.</li>
              <li>Create StageTrack platform charges.</li>
              <li>Record SACCO fees.</li>
              <li>Automatically promote the next vehicle.</li>
            </ul>

          </div>

          <AlertDialogFooter>

            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                onDispatch();
              }}
              style={{
                backgroundColor: accentColor,
                borderColor: accentColor,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirm Dispatch
                </>
              )}
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}