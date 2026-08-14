export type Role = "technicien" | "receptionniste" | "manipulateur";

export interface Employee {
  id: string;
  name: string;
  role: Role;
  active: boolean;
}

/**
 * technicien / receptionniste: `true` = présent ce jour-là (absent = clé absente).
 * manipulateur (Nadjib): nombre = nombre de scanners ce jour-là (0/absent = clé absente).
 */
export type AttendanceValue = true | number;

export interface AttendanceDay {
  [employeeId: string]: AttendanceValue;
}

export interface AttendanceStore {
  [dateISO: string]: AttendanceDay;
}

export const ROLE_LABELS: Record<Role, string> = {
  technicien: "Technicien(ne)",
  receptionniste: "Réceptionniste",
  manipulateur: "Manipulateur",
};

/**
 * Tarif par rôle, en DA. Pour technicien/receptionniste: montant par jour
 * de présence. Pour manipulateur: montant par scanner effectué.
 */
export type Rates = Record<Role, number>;
