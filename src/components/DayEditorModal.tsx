"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { AttendanceDay, AttendanceValue, canDoBonusScans, Employee, isDoctor, Rates, ROLE_LABELS } from "@/lib/types";
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

const SECTION_TITLE = "mb-1 mt-1 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft";

function Identity({ employee, dimmed, subtitle }: { employee: Employee; dimmed: boolean; subtitle?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar employee={employee} dimmed={dimmed} />
      <span className="min-w-0 text-left">
        <span className="block truncate text-[15px] font-semibold leading-tight text-ink">{employee.name}</span>
        <span className="block text-xs text-ink-soft">{subtitle ?? ROLE_LABELS[employee.role]}</span>
      </span>
    </span>
  );
}

export function DayEditorModal({ dateISO, employees, entries, rates, onClose, onSave }: DayEditorModalProps) {
  const [draft, setDraft] = useState<AttendanceDay>(entries);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doctors = employees.filter((e) => e.active && isDoctor(e.role));
  const staff = employees.filter((e) => e.active && !isDoctor(e.role));
  const total = dayTotal(employees, draft as Record<string, AttendanceValue>, rates);
  const presentCount = staff.filter((e) => draft[e.id] !== undefined).length;
  const doctorOfDay = doctors.find((d) => draft[d.id] !== undefined);

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

  /** Un seul médecin par jour: en choisir un retire les autres. Recliquer le retire. */
  function chooseDoctor(doctor: Employee) {
    setDraft((prev) => {
      const next = { ...prev };
      const wasSelected = next[doctor.id] !== undefined;
      for (const d of doctors) delete next[d.id];
      if (!wasSelected) next[doctor.id] = doctor.role === "medecin" ? 0 : true;
      return next;
    });
  }

  async function handleSave() {
    if (doctorOfDay?.role === "medecin" && !((draft[doctorOfDay.id] as number) > 0)) {
      setError(`Indiquez le montant à verser au ${doctorOfDay.name}.`);
      return;
    }
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
      description={`${doctorOfDay ? doctorOfDay.name : "Aucun médecin"} · ${presentCount} présent${presentCount > 1 ? "s" : ""} sur ${staff.length}`}
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
      {doctors.length > 0 && (
        <section className="-mx-2 mb-3 border-b border-dashed border-line pb-3">
          <h3 className={SECTION_TITLE}>Médecin du jour</h3>
          <ul role="radiogroup" aria-label="Médecin du jour" className="flex flex-col">
            {doctors.map((doc) => {
              const value = draft[doc.id];
              const selected = value !== undefined;
              return (
                <li key={doc.id} className={`rounded-md transition-colors ${selected ? "bg-doc-wash/60" : ""}`}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => chooseDoctor(doc)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors ${
                      selected ? "" : "hover:bg-paper/70"
                    }`}
                  >
                    <Identity
                      employee={doc}
                      dimmed={!selected}
                      subtitle={doc.role === "chef" ? "Médecin chef · non compté dans la paie" : "Remplaçant · montant du jour"}
                    />
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selected ? "border-accent bg-accent text-white" : "border-line"
                      }`}
                    >
                      {selected && <Check size={14} strokeWidth={3} />}
                    </span>
                  </button>
                  {selected && doc.role === "medecin" && (
                    <label className="flex items-center justify-between gap-3 px-2 pb-3 pl-14">
                      <span className="text-[13px] font-semibold text-ink">Montant du jour</span>
                      <span className="flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 focus-within:border-accent">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          placeholder="0"
                          value={typeof value === "number" && value > 0 ? String(value) : ""}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 7);
                            setValue(doc.id, digits ? Number(digits) : 0);
                          }}
                          className="w-24 bg-transparent text-right font-mono text-base font-semibold tabular-nums text-ink outline-none placeholder:text-ink-faint"
                          aria-label={`Montant versé au ${doc.name}`}
                        />
                        <span className="font-mono text-xs font-semibold text-ink-soft">DA</span>
                      </span>
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="-mx-2">
        {doctors.length > 0 && <h3 className={SECTION_TITLE}>Personnel</h3>}
        <ul className="flex flex-col">
          {staff.map((emp) => {
            const value = draft[emp.id];
            return (
              <li key={emp.id}>
                {emp.role === "manipulateur" ? (
                  <div className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5">
                    <Identity employee={emp} dimmed={value === undefined} />
                    <NumberStepper
                      label={`Scanners de ${emp.name}`}
                      value={typeof value === "number" ? value : 0}
                      onChange={(n) => setValue(emp.id, n > 0 ? n : undefined)}
                    />
                  </div>
                ) : (
                  <>
                    {/* Toute la ligne est l'interrupteur: plus facile à toucher sur téléphone. */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={value !== undefined}
                      onClick={() => setValue(emp.id, value === undefined ? true : undefined)}
                      className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-paper/70"
                    >
                      <Identity employee={emp} dimmed={value === undefined} />
                      <Toggle decorative checked={value !== undefined} />
                    </button>
                    {/* Seulement pour qui fait des scanners (ou a déjà des scanners ce jour-là). */}
                    {value !== undefined && canDoBonusScans(emp.role) && (emp.doesScans || typeof value === "number") && (
                      <div className="-mt-1 flex items-center justify-between gap-3 pb-2 pl-14 pr-2">
                        {typeof value === "number" ? (
                          <>
                            <span className="text-[13px] font-semibold text-manip">
                              Scanners en plus
                              <span className="ml-1.5 font-mono text-xs font-normal text-ink-soft">
                                +{(value * rates.scanBonus).toLocaleString("fr-FR")} DA
                              </span>
                            </span>
                            <NumberStepper
                              label={`Scanners faits en plus par ${emp.name}`}
                              value={value}
                              onChange={(n) => setValue(emp.id, n > 0 ? n : true)}
                            />
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setValue(emp.id, 1)}
                            className="-ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-manip-wash hover:text-manip"
                          >
                            <Plus size={14} strokeWidth={2.4} />
                            Scanners en plus
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {error && <p className="mt-3 rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}
    </Modal>
  );
}
