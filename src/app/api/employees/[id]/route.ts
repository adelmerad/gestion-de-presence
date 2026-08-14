import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateEmployee } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.enum(["technicien", "receptionniste", "manipulateur"]).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  const updated = await updateEmployee(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Employé introuvable" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
