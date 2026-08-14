import { Employee } from "@/lib/types";
import { ROLE_STYLES } from "@/lib/roleStyles";

interface ChipProps {
  employee: Employee;
  scans?: number;
}

export function Chip({ employee, scans }: ChipProps) {
  const style = ROLE_STYLES[employee.role];
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[11px] font-medium ${style.bg} ${style.text} ${style.ring ?? ""}`}
      title={employee.name}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      <span className="truncate">{employee.name}</span>
      {typeof scans === "number" && scans > 0 && <span className="shrink-0 font-semibold">×{scans}</span>}
    </span>
  );
}
