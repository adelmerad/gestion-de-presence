"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

/**
 * Menu déroulant: Radix gère le positionnement (il s'ouvre vers le haut s'il
 * manque de place en bas), le clavier et la fermeture au clic extérieur.
 */
export function Menu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 min-w-44 origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-[8px] border border-line bg-surface p-1 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.25)] data-[state=open]:animate-menu-in"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({
  children,
  onSelect,
  tone = "default",
  icon,
}: {
  children: ReactNode;
  onSelect: () => void;
  tone?: "default" | "danger";
  icon?: ReactNode;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={`flex cursor-pointer select-none items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-sm font-medium outline-none transition-colors ${
        tone === "danger"
          ? "text-danger data-[highlighted]:bg-danger-wash"
          : "text-ink data-[highlighted]:bg-paper"
      }`}
    >
      {icon && <span className="text-current opacity-70">{icon}</span>}
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="mx-1 my-1 h-px bg-line" />;
}
