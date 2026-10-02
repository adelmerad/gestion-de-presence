import { Role } from "./types";

/** Classes Tailwind par rôle, toutes basées sur les variables de globals.css. */
export const ROLE_STYLES: Record<Role, { text: string; wash: string; dot: string; border: string }> = {
  technicien: { text: "text-tech", wash: "bg-tech-wash", dot: "bg-tech", border: "border-tech" },
  receptionniste: { text: "text-recep", wash: "bg-recep-wash", dot: "bg-recep", border: "border-recep" },
  manipulateur: { text: "text-manip", wash: "bg-manip-wash", dot: "bg-manip", border: "border-manip" },
};
