import { Employee } from "@/lib/types";
import { ROLE_STYLES } from "@/lib/roleStyles";

/** Initiales sur la teinte du rôle. */
export function Avatar({ employee, dimmed = false }: { employee: Employee; dimmed?: boolean }) {
  const style = ROLE_STYLES[employee.role];
  const initials = employee.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-opacity ${style.wash} ${style.text} ${
        dimmed ? "opacity-55" : ""
      }`}
    >
      {initials}
    </span>
  );
}
