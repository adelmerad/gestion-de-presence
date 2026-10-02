"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { login } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <div className="mx-auto mt-10 w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lock size={18} className="text-text-muted" />
        <h1 className="text-base font-semibold text-text-primary">Connexion</h1>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Mot de passe</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            autoFocus
            className="rounded-lg border border-border px-3 py-2 text-base focus:border-primary-500 focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
