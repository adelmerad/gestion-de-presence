import { AttendanceStore, AttendanceValue, Employee, Rates } from "./types";

export function dailyPay(role: Employee["role"], value: AttendanceValue | undefined, rates: Rates): number {
  if (value === undefined) return 0;
  switch (role) {
    case "chef":
      return 0; // le responsable du centre n'est pas payé via l'application
    case "medecin":
      return typeof value === "number" ? value : 0; // montant saisi à la main
    case "manipulateur":
      return typeof value === "number" ? value * rates.manipulateur : 0;
    default:
      return value === true ? rates[role] : 0;
  }
}

/** Nombre de jours travaillés, ou de scanners pour le manipulateur. */
export function dailyCount(role: Employee["role"], value: AttendanceValue | undefined): number {
  if (value === undefined) return 0;
  if (role === "manipulateur") {
    return typeof value === "number" ? value : 0;
  }
  return 1;
}

export interface EmployeeMonthTotal {
  employee: Employee;
  count: number;
  total: number;
}

export interface MonthTotals {
  perEmployee: EmployeeMonthTotal[];
  grandTotal: number;
}

/**
 * Calcule les totaux du mois (monthKey au format "YYYY-MM").
 * Inclut tous les employés actifs (même à 0), et les employés inactifs
 * uniquement s'ils ont des entrées ce mois-là, pour ne pas faire
 * disparaître l'historique de paie d'un employé qui a quitté.
 * Le médecin chef n'apparaît pas: il n'est pas payé via l'application.
 */
export function monthlyTotals(
  employees: Employee[],
  store: AttendanceStore,
  monthKey: string,
  rates: Rates,
): MonthTotals {
  const datesInMonth = Object.keys(store).filter((d) => d.startsWith(monthKey));

  const relevantEmployees = employees.filter((emp) => {
    if (emp.role === "chef") return false;
    if (emp.active) return true;
    return datesInMonth.some((date) => store[date][emp.id] !== undefined);
  });

  const perEmployee: EmployeeMonthTotal[] = relevantEmployees.map((employee) => {
    let count = 0;
    let total = 0;
    for (const date of datesInMonth) {
      const value = store[date][employee.id];
      count += dailyCount(employee.role, value);
      total += dailyPay(employee.role, value, rates);
    }
    return { employee, count, total };
  });

  const grandTotal = perEmployee.reduce((sum, e) => sum + e.total, 0);

  return { perEmployee, grandTotal };
}

export function dayTotal(employees: Employee[], dayEntries: Record<string, AttendanceValue>, rates: Rates): number {
  return employees.reduce((sum, emp) => sum + dailyPay(emp.role, dayEntries[emp.id], rates), 0);
}
