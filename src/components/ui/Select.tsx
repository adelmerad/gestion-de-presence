"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  label?: string;
}

/** Liste déroulante stylée (remplace le <select> natif), positionnée par Radix. */
export function Select<T extends string>({ value, onChange, options, label }: SelectProps<T>) {
  return (
    <RadixSelect.Root value={value} onValueChange={(v) => onChange(v as T)}>
      <RadixSelect.Trigger
        aria-label={label}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-sm text-ink transition-colors hover:border-ink-faint/60 data-[state=open]:border-accent"
      >
        <RadixSelect.Value />
        <RadixSelect.Icon className="text-ink-soft">
          <ChevronDown size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="z-[60] w-[var(--radix-select-trigger-width)] rounded-[8px] border border-line bg-surface p-1 shadow-[0_12px_32px_-8px_rgb(0_0_0/0.25)] data-[state=open]:animate-menu-in"
        >
          <RadixSelect.Viewport>
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer select-none items-center justify-between gap-2 rounded-[5px] px-2.5 py-2 text-sm text-ink outline-none data-[highlighted]:bg-paper"
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="text-accent">
                  <Check size={15} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
