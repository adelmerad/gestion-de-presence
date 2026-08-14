import { NextResponse } from "next/server";
import { readAttendance } from "@/lib/db";

export async function GET() {
  const store = await readAttendance();
  return NextResponse.json(store);
}
