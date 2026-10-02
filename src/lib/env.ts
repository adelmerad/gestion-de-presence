/**
 * Lit une variable d'environnement en ignorant les espaces et guillemets autour
 * de la valeur (erreurs de copier-coller fréquentes dans l'interface Vercel).
 */
export function envValue(...names: string[]): string | undefined {
  for (const name of names) {
    const value = (process.env[name] ?? "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();
    if (value) return value;
  }
  return undefined;
}
