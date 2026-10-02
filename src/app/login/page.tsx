"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { FIELD_LABEL, TEXT_INPUT } from "@/components/ui/styles";
import { login } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Panneau de marque */}
      <div className="relative overflow-hidden bg-ink px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-paper md:flex md:w-[44%] md:flex-col md:justify-between md:p-12">
        <BrandMark size={520} className="pointer-events-none absolute -right-52 -top-56 text-accent opacity-[0.13] md:-right-44 md:top-1/2 md:-translate-y-1/2 md:opacity-20" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent text-white">
            <BrandMark size={29} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-2xl text-white">Présences</span>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-paper/50">CIM Dr Merad</span>
          </span>
        </div>
        <p className="relative mt-8 max-w-sm font-display text-[28px] leading-[1.15] text-white md:text-[40px]">
          Les présences et la paie du centre, <em className="text-accent-wash/80">au même endroit.</em>
        </p>
      </div>

      {/* Formulaire */}
      <div className="flex flex-1 items-start px-6 py-10 md:items-center md:px-16">
        <form action={formAction} className="w-full max-w-sm">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Accès réservé</p>
          <h1 className="mb-7 font-display text-[40px] leading-none text-ink">Connexion</h1>

          <label className="flex flex-col gap-1.5">
            <span className={FIELD_LABEL}>Mot de passe</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              required
              autoFocus
              className={`${TEXT_INPUT} h-11 text-base`}
            />
          </label>
          {error && <p className="mt-3 rounded-md bg-danger-wash px-3 py-2 text-sm font-medium text-danger">{error}</p>}

          <Button type="submit" disabled={pending} className="mt-5 h-11 w-full">
            {pending ? "Connexion…" : "Se connecter"}
            {!pending && <ArrowRight size={16} strokeWidth={2.4} />}
          </Button>
        </form>
      </div>
    </div>
  );
}
