import { Role, ROLE_LABELS } from "@/lib/types";
import { ROLE_STYLES } from "@/lib/roleStyles";

/** Badge de rôle: pastille de couleur + libellé, sur fond teinté du rôle. */
export function RoleBadge({ role, compact = false }: { role: Role; compact?: boolean }) {
  const style = ROLE_STYLES[role];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-0.5 pl-1.5 pr-2 text-xs font-semibold ${style.wash} ${style.text}`}
      title={ROLE_LABELS[role]}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <span className={compact ? "hidden sm:inline" : undefined}>{ROLE_LABELS[role]}</span>
    </span>
  );
}

/** Badge d'état (actif / inactif) avec indicateur. */
export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${active ? "text-success" : "text-ink-faint"}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${active ? "bg-success ring-[3px] ring-success/15" : "border border-ink-faint"}`}
      />
      {active ? "Actif" : "Inactif"}
    </span>
  );
}
