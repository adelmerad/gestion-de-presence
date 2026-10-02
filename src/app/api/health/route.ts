import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { envValue } from "@/lib/env";

export const dynamic = "force-dynamic";

// Diagnostic de la connexion à la base (protégé par le mot de passe via proxy.ts).
// N'affiche jamais le token, seulement s'il est présent et sa longueur.
export async function GET() {
  const url = envValue("UPSTASH_REDIS_REST_URL", "KV_REST_API_URL");
  const token = envValue("UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN");
  const report: Record<string, unknown> = {
    variables: Object.keys(process.env).filter((k) => /UPSTASH|KV_|REDIS|APP_PASSWORD/.test(k)),
    url: url ?? null,
    tokenLength: token?.length ?? 0,
  };
  if (url && token) {
    try {
      report.ping = await new Redis({ url, token }).ping();
    } catch (err) {
      report.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    }
  }
  return NextResponse.json(report);
}
