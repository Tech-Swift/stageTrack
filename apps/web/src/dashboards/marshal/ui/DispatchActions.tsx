import { Loader2, Send, X } from "lucide-react";

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DispatchActionsProps {
  loading: boolean;

  disabled?: boolean;

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

export function DispatchActions({
  loading,
  disabled = false,
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
      <div className="sticky bottom-0 border-t bg-white">
        <div className="flex items-center justify-end gap-4 p-6">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                disabled={loading || disabled}
                style={{
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Dispatch Vehicle
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-xl font-bold">
                  Confirm Vehicle Dispatch
                </AlertDialogTitle>

                <AlertDialogDescription className="text-center">
                  Please review the dispatch details before confirming.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Vehicle
                  </span>

                  <span className="font-semibold">
                    {plateNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Route
                  </span>

                  <span className="font-semibold">
                    {routeName}
                  </span>
                </div>

                <div className="border-t pt-2" />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Expected Revenue
                  </span>

                  <span className="font-semibold">
                    KES {expectedRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Platform Charge
                  </span>

                  <span className="font-semibold text-orange-600">
                    KES {platformFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    SACCO Fee
                  </span>

                  <span className="font-semibold text-blue-600">
                    KES {saccoFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold">
                    Total Payable
                  </span>

                  <span className="text-xl font-bold text-green-600">
                    KES {totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                <p className="font-semibold mb-2">
                  This action will:
                </p>

                <ul className="list-disc space-y-1 pl-5">
                  <li>Record the vehicle dispatch.</li>
                  <li>Remove the vehicle from the active queue.</li>
                  <li>Create the StageTrack platform charge.</li>
                  <li>Record the SACCO collection.</li>
                  <li>Promote the next vehicle for loading.</li>
                </ul>

                <p className="mt-3 font-semibold text-red-600">
                  This action cannot be undone.
                </p>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>
                  Go Back
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
                      Yes, Dispatch Vehicle
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}