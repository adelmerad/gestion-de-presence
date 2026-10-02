import fs from "fs/promises";
import path from "path";
import { AttendanceDay, AttendanceStore, Employee, Rates } from "./types";
import { SEED_EMPLOYEES, SEED_RATES } from "./seed";
import * as redisStore from "./redisStore";

// En ligne (variables Upstash présentes): stockage Redis.
// Sinon (développement sans .env.local): fichiers JSON du dossier "data/".
const remote = redisStore.isRedisConfigured();

const DATA_DIR = path.join(process.cwd(), "data");
const EMPLOYEES_FILE = path.join(DATA_DIR, "employees.json");
const ATTENDANCE_FILE = path.join(DATA_DIR, "attendance.json");
const RATES_FILE = path.join(DATA_DIR, "rates.json");

// Chaîne toutes les opérations (lecture + modification + écriture) par fichier.
// Indispensable: si on ne sérialisait que l'écriture, deux requêtes lancées
// presque en même temps liraient toutes les deux l'état d'avant, et la
// deuxième écriture écraserait la première (un employé ajouté "disparaît").
const fileLocks = new Map<string, Promise<unknown>>();

function withFileLock<T>(file: string, task: () => Promise<T>): Promise<T> {
  const previous = fileLocks.get(file) ?? Promise.resolve();
  const next = previous.then(task, task);
  fileLocks.set(
    file,
    next.catch(() => undefined),
  );
  return next;
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(
        `Erreur de lecture des données — le fichier ${path.basename(file)} est corrompu. Vérifiez le dossier "data/".`,
      );
    }
    return fallback;
  }
}

async function writeJsonAtomic<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Suffixe unique par appel: évite qu'une écriture concurrente (ex: plusieurs
  // workers de build Next.js) ne se dispute le même fichier temporaire.
  const tmpFile = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpFile, file);
}

/** Lit, modifie et réécrit un fichier comme une seule opération atomique. */
function mutateJson<T>(file: string, fallback: T, mutate: (current: T) => T): Promise<T> {
  return withFileLock(file, async () => {
    const current = await readJson<T>(file, fallback);
    const next = mutate(current);
    await writeJsonAtomic(file, next);
    return next;
  });
}

let seeded = false;
export async function ensureSeed(): Promise<void> {
  if (seeded) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  if (!(await fileExists(EMPLOYEES_FILE))) {
    await writeJsonAtomic(EMPLOYEES_FILE, SEED_EMPLOYEES);
  }
  if (!(await fileExists(ATTENDANCE_FILE))) {
    await writeJsonAtomic(ATTENDANCE_FILE, {});
  }
  if (!(await fileExists(RATES_FILE))) {
    await writeJsonAtomic(RATES_FILE, SEED_RATES);
  }
  seeded = true;
}

export async function readEmployees(): Promise<Employee[]> {
  if (remote) return redisStore.readEmployees();
  await ensureSeed();
  return readJson<Employee[]>(EMPLOYEES_FILE, SEED_EMPLOYEES);
}

export async function addEmployee(employee: Employee): Promise<Employee[]> {
  if (remote) {
    await redisStore.addEmployee(employee);
    return readEmployees();
  }
  await ensureSeed();
  return mutateJson(EMPLOYEES_FILE, SEED_EMPLOYEES, (list) => [...list, employee]);
}

export async function updateEmployee(
  id: string,
  patch: Partial<Pick<Employee, "name" | "role" | "active">>,
): Promise<Employee | null> {
  if (remote) return redisStore.updateEmployee(id, patch);
  await ensureSeed();
  let updated: Employee | null = null;
  await mutateJson(EMPLOYEES_FILE, SEED_EMPLOYEES, (list) =>
    list.map((e) => {
      if (e.id !== id) return e;
      updated = { ...e, ...patch };
      return updated;
    }),
  );
  return updated;
}

export async function readAttendance(): Promise<AttendanceStore> {
  if (remote) return redisStore.readAttendance();
  await ensureSeed();
  return readJson<AttendanceStore>(ATTENDANCE_FILE, {});
}

export async function setAttendanceDay(dateISO: string, entries: AttendanceDay): Promise<AttendanceDay> {
  if (remote) return redisStore.setAttendanceDay(dateISO, entries);
  await ensureSeed();
  const store = await mutateJson(ATTENDANCE_FILE, {} as AttendanceStore, (current) => {
    const next = { ...current };
    if (Object.keys(entries).length === 0) {
      delete next[dateISO];
    } else {
      next[dateISO] = entries;
    }
    return next;
  });
  return store[dateISO] ?? {};
}

export async function readRates(): Promise<Rates> {
  if (remote) return redisStore.readRates();
  await ensureSeed();
  return readJson<Rates>(RATES_FILE, SEED_RATES);
}

export async function updateRates(patch: Partial<Rates>): Promise<Rates> {
  if (remote) return redisStore.updateRates(patch);
  await ensureSeed();
  return mutateJson(RATES_FILE, SEED_RATES, (current) => ({ ...current, ...patch }));
}
