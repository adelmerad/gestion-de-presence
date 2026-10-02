"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, RotateCcw, UserMinus } from "lucide-react";
import { Employee, Role } from "@/lib/types";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Menu, MenuItem, MenuSeparator } from "./ui/Menu";
import { Avatar } from "./ui/Avatar";
import { PageHeader } from "./ui/PageHeader";
import { RoleBadge, StatusBadge } from "./ui/RoleBadge";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeesClientProps {
  initialEmployees: Employee[];
}

const COLUMNS = "md:grid md:grid-cols-[minmax(0,1fr)_11rem_7rem_2.5rem] md:items-center md:gap-4";

export function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [formTarget, setFormTarget] = useState<Employee | null | "new">(null);
  const [confirmTarget, setConfirmTarget] = useState<Employee | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  const activeCount = employees.filter((e) => e.active).length;

  async function handleCreate(data: { name: string; role: Role }) {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("create failed");
    const created: Employee = await res.json();
    setEmployees((prev) => [...prev, created]);
    setFormTarget(null);
  }

  async function handleUpdate(id: string, data: { name: string; role: Role }) {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("update failed");
    const updated: Employee = await res.json();
    setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
    setFormTarget(null);
  }

  async function setActive(employee: Employee, active: boolean) {
    setPendingToggleId(employee.id);
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) return;
      const updated: Employee = await res.json();
      setEmployees((prev) => prev.map((e) => (e.id === employee.id ? updated : e)));
    } finally {
      setPendingToggleId(null);
      setConfirmTarget(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={`Équipe · ${activeCount} actif${activeCount > 1 ? "s" : ""}`}
        title="Employés"
        actions={
          <Button onClick={() => setFormTarget("new")}>
            <Plus size={16} strokeWidth={2.4} />
            Ajouter
          </Button>
        }
      />

      <div className="overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        <div className={`hidden border-b border-line bg-paper/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft ${COLUMNS}`}>
          <span>Nom</span>
          <span>Rôle</span>
          <span>Statut</span>
          <span />
        </div>
        <ul className="divide-y divide-line">
          {employees.map((emp) => (
            <li
              key={emp.id}
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper/40 md:px-5 ${COLUMNS} ${
                pendingToggleId === emp.id ? "opacity-50" : ""
              }`}
            >
              <div className={`flex min-w-0 flex-1 items-center gap-3 ${emp.active ? "" : "opacity-55"}`}>
                <Avatar employee={emp} />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink">{emp.name}</p>
                  {/* Téléphone: rôle et statut sous le nom. */}
                  <div className="mt-1 flex items-center gap-2.5 md:hidden">
                    <RoleBadge role={emp.role} />
                    {!emp.active && <StatusBadge active={false} />}
                  </div>
                </div>
              </div>
              <div className={`hidden md:block ${emp.active ? "" : "opacity-55"}`}>
                <RoleBadge role={emp.role} />
              </div>
              <div className="hidden md:block">
                <StatusBadge active={emp.active} />
              </div>
              <Menu
                trigger={
                  <Button variant="ghost" size="icon" aria-label={`Actions pour ${emp.name}`}>
                    <MoreHorizontal size={18} />
                  </Button>
                }
              >
                <MenuItem icon={<Pencil size={15} />} onSelect={() => setFormTarget(emp)}>
                  Modifier
                </MenuItem>
                <MenuSeparator />
                {emp.active ? (
                  <MenuItem tone="danger" icon={<UserMinus size={15} />} onSelect={() => setConfirmTarget(emp)}>
                    Désactiver
                  </MenuItem>
                ) : (
                  <MenuItem icon={<RotateCcw size={15} />} onSelect={() => setActive(emp, true)}>
                    Réactiver
                  </MenuItem>
                )}
              </Menu>
            </li>
          ))}
        </ul>
      </div>

      {formTarget === "new" && (
        <EmployeeForm employee={null} onClose={() => setFormTarget(null)} onSubmit={handleCreate} />
      )}
      {formTarget && formTarget !== "new" && (
        <EmployeeForm
          employee={formTarget}
          onClose={() => setFormTarget(null)}
          onSubmit={(data) => handleUpdate(formTarget.id, data)}
        />
      )}

      {confirmTarget && (
        <Modal
          open
          onOpenChange={(open) => !open && setConfirmTarget(null)}
          title={`Désactiver ${confirmTarget.name} ?`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmTarget(null)}>
                Annuler
              </Button>
              <Button
                variant="danger"
                disabled={pendingToggleId === confirmTarget.id}
                onClick={() => setActive(confirmTarget, false)}
              >
                Désactiver
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-ink-soft">
            {confirmTarget.name} n&apos;apparaîtra plus dans le calendrier. Son historique de paie est conservé, et vous
            pourrez le/la réactiver à tout moment.
          </p>
        </Modal>
      )}
    </>
  );
}
