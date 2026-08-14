import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setAttendanceDay } from "@/lib/db";
import { isFridayISO } from "@/lib/dates";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const putSchema = z.object({
  entries: z.record(z.string(), z.union([z.literal(true), z.number().int().min(0)])),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  if (isFridayISO(date)) {
    return NextResponse.json({ error: "Le vendredi est un jour de repos, aucune présence ne peut être saisie." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  // 0 scanner (ou absent) = pas d'entrée du tout pour cet employé ce jour-là.
  const cleanedEntries: Record<string, true | number> = {};
  for (const [employeeId, value] of Object.entries(parsed.data.entries)) {
    if (value === true || value > 0) {
      cleanedEntries[employeeId] = value;
    }
  }

  const entries = await setAttendanceDay(date, cleanedEntries);

  return NextResponse.json({ date, entries });
}
