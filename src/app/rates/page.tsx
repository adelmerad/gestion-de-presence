import { readRates } from "@/lib/db";
import { RatesClient } from "@/components/RatesClient";

export const dynamic = "force-dynamic";

export default async function RatesPage() {
  const rates = await readRates();
  return <RatesClient initialRates={rates} />;
}
