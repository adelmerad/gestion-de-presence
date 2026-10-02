export type Role = "technicien" | "receptionniste" | "manipulateur" | "menage" | "medecin" | "chef";

/** Tous les rôles, dans l'ordre d'affichage. */
export const ROLES: Role[] = ["technicien", "receptionniste", "manipulateur", "menage", "medecin", "chef"];

/** Rôles des médecins: un seul est de garde chaque jour ("médecin du jour"). */
export const DOCTOR_ROLES: Role[] = ["chef", "medecin"];
export const isDoctor = (role: Role) => DOCTOR_ROLES.includes(role);

/**
 * Rôles payés à la journée qui peuvent faire des scanners en plus (payés en
 * bonus). L'option n'est proposée qu'aux employés qui ont `doesScans`.
 */
export const SCAN_BONUS_ROLES: Role[] = ["technicien", "receptionniste"];
export const canDoBonusScans = (role: Role) => SCAN_BONUS_ROLES.includes(role);

export interface Employee {
  id: string;
  name: string;
  role: Role;
  active: boolean;
  /** Salaire mensuel fixe en DA: remplace le calcul à la journée. Absent ou null = payé à la journée. */
  monthlySalary?: number | null;
  /** Fait aussi des scanners (bonus par scanner), pour les rôles de SCAN_BONUS_ROLES. */
  doesScans?: boolean;
}

/** Champs modifiables depuis le formulaire employé. */
export type EmployeeFields = Pick<Employee, "name" | "role" | "monthlySalary" | "doesScans">;

/** Le salaire fixe ne concerne pas les médecins (montant du jour ou non payé). */
export const canHaveFixedSalary = (role: Role) => !DOCTOR_ROLES.includes(role);

/**
 * Valeur d'un employé pour un jour (clé absente = absent):
 * - menage, chef: `true` = présent.
 * - technicien, receptionniste: `true` = présent; un nombre = présent ET ce
 *   nombre de scanners faits en plus (payés au tarif "scanBonus").
 * - manipulateur: nombre de scanners effectués.
 * - medecin (remplaçant): montant versé ce jour-là, en DA, saisi à la main.
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
  menage: "Femme de ménage",
  medecin: "Médecin remplaçant",
  chef: "Médecin chef",
};

/** Rôles payés selon un tarif fixe (les autres: montant libre ou non payé). */
export type RatedRole = "technicien" | "receptionniste" | "manipulateur" | "menage";
export const RATED_ROLES: RatedRole[] = ["technicien", "receptionniste", "manipulateur", "menage"];

/**
 * Tarifs en DA: montant par jour de présence pour chaque rôle, sauf
 * manipulateur (par scanner). scanBonus: montant par scanner fait en plus
 * par un(e) technicien(ne) ou réceptionniste.
 */
export type RateKey = RatedRole | "scanBonus";
export type Rates = Record<RateKey, number>;
