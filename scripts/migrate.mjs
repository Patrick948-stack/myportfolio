import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Client } from "pg";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

const projectDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnvConfig(projectDir);

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const migrationsDir = path.join(projectDir, "db/migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const file of files) {
      const sql = readFileSync(path.join(migrationsDir, file), "utf8");
      await client.query(sql);
      console.log(`Migration applied: db/migrations/${file}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
