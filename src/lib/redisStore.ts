import { Redis } from "@upstash/redis";
import { AttendanceDay, AttendanceStore, Employee, RateKey, Rates } from "./types";
import { SEED_EMPLOYEES, SEED_RATES } from "./seed";
import { envValue } from "./env";

// Stockage en ligne (Upstash Redis), utilisé quand l'app est hébergée.
// Chaque employé / jour / tarif est un champ séparé d'un hash Redis: chaque
// écriture ne touche que sa propre donnée, donc deux modifications simultanées
// (ex: depuis deux téléphones) ne peuvent pas s'écraser l'une l'autre.
const KEY_EMPLOYEES = "employees"; // hash id -> Employee (JSON)
const KEY_EMPLOYEE_ORDER = "employees:order"; // liste des ids, ordre d'ajout
const KEY_ATTENDANCE = "attendance"; // hash date ISO -> AttendanceDay (JSON)
const KEY_RATES = "rates"; // hash rôle -> montant
const KEY_SEEDED = "seeded";

const url = () => envValue("UPSTASH_REDIS_REST_URL", "KV_REST_API_URL");
const token = () => envValue("UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN");

export function isRedisConfigured(): boolean {
  return Boolean(url() && token());
}

let client: Redis | null = null;
function redis(): Redis {
  // Sérialisation JSON faite à la main: on sait exactement ce qui est stocké.
  client ??= new Redis({ url: url()!, token: token()!, automaticDeserialization: false });
  return client;
}

/**
 * Lit un hash entier. Sans désérialisation automatique, le client renvoie
 * HGETALL tel quel: une liste plate [champ, valeur, champ, valeur, ...].
 */
async function readHash(key: string): Promise<Record<string, string>> {
  const raw = (await redis().hgetall(key)) as unknown;
  if (!Array.isArray(raw)) return (raw as Record<string, string> | null) ?? {};
  const hash: Record<string, string> = {};
  for (let i = 0; i < raw.length; i += 2) hash[raw[i]] = raw[i + 1];
  return hash;
}

let seeded = false;
async function ensureSeed(): Promise<void> {
  if (seeded) return;
  // SET NX: une seule instance gagne, même si plusieurs démarrent en même temps.
  const first = await redis().set(KEY_SEEDED, "1", { nx: true });
  if (first) {
    const tx = redis().multi();
    for (const e of SEED_EMPLOYEES) {
      tx.hset(KEY_EMPLOYEES, { [e.id]: JSON.stringify(e) });
      tx.rpush(KEY_EMPLOYEE_ORDER, e.id);
    }
    tx.hset(KEY_RATES, SEED_RATES);
    await tx.exec();
  }
  seeded = true;
}

export async function readEmployees(): Promise<Employee[]> {
  await ensureSeed();
  const [order, all] = await Promise.all([
    redis().lrange(KEY_EMPLOYEE_ORDER, 0, -1),
    readHash(KEY_EMPLOYEES),
  ]);
  return order.flatMap((id) => (all[id] ? [JSON.parse(all[id]) as Employee] : []));
}

export async function addEmployee(employee: Employee): Promise<void> {
  await ensureSeed();
  await redis()
    .multi()
    .hset(KEY_EMPLOYEES, { [employee.id]: JSON.stringify(employee) })
    .rpush(KEY_EMPLOYEE_ORDER, employee.id)
    .exec();
}

export async function updateEmployee(
  id: string,
  patch: Partial<Pick<Employee, "name" | "role" | "active">>,
): Promise<Employee | null> {
  await ensureSeed();
  const raw = await redis().hget<string>(KEY_EMPLOYEES, id);
  if (!raw) return null;
  const updated: Employee = { ...(JSON.parse(raw) as Employee), ...patch };
  await redis().hset(KEY_EMPLOYEES, { [id]: JSON.stringify(updated) });
  return updated;
}

export async function readAttendance(): Promise<AttendanceStore> {
  await ensureSeed();
  const all = await readHash(KEY_ATTENDANCE);
  const store: AttendanceStore = {};
  for (const [date, raw] of Object.entries(all)) {
    store[date] = JSON.parse(raw) as AttendanceDay;
  }
  return store;
}

export async function setAttendanceDay(dateISO: string, entries: AttendanceDay): Promise<AttendanceDay> {
  await ensureSeed();
  if (Object.keys(entries).length === 0) {
    await redis().hdel(KEY_ATTENDANCE, dateISO);
  } else {
    await redis().hset(KEY_ATTENDANCE, { [dateISO]: JSON.stringify(entries) });
  }
  return entries;
}

export async function readRates(): Promise<Rates> {
  await ensureSeed();
  const all = await readHash(KEY_RATES);
  const rates = { ...SEED_RATES };
  for (const role of Object.keys(rates) as RateKey[]) {
    if (all[role] !== undefined) rates[role] = Number(all[role]);
  }
  return rates;
}

export async function updateRates(patch: Partial<Rates>): Promise<Rates> {
  await ensureSeed();
  if (Object.keys(patch).length > 0) {
    await redis().hset(KEY_RATES, patch);
  }
  return readRates();
}
