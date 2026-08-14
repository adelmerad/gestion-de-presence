import { AttendanceStore, Employee } from "@/lib/types";
import { buildMonthGrid, isFriday, toISODate, WEEKDAY_LABELS_SAT_START } from "@/lib/dates";
import { DayCell } from "./DayCell";

interface CalendarMonthProps {
  monthDate: Date;
  attendance: AttendanceStore;
  employees: Employee[];
  onDayClick: (dateISO: string) => void;
}

export function CalendarMonth({ monthDate, attendance, employees, onDayClick }: CalendarMonthProps) {
  const { weeks } = buildMonthGrid(monthDate);

  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-sm sm:p-4">
      <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_LABELS_SAT_START.map((label) => (
          <div key={label} className="px-1 text-center text-xs font-medium text-text-muted">
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {week.map((date) => {
              const dateISO = toISODate(date);
              return (
                <DayCell
                  key={dateISO}
                  date={date}
                  monthDate={monthDate}
                  isFridayCell={isFriday(date)}
                  entries={attendance[dateISO]}
                  employees={employees}
                  onClick={() => onDayClick(dateISO)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
