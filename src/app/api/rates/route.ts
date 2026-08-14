import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readRates, updateRates } from "@/lib/db";

const patchSchema = z.object({
  technicien: z.number().int().min(0).optional(),
  receptionniste: z.number().int().min(0).optional(),
  manipulateur: z.number().int().min(0).optional(),
});

export async function GET() {
  const rates = await readRates();
  return NextResponse.json(rates);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  const updated = await updateRates(parsed.data);

  return NextResponse.json(updated);
}
