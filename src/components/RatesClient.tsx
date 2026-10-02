"use client";

import { ReactNode, useState } from "react";
import { Check } from "lucide-react";
import { RateKey, Rates } from "@/lib/types";
import { Button } from "./ui/Button";
import { PageHeader } from "./ui/PageHeader";
import { RoleBadge } from "./ui/RoleBadge";

interface RatesClientProps {
  initialRates: Rates;
}

const SCAN_BONUS_BADGE = (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-manip-wash py-0.5 pl-1.5 pr-2 text-xs font-semibold text-manip">
    <span className="h-1.5 w-1.5 rounded-full bg-manip" />
    Scanner en plus
  </span>
);

const FIELDS: { key: RateKey; badge: ReactNode; unit: string; hint: string }[] = [
  { key: "technicien", badge: <RoleBadge role="technicien" />, unit: "par jour", hint: "Versé pour chaque jour de présence." },
  { key: "receptionniste", badge: <RoleBadge role="receptionniste" />, unit: "par jour", hint: "Versé pour chaque jour de présence." },
  { key: "manipulateur", badge: <RoleBadge role="manipulateur" />, unit: "par scanner", hint: "Multiplié par le nombre de scanners du jour." },
  { key: "menage", badge: <RoleBadge role="menage" />, unit: "par jour", hint: "Versé pour chaque jour travaillé." },
  {
    key: "scanBonus",
    badge: SCAN_BONUS_BADGE,
    unit: "par scanner",
    hint: "Ajouté au salaire du jour quand un(e) technicien(ne) ou réceptionniste fait un scanner.",
  },
];

export function RatesClient({ initialRates }: RatesClientProps) {
  const [rates, setRates] = useState<Rates>(initialRates);
  const [draft, setDraft] = useState<Rates>(initialRates);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = FIELDS.some((f) => draft[f.key] !== rates[f.key]);

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
    <>
      <PageHeader eyebrow="Paie" title="Tarifs" />

      <p className="mb-5 max-w-xl text-sm leading-relaxed text-ink-soft">
        Montant versé à chaque employé selon son rôle. Une modification s&apos;applique à tous les calculs, y compris les
        mois passés. Les médecins remplaçants n&apos;ont pas de tarif : leur montant est saisi chaque jour dans le
        calendrier.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {FIELDS.map(({ key, badge, unit, hint }) => {
          const changed = draft[key] !== rates[key];
          return (
            <label
              key={key}
              className={`group flex cursor-text flex-col rounded-[10px] border bg-surface p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors focus-within:border-accent ${
                changed ? "border-accent/60" : "border-line hover:border-ink-faint/60"
              }`}
            >
              <span className="flex items-center justify-between">
                {badge}
                <span className="text-xs font-medium text-ink-soft">{unit}</span>
              </span>
              <span className="mt-4 flex items-baseline gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={draft[key]}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setDraft((prev) => ({ ...prev, [key]: Number.isNaN(n) ? 0 : n }));
                  }}
                  className="w-full min-w-0 bg-transparent font-mono text-[32px] font-semibold tabular-nums leading-none text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="font-mono text-sm font-semibold text-ink-soft">DA</span>
              </span>
              <span className="mt-3 border-t border-dashed border-line pt-2.5 text-xs text-ink-soft">{hint}</span>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-4 rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <Button variant="primary" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Enregistrement…" : "Enregistrer les tarifs"}
        </Button>
        {dirty && (
          <Button variant="ghost" onClick={() => setDraft(rates)} disabled={saving}>
            Annuler
          </Button>
        )}
        {!dirty && savedAt && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-success">
            <Check size={15} strokeWidth={2.6} /> Enregistré
          </span>
        )}
      </div>
    </>
  );
}
