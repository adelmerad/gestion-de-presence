"use client";

import { ReactNode, useState } from "react";
import { canDoBonusScans, canHaveFixedSalary, Employee, EmployeeFields, Role, ROLES } from "@/lib/types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { Toggle } from "./ui/Toggle";
import { RoleBadge } from "./ui/RoleBadge";
import { FIELD_LABEL, TEXT_INPUT } from "./ui/styles";

interface EmployeeFormProps {
  employee: Employee | null; // null = création
  onClose: () => void;
  onSubmit: (data: EmployeeFields) => Promise<void>;
}

const ROLE_HINTS: Partial<Record<Role, string>> = {
  manipulateur: "Payé au nombre de scanners effectués, pas à la journée.",
  medecin: "Le montant est saisi à la main chaque jour où il/elle remplace.",
  chef: "Apparaît comme médecin du jour, mais n'est pas compté dans la paie.",
};

/** Ligne d'option avec interrupteur: toute la ligne est cliquable. */
function OptionRow({
  checked,
  onChange,
  title,
  hint,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  hint: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-line">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-paper/60"
      >
        <span>
          <span className="block text-sm font-semibold text-ink">{title}</span>
          <span className="block text-xs text-ink-soft">{hint}</span>
        </span>
        <Toggle decorative checked={checked} />
      </button>
      {checked && children && <div className="border-t border-dashed border-line px-3 py-2.5">{children}</div>}
    </div>
  );
}

export function EmployeeForm({ employee, onClose, onSubmit }: EmployeeFormProps) {
  const [name, setName] = useState(employee?.name ?? "");
  const [role, setRole] = useState<Role>(employee?.role ?? "technicien");
  const [fixed, setFixed] = useState(Boolean(employee?.monthlySalary));
  const [salary, setSalary] = useState(employee?.monthlySalary ? String(employee.monthlySalary) : "");
  const [doesScans, setDoesScans] = useState(employee?.doesScans ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salaryAllowed = canHaveFixedSalary(role);
  const scansAllowed = canDoBonusScans(role);

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    const monthlySalary = salaryAllowed && fixed ? Number(salary) : null;
    if (monthlySalary !== null && !(monthlySalary > 0)) {
      setError("Indiquez le montant du salaire mensuel.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), role, monthlySalary, doesScans: scansAllowed && doesScans });
    } catch {
      setError("Échec de l'enregistrement. Réessayez.");
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={employee ? "Modifier l'employé" : "Nouvel employé"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className={FIELD_LABEL}>Nom</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={TEXT_INPUT}
            placeholder="Ex : Yasmine"
            autoFocus={!employee}
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className={FIELD_LABEL}>Rôle</span>
          <Select
            label="Rôle"
            value={role}
            onChange={setRole}
            options={ROLES.map((r) => ({ value: r, label: <RoleBadge role={r} /> }))}
          />
          {ROLE_HINTS[role] && <p className="text-xs text-ink-soft">{ROLE_HINTS[role]}</p>}
        </div>

        {(salaryAllowed || scansAllowed) && (
          <div className="flex flex-col gap-2">
            <span className={FIELD_LABEL}>Rémunération</span>
            {salaryAllowed && (
              <OptionRow
                checked={fixed}
                onChange={setFixed}
                title="Salaire mensuel fixe"
                hint="Le même montant chaque mois, quelle que soit la présence."
              >
                <label className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-semibold text-ink">Montant par mois</span>
                  <span className="flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 focus-within:border-accent">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={salary}
                      onChange={(e) => {
                        setSalary(e.target.value.replace(/\D/g, "").slice(0, 8));
                        setError(null);
                      }}
                      className="w-28 bg-transparent text-right font-mono text-base font-semibold tabular-nums text-ink outline-none placeholder:text-ink-faint"
                      aria-label="Salaire mensuel en DA"
                    />
                    <span className="font-mono text-xs font-semibold text-ink-soft">DA</span>
                  </span>
                </label>
              </OptionRow>
            )}
            {scansAllowed && (
              <OptionRow
                checked={doesScans}
                onChange={setDoesScans}
                title="Fait aussi des scanners"
                hint="Permet d'ajouter des scanners payés en plus, dans le calendrier."
              />
            )}
          </div>
        )}

        {error && <p className="rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
