import { createClient } from "@libsql/client";

type UsageStats = {
  usedBytes: number;
  itemCount: number;
};

let dbClient: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (dbClient) return dbClient;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required");
  }
  dbClient = createClient({ url, authToken });
  return dbClient;
}

let initPromise: Promise<void> | null = null;

async function ensureSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      const db = getDb();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS site_configs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          config_key TEXT UNIQUE NOT NULL,
          data TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        )
      `);
      await db.execute(`
        CREATE INDEX IF NOT EXISTS idx_configs_key ON site_configs(config_key)
      `);
    })();
  }
  await initPromise;
}

export async function getConfig(key: string): Promise<any | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT data FROM site_configs WHERE config_key = ? LIMIT 1",
    args: [key],
  });
  if (result.rows.length === 0) return null;
  try {
    return JSON.parse(result.rows[0].data as string);
  } catch {
    return null;
  }
}

export async function getConfigs(keys: string[]): Promise<Record<string, any>> {
  await ensureSchema();
  if (!keys.length) return {};
  const db = getDb();
  // SQLite doesn't have ANY(), use IN with placeholders
  const placeholders = keys.map(() => "?").join(", ");
  const result = await db.execute({
    sql: `SELECT config_key, data FROM site_configs WHERE config_key IN (${placeholders})`,
    args: keys,
  });
  const out: Record<string, any> = {};
  for (const row of result.rows) {
    try {
      out[row.config_key as string] = JSON.parse(row.data as string);
    } catch {
      // skip unparseable rows
    }
  }
  return out;
}

export async function setConfig(key: string, data: any): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const jsonStr = JSON.stringify(data);
  await db.execute({
    sql: `INSERT INTO site_configs (config_key, data, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT (config_key)
          DO UPDATE SET data = excluded.data, updated_at = datetime('now')`,
    args: [key, jsonStr],
  });
}

export async function setConfigs(payload: Record<string, any>): Promise<void> {
  const entries = Object.entries(payload);
  for (const [key, value] of entries) {
    await setConfig(key, value);
  }
}

export async function getUsageStats(): Promise<UsageStats> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute(
    "SELECT COALESCE(SUM(length(data)), 0) AS used_bytes, COUNT(*) AS item_count FROM site_configs"
  );
  const row = result.rows[0] || { used_bytes: 0, item_count: 0 };
  return {
    usedBytes: Number(row.used_bytes) || 0,
    itemCount: Number(row.item_count) || 0,
  };
}