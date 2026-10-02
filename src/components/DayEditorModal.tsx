"use client";

import { useState } from "react";
import { AttendanceDay, AttendanceValue, Employee, Rates, ROLE_LABELS } from "@/lib/types";
import { dayTotal } from "@/lib/payroll";
import { formatDayLong, parseISO } from "@/lib/dates";
import { Modal } from "./ui/Modal";
import { Toggle } from "./ui/Toggle";
import { NumberStepper } from "./ui/NumberStepper";
import { Button } from "./ui/Button";
import { Avatar } from "./ui/Avatar";

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
  const presentCount = activeEmployees.filter((e) => draft[e.id] !== undefined).length;

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
      description={`${presentCount} présent${presentCount > 1 ? "s" : ""} sur ${activeEmployees.length}`}
      footer={
        <>
          <div className="mr-auto flex flex-col justify-center leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Total du jour</span>
            <span className="font-mono text-base font-bold tabular-nums text-accent">{total.toLocaleString("fr-FR")} DA</span>
          </div>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </>
      }
    >
      <ul className="-mx-2 flex flex-col">
        {activeEmployees.map((emp) => {
          const value = draft[emp.id];
          const identity = (
            <span className="flex min-w-0 items-center gap-3">
              <Avatar employee={emp} dimmed={value === undefined} />
              <span className="min-w-0 text-left">
                <span className="block truncate text-[15px] font-semibold leading-tight text-ink">{emp.name}</span>
                <span className="block text-xs text-ink-soft">{ROLE_LABELS[emp.role]}</span>
              </span>
            </span>
          );

          return (
            <li key={emp.id}>
              {emp.role === "manipulateur" ? (
                <div className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5">
                  {identity}
                  <NumberStepper
                    label={`Scanners de ${emp.name}`}
                    value={typeof value === "number" ? value : 0}
                    onChange={(n) => setValue(emp.id, n > 0 ? n : undefined)}
                  />
                </div>
              ) : (
                // Toute la ligne est l'interrupteur: plus facile à toucher sur téléphone.
                <button
                  type="button"
                  role="switch"
                  aria-checked={value === true}
                  onClick={() => setValue(emp.id, value === true ? undefined : true)}
                  className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-paper/70"
                >
                  {identity}
                  <Toggle decorative checked={value === true} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {error && <p className="mt-3 rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}
    </Modal>
  );
}
