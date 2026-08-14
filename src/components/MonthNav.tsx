"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, formatMonthYear, subMonths } from "@/lib/dates";
import { Button } from "./ui/Button";

interface MonthNavProps {
  monthDate: Date;
  onChange: (date: Date) => void;
}

export function MonthNav({ monthDate, onChange }: MonthNavProps) {
  const today = new Date();
  const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(subMonths(monthDate, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => onChange(addMonths(monthDate, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <h2 className="text-lg font-semibold text-text-primary sm:text-xl">{formatMonthYear(monthDate)}</h2>
      <Button variant="secondary" onClick={() => onChange(todayMonthStart)}>
        Aujourd&apos;hui
      </Button>
    </div>
  );
}
