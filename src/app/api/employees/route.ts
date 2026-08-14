import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { addEmployee, readEmployees } from "@/lib/db";

const createSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  role: z.enum(["technicien", "receptionniste", "manipulateur"]),
});

export async function GET() {
  const employees = await readEmployees();
  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  const newEmployee = {
    id: nanoid(8),
    name: parsed.data.name,
    role: parsed.data.role,
    active: true,
  };
  await addEmployee(newEmployee);

  return NextResponse.json(newEmployee, { status: 201 });
}
