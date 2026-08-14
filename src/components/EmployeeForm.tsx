"use client";

import { useState } from "react";
import { Employee, Role, ROLE_LABELS } from "@/lib/types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

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
      title={employee ? "Modifier l'employé" : "Ajouter un employé"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Nom</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            placeholder="Ex: Yasmine"
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Rôle</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    </Modal>
  );
}
