"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Rates, ROLE_LABELS } from "@/lib/types";
import { ROLE_STYLES } from "@/lib/roleStyles";
import { Button } from "./ui/Button";

interface RatesClientProps {
  initialRates: Rates;
}

const FIELDS: { role: keyof Rates; unit: string }[] = [
  { role: "technicien", unit: "par jour" },
  { role: "receptionniste", unit: "par jour" },
  { role: "manipulateur", unit: "par scanner" },
];

export function RatesClient({ initialRates }: RatesClientProps) {
  const [rates, setRates] = useState<Rates>(initialRates);
  const [draft, setDraft] = useState<Rates>(initialRates);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = FIELDS.some((f) => draft[f.role] !== rates[f.role]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("save failed");
      const updated: Rates = await res.json();
      setRates(updated);
      setDraft(updated);
      setSavedAt(Date.now());
    } catch {
      setError("Échec de l'enregistrement. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-text-primary">Tarifs</h1>
      <div className="max-w-lg rounded-xl border border-border bg-surface p-5 shadow-sm">
        <p className="mb-4 text-sm text-text-muted">
          Montant payé par employé selon son rôle. Pour Nadjib (manipulateur), le montant est appliqué par scanner
          effectué, pas par jour.
        </p>
        <div className="flex flex-col divide-y divide-border">
          {FIELDS.map(({ role, unit }) => {
            const style = ROLE_STYLES[role];
            return (
              <div key={role} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{ROLE_LABELS[role]}</p>
                    <p className="text-xs text-text-muted">{unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={draft[role]}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setDraft((prev) => ({ ...prev, [role]: Number.isNaN(n) ? 0 : n }));
                    }}
                    className="w-24 rounded-lg border border-border px-3 py-1.5 text-right text-sm tabular-nums focus:border-primary-500 focus:outline-none"
                  />
                  <span className="text-sm text-text-muted">DA</span>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <div className="mt-4 flex items-center gap-3">
          <Button variant="primary" onClick={handleSave} disabled={!dirty || saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {!dirty && savedAt && (
            <span className="flex items-center gap-1 text-sm text-primary-700">
              <Check size={14} /> Enregistré
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
