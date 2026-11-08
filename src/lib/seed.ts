import { Employee, Rates } from "./types";

export const SEED_EMPLOYEES: Employee[] = [
  { id: "yasmine", name: "Yasmine", role: "technicien", active: true },
  { id: "karim", name: "Karim", role: "technicien", active: true },
  { id: "lina", name: "Lina", role: "receptionniste", active: true },
  { id: "sofiane", name: "Sofiane", role: "receptionniste", active: true },
  { id: "meriem", name: "Meriem", role: "receptionniste", active: true },
  { id: "rym", name: "Rym", role: "manipulateur", active: true },
];

export const SEED_RATES: Rates = {
  technicien: 2000,
  receptionniste: 1000,
  manipulateur: 1000,
  manipulateur_jour: 4000,
  menage: 1000,
  scanBonus: 1000,
};
