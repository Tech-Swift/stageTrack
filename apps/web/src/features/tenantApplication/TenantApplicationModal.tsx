import React, { useEffect } from "react";
import { X, Building2 } from "lucide-react";

import TenantApplicationForm from "./TenantApplicationForm";

interface TenantApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

const TenantApplicationModal: React.FC<
  TenantApplicationModalProps
> = ({ open, onClose }) => {
  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Close modal when Escape is pressed
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md sm:p-6"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tenant-application-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 size={21} />
            </div>

            <div>
              <h2
                id="tenant-application-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Apply as a SACCO
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register your organization on StageTrack
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close application form"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <TenantApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantApplicationModal;

