import { AttendanceDay, AttendanceValue, Employee, isDoctor, Rates } from "@/lib/types";
import { isSameMonth, isToday } from "@/lib/dates";
import { dayTotal } from "@/lib/payroll";
import { ROLE_STYLES } from "@/lib/roleStyles";

interface DayCellProps {
  date: Date;
  monthDate: Date;
  isFridayCell: boolean;
  entries: AttendanceDay | undefined;
  employees: Employee[];
  rates: Rates;
  onClick: () => void;
}

const CELL = "relative flex h-[68px] flex-col p-1.5 sm:h-[118px] sm:p-2";

function DayNumber({ day, today, muted }: { day: number; today: boolean; muted: boolean }) {
  // Aujourd'hui: le numéro est entouré d'un anneau, comme celui du symbole.
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center font-mono text-xs ${
        today
          ? "rounded-full border-2 border-accent font-bold text-accent"
          : muted
            ? "text-ink-faint"
            : "font-medium text-ink"
      }`}
    >
      {day}
    </span>
  );
}

export function DayCell({ date, monthDate, isFridayCell, entries, employees, rates, onClick }: DayCellProps) {
  const inCurrentMonth = isSameMonth(date, monthDate);
  const today = isToday(date);
  const dayNumber = date.getDate();

  if (isFridayCell) {
    return (
      <div className={`${CELL} hatch bg-paper/70 ${inCurrentMonth ? "" : "opacity-50"}`} aria-label="Repos">
        <DayNumber day={dayNumber} today={today} muted />
        <span className="mt-auto hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:block">
          Repos
        </span>
      </div>
    );
  }

  // Le médecin du jour en premier.
  const present = employees
    .filter((e) => entries?.[e.id] !== undefined)
    .sort((a, b) => Number(isDoctor(b.role)) - Number(isDoctor(a.role)));
  const total = entries ? dayTotal(employees, entries as Record<string, AttendanceValue>, rates) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CELL} group text-left transition-colors focus-visible:z-10 focus-visible:outline-offset-[-2px] ${
        inCurrentMonth ? "bg-surface hover:bg-accent-wash/60" : "bg-paper/60 hover:bg-paper"
      }`}
    >
      <DayNumber day={dayNumber} today={today} muted={!inCurrentMonth} />

      {/* Téléphone: une pastille par présent (le chiffre = nombre de scanners). */}
      <div className={`mt-1 flex flex-wrap content-start gap-[3px] sm:hidden ${inCurrentMonth ? "" : "opacity-50"}`}>
        {present.map((emp) => {
          const value = entries?.[emp.id];
          const style = ROLE_STYLES[emp.role];
          return emp.role !== "medecin" && typeof value === "number" ? (
            <span key={emp.id} className={`rounded-full px-1 font-mono text-[9px] font-bold leading-[12px] ${style.wash} ${style.text}`}>
              {value}
            </span>
          ) : (
            <span key={emp.id} className={`mt-[2px] h-2 w-2 rounded-full ${style.dot}`} />
          );
        })}
      </div>

      {/* Ordinateur: les noms, avec un trait à la couleur du rôle. */}
      <div className={`mt-1 hidden min-h-0 flex-1 flex-col gap-[3px] overflow-hidden sm:flex ${inCurrentMonth ? "" : "opacity-50"}`}>
        {present.slice(0, 3).map((emp) => {
          const value = entries?.[emp.id];
          const style = ROLE_STYLES[emp.role];
          return (
            <span key={emp.id} className={`flex items-center gap-1 truncate border-l-2 pl-1.5 text-[11.5px] font-medium leading-[15px] text-ink ${style.border}`}>
              <span className="truncate">{emp.name}</span>
              {emp.role !== "medecin" && typeof value === "number" && <span className={`font-mono text-[10px] font-bold ${style.text}`}>×{value}</span>}
            </span>
          );
        })}
        {present.length > 3 && <span className="pl-2 text-[11px] font-semibold text-ink-soft">+{present.length - 3}</span>}
      </div>

      {total > 0 && (
        <span className="absolute bottom-1.5 right-2 hidden font-mono text-[10px] text-ink-faint transition-colors group-hover:text-accent sm:block">
          {total.toLocaleString("fr-FR")}
        </span>
      )}
    </button>
  );
}
