"use client";

import { useState } from "react";
import { AttendanceDay, AttendanceValue, Employee, Rates } from "@/lib/types";
import { dayTotal } from "@/lib/payroll";
import { formatDayLong, parseISO } from "@/lib/dates";
import { ROLE_STYLES } from "@/lib/roleStyles";
import { Modal } from "./ui/Modal";
import { Toggle } from "./ui/Toggle";
import { NumberStepper } from "./ui/NumberStepper";
import { Button } from "./ui/Button";

interface DayEditorModalProps {
  dateISO: string;
  employees: Employee[];
  entries: AttendanceDay;
  rates: Rates;
  onClose: () => void;
  onSave: (dateISO: string, entries: AttendanceDay) => Promise<void>;
}

export function DayEditorModal({ dateISO, employees, entries, rates, onClose, onSave }: DayEditorModalProps) {
  const [draft, setDraft] = useState<AttendanceDay>(entries);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeEmployees = employees.filter((e) => e.active);
  const total = dayTotal(employees, draft as Record<string, AttendanceValue>, rates);

  function setValue(employeeId: string, value: AttendanceValue | undefined) {
    setDraft((prev) => {
      const next = { ...prev };
      if (value === undefined) {
        delete next[employeeId];
      } else {
        next[employeeId] = value;
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave(dateISO, draft);
    } catch {
      setError("Échec de l'enregistrement. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={formatDayLong(parseISO(dateISO))}
      description="Cochez les employés présents et saisissez le nombre de scanners pour Nadjib."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col divide-y divide-border">
        {activeEmployees.map((emp) => {
          const style = ROLE_STYLES[emp.role];
          const value = draft[emp.id];
          return (
            <div key={emp.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                <span className="text-sm font-medium text-text-primary">{emp.name}</span>
              </div>
              {emp.role === "manipulateur" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">scanners</span>
                  <NumberStepper
                    value={typeof value === "number" ? value : 0}
                    onChange={(n) => setValue(emp.id, n > 0 ? n : undefined)}
                  />
                </div>
              ) : (
                <Toggle
                  checked={value === true}
                  onChange={(checked) => setValue(emp.id, checked ? true : undefined)}
                  label={`Présence de ${emp.name}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <div className="mt-4 flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2.5">
        <span className="text-sm font-medium text-primary-700">Total du jour</span>
        <span className="text-base font-semibold text-primary-700">{total.toLocaleString("fr-FR")} DA</span>
      </div>
    </Modal>
  );
}
