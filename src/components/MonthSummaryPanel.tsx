import { AttendanceStore, Employee, Rates } from "@/lib/types";
import { monthlyTotals } from "@/lib/payroll";
import { ROLE_STYLES } from "@/lib/roleStyles";

interface MonthSummaryPanelProps {
  employees: Employee[];
  attendance: AttendanceStore;
  monthKey: string;
  rates: Rates;
}

export function MonthSummaryPanel({ employees, attendance, monthKey, rates }: MonthSummaryPanelProps) {
  const { perEmployee, grandTotal } = monthlyTotals(employees, attendance, monthKey, rates);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">Récapitulatif du mois</h3>
      <div className="flex flex-col divide-y divide-border">
        {perEmployee.map(({ employee, count, total }) => {
          const style = ROLE_STYLES[employee.role];
          const unit = employee.role === "manipulateur" ? "scanner" : "jour";
          return (
            <div key={employee.id} className="flex items-center justify-between gap-2 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {employee.name}
                    {!employee.active && <span className="ml-1 text-xs text-text-muted">(inactif)</span>}
                  </p>
                  <p className="text-xs text-text-muted">
                    {count} {unit}
                    {count > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-text-primary">
                {total.toLocaleString("fr-FR")} DA
              </span>
            </div>
          );
        })}
        {perEmployee.length === 0 && (
          <p className="py-4 text-center text-sm text-text-muted">Aucune donnée ce mois-ci.</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-primary-600 px-3 py-2.5">
        <span className="text-sm font-medium text-white">Total général</span>
        <span className="text-base font-semibold text-white">{grandTotal.toLocaleString("fr-FR")} DA</span>
      </div>
    </div>
  );
}
