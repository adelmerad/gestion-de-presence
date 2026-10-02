export type Role = "technicien" | "receptionniste" | "manipulateur" | "menage" | "medecin" | "chef";

/** Tous les rôles, dans l'ordre d'affichage. */
export const ROLES: Role[] = ["technicien", "receptionniste", "manipulateur", "menage", "medecin", "chef"];

/** Rôles des médecins: un seul est de garde chaque jour ("médecin du jour"). */
export const DOCTOR_ROLES: Role[] = ["chef", "medecin"];
export const isDoctor = (role: Role) => DOCTOR_ROLES.includes(role);

export interface Employee {
  id: string;
  name: string;
  role: Role;
  active: boolean;
}

/**
 * Valeur d'un employé pour un jour (clé absente = absent):
 * - technicien, receptionniste, menage, chef: `true` = présent.
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
 * Tarif par rôle, en DA: montant par jour de présence, sauf manipulateur
 * (montant par scanner effectué).
 */
export type Rates = Record<RatedRole, number>;
