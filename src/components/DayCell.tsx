import { AttendanceDay, Employee } from "@/lib/types";
import { isSameMonth, isToday } from "@/lib/dates";
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
        className={`flex h-24 flex-col rounded-lg border border-border bg-repos-bg p-1.5 sm:h-28 ${
          inCurrentMonth ? "" : "opacity-40"
        }`}
        aria-label="Repos"
      >
        <span className="text-xs font-medium text-repos-text">{dayNumber}</span>
        <div className="mt-auto flex justify-center">
          <span className="rounded-full bg-repos-badge-bg px-2 py-0.5 text-[11px] font-medium text-repos-badge-text">
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
      className={`flex h-24 flex-col gap-1 rounded-lg border bg-surface p-1.5 text-left transition-colors hover:border-primary-300 hover:bg-primary-50 sm:h-28 ${
        today ? "border-primary-500 ring-1 ring-primary-500" : "border-border"
      } ${inCurrentMonth ? "" : "opacity-40"}`}
    >
      <span className={`text-xs font-medium ${today ? "text-primary-700" : "text-text-primary"}`}>{dayNumber}</span>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
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
