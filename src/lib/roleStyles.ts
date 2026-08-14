import { Role } from "./types";

export const ROLE_STYLES: Record<Role, { bg: string; text: string; dot: string; ring?: string }> = {
  technicien: { bg: "bg-tech-bg", text: "text-tech-text", dot: "bg-tech-dot" },
  receptionniste: { bg: "bg-recep-bg", text: "text-recep-text", dot: "bg-recep-dot" },
  manipulateur: { bg: "bg-manip-bg", text: "text-manip-text", dot: "bg-manip-dot", ring: "ring-2 ring-amber-400" },
};
