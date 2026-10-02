// Protection par mot de passe unique, active seulement quand APP_PASSWORD est
// défini (version en ligne). Sur l'ordinateur, sans APP_PASSWORD, pas de login.
import { envValue } from "./env";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 an: on reste connecté sur le téléphone

export function appPassword(): string | null {
  return envValue("APP_PASSWORD") ?? null;
}

export function authEnabled(): boolean {
  return appPassword() !== null;
}

/** Valeur du cookie de session. Change automatiquement si le mot de passe change. */
export async function sessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`gestion-session:${password.trim()}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  const password = appPassword();
  if (!password) return true;
  return cookieValue === (await sessionToken(password));
}
