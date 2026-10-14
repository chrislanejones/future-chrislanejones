"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// One modal look for the whole site: dimmed overlay, centered panel.
// Radix supplies the focus trap, Escape to close and focus return.
const overlayClass = "fixed inset-0 z-50 bg-black/50";
const panelClass =
  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6";
const titleClass = "text-lg font-bold text-ink";

// Callers open these from state, not a Radix Trigger, so Radix has nothing
// to refocus on close. Remember the opener and hand focus back to it.
function useReturnFocus() {
  const opener = React.useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      opener.current = document.activeElement as HTMLElement | null;
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      if (opener.current?.isConnected) opener.current.focus();
    },
  };
}

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Form dialogs (add/edit). Pass a max width through className.
export function Modal({
  open,
  onOpenChange,
  title,
  children,
  className,
}: ModalProps) {
  const returnFocus = useReturnFocus();
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content
          {...returnFocus}
          aria-describedby={undefined}
          className={cn(
            panelClass,
            "max-w-md max-h-[90vh] overflow-y-auto",
            className,
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <DialogPrimitive.Title className={titleClass}>
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted hover:text-ink"
                aria-label="Close"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}

// The one confirm step for destructive actions. Radix focuses Cancel first,
// so nothing is deleted by a stray Enter. The dialog does not close itself
// on confirm: onConfirm closes it (via onOpenChange's state) only when the
// action succeeds, so a failed delete leaves it open to retry.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  const returnFocus = useReturnFocus();
  const [pending, setPending] = React.useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={overlayClass} />
        <AlertDialog.Content
          {...returnFocus}
          className={cn(panelClass, "max-w-sm")}
        >
          <AlertDialog.Title className={cn(titleClass, "mb-4")}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted mb-6">
            {description}
          </AlertDialog.Description>
          <div className="flex gap-2">
            <AlertDialog.Action asChild>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={pending}
                onClick={async (event) => {
                  event.preventDefault();
                  setPending(true);
                  try {
                    await onConfirm();
                  } finally {
                    setPending(false);
                  }
                }}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" className="flex-1" disabled={pending}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
