"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Fenêtre centrée sur ordinateur, panneau qui monte du bas sur téléphone. */
export function Modal({ open, onOpenChange, title, description, children, footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[14px] bg-surface shadow-[0_-8px_40px_rgb(0_0_0/0.18)] focus:outline-none data-[state=open]:animate-sheet-up sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[86dvh] sm:w-[28rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[12px] sm:shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35)] sm:data-[state=open]:animate-pop-in">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden" />
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
            <div className="min-w-0">
              <Dialog.Title className="font-display text-[26px] leading-tight text-ink first-letter:uppercase">
                {title}
              </Dialog.Title>
              {description && <Dialog.Description className="mt-1 text-sm text-ink-soft">{description}</Dialog.Description>}
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Fermer"
                className="-mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-paper hover:text-ink"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>
          {footer && (
            <div className="flex justify-end gap-2 border-t border-line px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:px-6">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
