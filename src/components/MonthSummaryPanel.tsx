import { AttendanceStore, Employee, Rates } from "@/lib/types";
import { monthlyTotals } from "@/lib/payroll";
import { ROLE_STYLES } from "@/lib/roleStyles";

interface MonthSummaryPanelProps {
  employees: Employee[];
  attendance: AttendanceStore;
  monthKey: string;
  monthLabel: string;
  rates: Rates;
}

const formatDA = (n: number) => n.toLocaleString("fr-FR");

/** Récapitulatif présenté comme une fiche de paie: lignes à points de conduite, total souligné double. */
export function MonthSummaryPanel({ employees, attendance, monthKey, monthLabel, rates }: MonthSummaryPanelProps) {
  const { perEmployee, grandTotal } = monthlyTotals(employees, attendance, monthKey, rates);

  return (
    <section className="rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <header className="border-b border-dashed border-line px-5 pb-3 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Fiche de paie</p>
        <h2 className="font-display text-2xl leading-tight text-ink first-letter:uppercase">{monthLabel}</h2>
      </header>

      <ul className="px-5 py-2">
        {perEmployee.map(({ employee, count, bonusScans, total }) => {
          const unit = employee.role === "manipulateur" ? "scanner" : "jour";
          return (
            <li key={employee.id} className="flex items-end gap-2 py-2">
              <div className="min-w-0">
                <p className={`truncate border-l-2 pl-2 text-sm font-semibold leading-tight text-ink ${ROLE_STYLES[employee.role].border}`}>
                  {employee.name}
                  {!employee.active && <span className="ml-1.5 text-xs font-normal text-ink-faint">inactif</span>}
                </p>
                <p className="pl-2.5 font-mono text-[11px] text-ink-soft">
                  {count} {unit}
                  {count > 1 ? "s" : ""}
                  {bonusScans > 0 && (
                    <span className="text-manip">
                      {" "}
                      · {bonusScans} scanner{bonusScans > 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </div>
              <span className="mb-1.5 min-w-4 flex-1 border-b border-dotted border-ink-faint/50" />
              <span className={`font-mono text-sm tabular-nums ${total > 0 ? "text-ink" : "text-ink-faint"}`}>
                {formatDA(total)}
              </span>
            </li>
          );
        })}
        {perEmployee.length === 0 && <li className="py-4 text-sm text-ink-soft">Aucune donnée ce mois-ci.</li>}
      </ul>

      <footer className="mx-5 flex items-baseline justify-between border-t-[3px] border-double border-ink/80 pb-4 pt-3">
        <span className="font-display text-xl text-ink">Total à verser</span>
        <span className="font-mono text-lg font-bold tabular-nums text-accent">
          {formatDA(grandTotal)} <span className="text-xs font-semibold text-ink-soft">DA</span>
        </span>
      </footer>
    </section>
  );
}
