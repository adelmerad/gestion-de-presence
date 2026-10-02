import { AttendanceStore, AttendanceValue, canDoBonusScans, Employee, Rates } from "./types";

export function dailyPay(employee: Employee, value: AttendanceValue | undefined, rates: Rates): number {
  if (value === undefined) return 0;
  const role = employee.role;
  // Salaire fixe: la présence ne rapporte rien de plus, seuls les scanners en plus s'ajoutent.
  if (employee.monthlySalary) {
    return typeof value === "number" && canDoBonusScans(role) ? value * rates.scanBonus : 0;
  }
  switch (role) {
    case "chef":
      return 0; // le responsable du centre n'est pas payé via l'application
    case "medecin":
      return typeof value === "number" ? value : 0; // montant saisi à la main
    case "manipulateur":
      return typeof value === "number" ? value * rates.manipulateur : 0;
    default:
      // Présent (true), ou présent avec des scanners en plus (nombre).
      if (typeof value === "number") {
        return canDoBonusScans(role) ? rates[role] + value * rates.scanBonus : rates[role];
      }
      return rates[role];
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

/** Scanners faits ce jour-là: ceux du manipulateur, ou faits en plus par un autre employé. */
export function dailyScans(role: Employee["role"], value: AttendanceValue | undefined): number {
  if (typeof value !== "number") return 0;
  return role === "manipulateur" || canDoBonusScans(role) ? value : 0;
}

export interface EmployeeMonthTotal {
  employee: Employee;
  count: number;
  /** Scanners faits en plus (hors manipulateur, dont count est déjà le nombre de scanners). */
  bonusScans: number;
  /** Payé au salaire mensuel fixe (inclus dans total). */
  fixed: boolean;
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
    let bonusScans = 0;
    let total = employee.monthlySalary ?? 0;
    for (const date of datesInMonth) {
      const value = store[date][employee.id];
      count += dailyCount(employee.role, value);
      if (employee.role !== "manipulateur") bonusScans += dailyScans(employee.role, value);
      total += dailyPay(employee, value, rates);
    }
    return { employee, count, bonusScans, fixed: Boolean(employee.monthlySalary), total };
  });

  const grandTotal = perEmployee.reduce((sum, e) => sum + e.total, 0);

  return { perEmployee, grandTotal };
}

export function dayTotal(employees: Employee[], dayEntries: Record<string, AttendanceValue>, rates: Rates): number {
  return employees.reduce((sum, emp) => sum + dailyPay(emp, dayEntries[emp.id], rates), 0);
}
