"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths } from "@/lib/dates";

interface MonthNavProps {
  monthDate: Date;
  onChange: (date: Date) => void;
}

const SEGMENT = "flex h-9 items-center justify-center text-ink-soft transition-colors hover:bg-paper hover:text-ink";

export function MonthNav({ monthDate, onChange }: MonthNavProps) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === monthDate.getFullYear() && today.getMonth() === monthDate.getMonth();

  return (
    <div className="inline-flex overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_0_rgb(0_0_0/0.03)]">
      <button type="button" onClick={() => onChange(subMonths(monthDate, 1))} className={`${SEGMENT} w-9`} aria-label="Mois précédent">
        <ChevronLeft size={17} />
      </button>
      <button
        type="button"
        onClick={() => onChange(new Date(today.getFullYear(), today.getMonth(), 1))}
        disabled={isCurrentMonth}
        className={`${SEGMENT} border-x border-line px-3.5 text-[13px] font-semibold disabled:cursor-default disabled:text-ink-faint disabled:hover:bg-transparent`}
      >
        Aujourd&apos;hui
      </button>
      <button type="button" onClick={() => onChange(addMonths(monthDate, 1))} className={`${SEGMENT} w-9`} aria-label="Mois suivant">
        <ChevronRight size={17} />
      </button>
    </div>
  );
}
