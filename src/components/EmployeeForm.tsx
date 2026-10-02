"use client";

import { useState } from "react";
import { Employee, Role } from "@/lib/types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { RoleBadge } from "./ui/RoleBadge";
import { FIELD_LABEL, TEXT_INPUT } from "./ui/styles";

interface EmployeeFormProps {
  employee: Employee | null; // null = création
  onClose: () => void;
  onSubmit: (data: { name: string; role: Role }) => Promise<void>;
}

const ROLES: Role[] = ["technicien", "receptionniste", "manipulateur"];

export function EmployeeForm({ employee, onClose, onSubmit }: EmployeeFormProps) {
  const [name, setName] = useState(employee?.name ?? "");
  const [role, setRole] = useState<Role>(employee?.role ?? "technicien");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), role });
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
            autoFocus
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
          {role === "manipulateur" && (
            <p className="text-xs text-ink-soft">Payé au nombre de scanners effectués, pas à la journée.</p>
          )}
        </div>
        {error && <p className="rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
