import { readEmployees } from "@/lib/db";
import { EmployeesClient } from "@/components/EmployeesClient";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await readEmployees();
  return <EmployeesClient initialEmployees={employees} />;
}
