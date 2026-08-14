import { readAttendance, readEmployees, readRates } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

// Les données viennent d'un fichier local qui change en permanence:
// cette page ne doit jamais être mise en cache/pré-générée statiquement.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [employees, attendance, rates] = await Promise.all([readEmployees(), readAttendance(), readRates()]);

  return <HomeClient employees={employees} initialAttendance={attendance} rates={rates} />;
}
