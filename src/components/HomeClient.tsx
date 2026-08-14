"use client";

import { useMemo, useState } from "react";
import { AttendanceDay, AttendanceStore, Employee, Rates } from "@/lib/types";
import { monthKey as getMonthKey } from "@/lib/dates";
import { CalendarMonth } from "./CalendarMonth";
import { MonthNav } from "./MonthNav";
import { MonthSummaryPanel } from "./MonthSummaryPanel";
import { DayEditorModal } from "./DayEditorModal";

interface HomeClientProps {
  employees: Employee[];
  initialAttendance: AttendanceStore;
  rates: Rates;
}

export function HomeClient({ employees, initialAttendance, rates }: HomeClientProps) {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [attendance, setAttendance] = useState<AttendanceStore>(initialAttendance);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthKey = useMemo(() => getMonthKey(monthDate), [monthDate]);

  async function handleSaveDay(dateISO: string, entries: AttendanceDay) {
    const res = await fetch(`/api/attendance/${dateISO}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    if (!res.ok) {
      throw new Error("save failed");
    }
    const data: { date: string; entries: AttendanceDay } = await res.json();
    setAttendance((prev) => {
      const next = { ...prev };
      if (Object.keys(data.entries).length === 0) {
        delete next[data.date];
      } else {
        next[data.date] = data.entries;
      }
      return next;
    });
    setSelectedDate(null);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <MonthNav monthDate={monthDate} onChange={setMonthDate} />
        <CalendarMonth
          monthDate={monthDate}
          attendance={attendance}
          employees={employees}
          onDayClick={setSelectedDate}
        />
      </div>
      <div className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
        <MonthSummaryPanel employees={employees} attendance={attendance} monthKey={monthKey} rates={rates} />
      </div>

      {selectedDate && (
        <DayEditorModal
          key={selectedDate}
          dateISO={selectedDate}
          employees={employees}
          entries={attendance[selectedDate] ?? {}}
          rates={rates}
          onClose={() => setSelectedDate(null)}
          onSave={handleSaveDay}
        />
      )}
    </div>
  );
}
