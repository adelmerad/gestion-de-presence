"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Employee, Role, ROLE_LABELS } from "@/lib/types";
import { ROLE_STYLES } from "@/lib/roleStyles";
import { Button } from "./ui/Button";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeesClientProps {
  initialEmployees: Employee[];
}

export function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [formTarget, setFormTarget] = useState<Employee | null | "new">(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

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

  async function handleToggleActive(employee: Employee) {
    if (
      employee.active &&
      !window.confirm(
        `Désactiver ${employee.name} ? Il/elle n'apparaîtra plus dans le calendrier, mais son historique de paie sera conservé.`,
      )
    ) {
      return;
    }
    setPendingToggleId(employee.id);
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !employee.active }),
      });
      if (!res.ok) throw new Error("toggle failed");
      const updated: Employee = await res.json();
      setEmployees((prev) => prev.map((e) => (e.id === employee.id ? updated : e)));
    } finally {
      setPendingToggleId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Employés</h1>
        <Button onClick={() => setFormTarget("new")}>
          <Plus size={16} />
          Ajouter un employé
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs font-medium text-text-muted">
              <th className="px-3 py-2.5 sm:px-4">Nom</th>
              <th className="px-3 py-2.5 sm:px-4">Rôle</th>
              <th className="hidden px-4 py-2.5 sm:table-cell">Statut</th>
              <th className="px-3 py-2.5 text-right sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((emp) => {
              const style = ROLE_STYLES[emp.role];
              return (
                <tr key={emp.id} className={emp.active ? "" : "opacity-50"}>
                  <td className="px-3 py-3 font-medium text-text-primary sm:px-4">{emp.name}</td>
                  <td className="px-3 py-3 sm:px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-1.5 py-1.5 text-xs font-medium sm:px-2 sm:py-0.5 ${style.bg} ${style.text}`}
                      title={ROLE_LABELS[emp.role]}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className="hidden sm:inline">{ROLE_LABELS[emp.role]}</span>
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-text-muted sm:table-cell">{emp.active ? "Actif" : "Inactif"}</td>
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" onClick={() => setFormTarget(emp)} aria-label="Modifier">
                        <Pencil size={14} />
                        <span className="hidden sm:inline">Modifier</span>
                      </Button>
                      <Button
                        variant={emp.active ? "danger" : "secondary"}
                        disabled={pendingToggleId === emp.id}
                        onClick={() => handleToggleActive(emp)}
                      >
                        {emp.active ? "Désactiver" : "Réactiver"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    </div>
  );
}
