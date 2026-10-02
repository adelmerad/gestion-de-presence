import { AttendanceDay, Employee } from "@/lib/types";
import { isSameMonth, isToday } from "@/lib/dates";
import { ROLE_STYLES } from "@/lib/roleStyles";
import { Chip } from "./Chip";

interface DayCellProps {
  date: Date;
  monthDate: Date;
  isFridayCell: boolean;
  entries: AttendanceDay | undefined;
  employees: Employee[];
  onClick: () => void;
}

export function DayCell({ date, monthDate, isFridayCell, entries, employees, onClick }: DayCellProps) {
  const inCurrentMonth = isSameMonth(date, monthDate);
  const today = isToday(date);
  const dayNumber = date.getDate();

  const present = employees.filter((e) => entries?.[e.id] !== undefined);

  if (isFridayCell) {
    return (
      <div
        className={`flex h-16 flex-col rounded-lg border border-border bg-repos-bg p-1 sm:h-28 sm:p-1.5 ${
          inCurrentMonth ? "" : "opacity-40"
        }`}
        aria-label="Repos"
      >
        <span className="text-xs font-medium text-repos-text">{dayNumber}</span>
        <div className="mt-auto flex justify-center">
          <span className="rounded-full bg-repos-badge-bg px-1 py-0.5 text-[9px] sm:px-2 sm:text-[11px] font-medium text-repos-badge-text">
            Repos
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-16 flex-col gap-1 rounded-lg border bg-surface p-1 text-left sm:h-28 sm:p-1.5 transition-colors hover:border-primary-300 hover:bg-primary-50 ${
        today ? "border-primary-500 ring-1 ring-primary-500" : "border-border"
      } ${inCurrentMonth ? "" : "opacity-40"}`}
    >
      <span className={`text-xs font-medium ${today ? "text-primary-700" : "text-text-primary"}`}>{dayNumber}</span>
      {/* Téléphone: cases trop étroites pour les noms, une pastille par présent. */}
      <div className="flex flex-wrap items-center gap-0.5 sm:hidden">
        {present.map((emp) => {
          const value = entries?.[emp.id];
          return typeof value === "number" ? (
            <span key={emp.id} className={`rounded-full px-1 text-[9px] font-semibold leading-3 ${ROLE_STYLES[emp.role].bg} ${ROLE_STYLES[emp.role].text}`}>
              {value}
            </span>
          ) : (
            <span key={emp.id} className={`h-2 w-2 rounded-full ${ROLE_STYLES[emp.role].dot}`} />
          );
        })}
      </div>
      <div className="hidden flex-1 flex-col gap-0.5 overflow-hidden sm:flex">
        {present.slice(0, 3).map((emp) => (
          <Chip key={emp.id} employee={emp} scans={typeof entries?.[emp.id] === "number" ? (entries?.[emp.id] as number) : undefined} />
        ))}
        {present.length > 3 && (
          <span className="text-[11px] font-medium text-text-muted">+{present.length - 3}</span>
        )}
      </div>
    </button>
  );
}
