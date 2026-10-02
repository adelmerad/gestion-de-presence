// Copie les données locales (dossier data/) vers la base en ligne Upstash Redis.
// Usage: node --env-file=.env.local scripts/migrate-to-redis.mjs [--force]
import fs from "fs/promises";
import { Redis } from "@upstash/redis";

const force = process.argv.includes("--force");
const redis = Redis.fromEnv({ automaticDeserialization: false });

const readJson = async (name) => JSON.parse(await fs.readFile(`data/${name}.json`, "utf-8"));
const employees = await readJson("employees");
const attendance = await readJson("attendance");
const rates = await readJson("rates");

if (!force && (await redis.hlen("attendance")) > 0) {
  console.error("La base en ligne contient déjà des présences. Relancez avec --force pour les remplacer.");
  process.exit(1);
}

const tx = redis.multi();
tx.del("employees", "employees:order", "attendance", "rates");
for (const e of employees) {
  tx.hset("employees", { [e.id]: JSON.stringify(e) });
  tx.rpush("employees:order", e.id);
}
for (const [date, day] of Object.entries(attendance)) {
  tx.hset("attendance", { [date]: JSON.stringify(day) });
}
tx.hset("rates", rates);
tx.set("seeded", "1");
await tx.exec();

console.log(
  `Terminé: ${employees.length} employés, ${Object.keys(attendance).length} jours de présence, tarifs copiés.`,
);
