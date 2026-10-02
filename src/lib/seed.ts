import { Employee, Rates } from "./types";

export const SEED_EMPLOYEES: Employee[] = [
  { id: "amel", name: "Amel", role: "technicien", active: true },
  { id: "saliha", name: "Saliha", role: "technicien", active: true },
  { id: "adel", name: "Adel", role: "receptionniste", active: true },
  { id: "imad", name: "Imad", role: "receptionniste", active: true },
  { id: "walid", name: "Walid", role: "receptionniste", active: true },
  { id: "nadjib", name: "Nadjib", role: "manipulateur", active: true },
];

export const SEED_RATES: Rates = {
  technicien: 2000,
  receptionniste: 1000,
  manipulateur: 1000,
  menage: 1000,
  scanBonus: 1000,
};
