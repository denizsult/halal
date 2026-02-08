import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalAction = {
  label: string;
  onClick: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

type TopRightModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

export function TopRightModal({
  isOpen,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  contentClassName,
  bodyClassName,
  footerClassName,
}: TopRightModalProps) {
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" />

      <DialogContent
        showCloseButton={false}
        className={cn(
          "fixed top-6 right-6 left-auto translate-x-0 translate-y-0 z-50 w-[92vw] max-w-[520px] bg-white text-gray-900 rounded-3xl shadow-2xl p-0 gap-0 overflow-hidden flex flex-col",
          contentClassName
        )}
      >
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-100 text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className={cn("flex-1 overflow-y-auto", bodyClassName)}>
          {children}
        </div>

        {hasActions ? (
          <div
            className={cn(
              "border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end bg-white",
              footerClassName
            )}
          >
            {secondaryAction ? (
              <Button
                variant={secondaryAction.variant ?? "outline"}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
                className={cn(
                  "w-full sm:w-auto rounded-full px-6 py-3",
                  secondaryAction.className
                )}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
                disabled={primaryAction.disabled}
                className={cn(
                  "w-full sm:w-auto rounded-full px-6 py-3 font-semibold",
                  primaryAction.className
                )}
                variant={primaryAction.variant}
              >
                {primaryAction.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
