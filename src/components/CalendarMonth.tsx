import { AttendanceStore, Employee, Rates, Role, ROLE_LABELS } from "@/lib/types";
import { buildMonthGrid, isFriday, toISODate, WEEKDAY_LABELS_SAT_START } from "@/lib/dates";
import { ROLE_STYLES } from "@/lib/roleStyles";
import { DayCell } from "./DayCell";

interface CalendarMonthProps {
  monthDate: Date;
  attendance: AttendanceStore;
  employees: Employee[];
  rates: Rates;
  onDayClick: (dateISO: string) => void;
}

const ROLES: Role[] = ["technicien", "receptionniste", "manipulateur"];

export function CalendarMonth({ monthDate, attendance, employees, rates, onDayClick }: CalendarMonthProps) {
  const { weeks } = buildMonthGrid(monthDate);

  return (
    <div>
      <div className="overflow-hidden rounded-[10px] border border-line bg-line shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        <div className="grid grid-cols-7 gap-px">
          {WEEKDAY_LABELS_SAT_START.map((label) => (
            <div
              key={label}
              className={`bg-surface px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] sm:px-2.5 sm:text-left ${
                label === "Ven" ? "text-ink-faint" : "text-ink-soft"
              }`}
            >
              {label}
            </div>
          ))}
          {weeks.flat().map((date) => {
            const dateISO = toISODate(date);
            return (
              <DayCell
                key={dateISO}
                date={date}
                monthDate={monthDate}
                isFridayCell={isFriday(date)}
                entries={attendance[dateISO]}
                employees={employees}
                rates={rates}
                onClick={() => onDayClick(dateISO)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-xs text-ink-soft">
        {ROLES.map((role) => (
          <span key={role} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${ROLE_STYLES[role].dot}`} />
            {ROLE_LABELS[role]}
            {role === "manipulateur" && <span className="text-ink-faint">(nb de scanners)</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
